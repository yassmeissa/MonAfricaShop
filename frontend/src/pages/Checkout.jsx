import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, clearCart } from '../utils/cart';
import StripePayment from '../components/StripePayment';
import AddressAutocomplete from '../components/AddressAutocomplete';
import EditCheckoutModal from '../components/EditCheckoutModal';

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState('auth'); // 'auth' | 'form'
  const [authType, setAuthType] = useState(null); // 'guest' | 'register'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '', // Pour l'inscription
    address: '',
    addressComplement: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(getCart());
    
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setIsLoggedIn(true);
      setUser(parsedUser);
      setAuthType('register'); // Marquer comme "enregistré"
      // Remplir le formulaire avec les données de l'utilisateur
      setFormData(prev => ({
        ...prev,
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        address: parsedUser.address || '',
        city: parsedUser.city || '',
        postalCode: parsedUser.postalCode || '',
        country: parsedUser.country || ''
      }));
    }
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressSelect = (addressData) => {
    setFormData(prev => ({
      ...prev,
      address: addressData.address,
      city: addressData.city,
      postalCode: addressData.postalCode,
      country: addressData.country
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation des champs obligatoires
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.address || !formData.city || 
        !formData.postalCode || !formData.country) {
      alert('Veuillez remplir tous les champs obligatoires');
      setLoading(false);
      return;
    }

    // Validation du mot de passe si inscription ET utilisateur non connecté
    if (authType === 'register' && !isLoggedIn) {
      if (!formData.password || formData.password.length < 6) {
        alert('Le mot de passe doit contenir au moins 6 caractères');
        setLoading(false);
        return;
      }
      
      // Créer l'utilisateur avant le paiement
      try {
        const response = await fetch('http://localhost:5001/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
            addressComplement: formData.addressComplement,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country
          })
        });

        if (!response.ok) {
          const error = await response.json();
          alert(error.message || 'Erreur lors de l\'inscription');
          setLoading(false);
          return;
        }
      } catch (err) {
        alert('Erreur lors de l\'inscription: ' + err.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setShowPaymentModal(true); // Afficher la modale de paiement
  };

  if (cart.length === 0) {
    return (
      <main style={styles.page}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Paiement</h1>
        </div>
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>🛒</div>
          <h2 style={styles.emptyTitle}>Votre panier est vide</h2>
          <p style={styles.emptyText}>
            Ajoutez des produits avant de procéder au paiement
          </p>
          <button 
            style={styles.primaryBtn} 
            onClick={() => navigate('/products')}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            ← Retour aux produits
          </button>
        </div>
      </main>
    );
  }

  // STEP 1: AUTHENTIFICATION - Ignorer si l'utilisateur est connecté
  if (step === 'auth' && !authType && !isLoggedIn) {
    return (
      <main style={styles.page}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Finaliser votre commande</h1>
        </div>

        <div style={styles.layout}>
          {/* Formulaire Auth */}
          <div style={styles.formSection}>
            <h2 style={styles.sectionTitle}>Authentification</h2>
            <p style={styles.authDescription}>
              Choisissez comment continuer votre achat
            </p>

            <div style={styles.authOptions}>
              <button
                style={{
                  ...styles.authBtn,
                  borderColor: '#059669',
                  background: '#f0fdf4'
                }}
                onClick={() => setAuthType('guest')}
              >
                <div style={styles.authBtnTitle}>👤 Continuer en tant qu'invité</div>
                <div style={styles.authBtnDesc}>Paiement rapide sans inscription</div>
              </button>

              <button
                style={{
                  ...styles.authBtn,
                  borderColor: '#059669',
                  background: '#ffffff'
                }}
                onClick={() => setAuthType('register')}
              >
                <div style={styles.authBtnTitle}>📝 M'inscrire et payer</div>
                <div style={styles.authBtnDesc}>Créer un compte pour mes futures commandes</div>
              </button>
            </div>
          </div>

          {/* Résumé */}
          <OrderSummary cart={cart} styles={styles} />
        </div>
      </main>
    );
  }

  // STEP 2: SHIPPING & PAYMENT
  return (
    <main style={styles.page}>
      <div style={styles.headerRow}>
        <h1 style={styles.title}>Finaliser votre commande</h1>
      </div>

      <div style={styles.layout}>
        {/* Formulaire */}
        <form style={styles.formSection} onSubmit={handleSubmit}>
          {/* Si connecté: Afficher un résumé simple avec option de modification */}
          {isLoggedIn ? (
            <>
              {/* Résumé de l'utilisateur */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Récapitulatif de vos informations</h2>
                
                <div style={styles.summaryBox}>
                  <div style={styles.summaryRow}>
                    <div>
                      <p style={styles.summaryLabel}>Nom</p>
                      <p style={styles.summaryValue}>{formData.firstName} {formData.lastName}</p>
                    </div>
                    <div>
                      <p style={styles.summaryLabel}>Email</p>
                      <p style={styles.summaryValue}>{formData.email}</p>
                    </div>
                  </div>
                  <div style={styles.summaryRow}>
                    <div>
                      <p style={styles.summaryLabel}>Téléphone</p>
                      <p style={styles.summaryValue}>{formData.phone || '-'}</p>
                    </div>
                  </div>

                  {formData.address && (
                    <>
                      <div style={styles.separator}></div>
                      <p style={styles.summaryLabel}>Adresse de livraison</p>
                      <p style={styles.summaryValue}>{formData.address}</p>
                      {formData.postalCode && formData.city && (
                        <p style={styles.summaryValue}>{formData.postalCode} {formData.city}</p>
                      )}
                      {formData.country && (
                        <p style={styles.summaryValue}>{formData.country}</p>
                      )}
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  style={styles.editLink}
                >
                  <i className="fas fa-edit"></i> Modifier mes informations
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Formulaire complet pour les invités/nouveaux utilisateurs */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Informations personnelles</h2>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Prénom *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nom *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                    />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Téléphone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </div>

                {authType === 'register' && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Mot de passe *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Minimum 6 caractères"
                      required
                      style={styles.input}
                    />
                  </div>
                )}
              </div>

              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Adresse de livraison</h2>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Adresse *</label>
                  <AddressAutocomplete
                    value={formData.address}
                    onChange={(value) => setFormData(prev => ({ ...prev, address: value }))}
                    onAddressSelect={handleAddressSelect}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Complément d'adresse</label>
                  <input
                    type="text"
                    name="addressComplement"
                    placeholder="Apt, bâtiment, etc. (optionnel)"
                    value={formData.addressComplement}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Ville *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Code postal *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                    />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Pays *</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </div>
              </div>
            </>
          )}

          {/* Moyen de paiement */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Moyen de paiement</h2>
            
            <div style={styles.paymentInfo}>
              <div style={styles.paymentInfoContent}>
                <div style={styles.paymentInfoTitle}>💳 Carte bancaire</div>
                <div style={styles.paymentInfoDesc}>Visa, Mastercard, CB - Paiement sécurisé par Stripe</div>
              </div>
            </div>

            <div style={styles.cardFormSection}>
              <p style={styles.cardFormLabel}>Vos données de carte sont traitées de manière sécurisée par Stripe. Aucun stockage sur nos serveurs.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
              }
            }}
          >
            {loading ? 'Traitement du paiement...' : 'Payer maintenant'}
          </button>

          <button
            type="button"
            onClick={() => setAuthType(null)}
            style={styles.backBtn}
            onMouseEnter={(e) => e.target.style.background = '#f0fdf4'}
            onMouseLeave={(e) => e.target.style.background = '#ffffff'}
          >
            ← Retour
          </button>
        </form>

        {/* Résumé */}
        <OrderSummary cart={cart} styles={styles} />
      </div>

      {/* Modalité Stripe */}
      {showPaymentModal && (
        <StripePayment
          customer={formData}
          items={cart}
          total={total}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* Modal pour modifier les informations */}
      {showEditModal && (
        <EditCheckoutModal
          formData={formData}
          onClose={() => setShowEditModal(false)}
          handleInputChange={handleInputChange}
          handleAddressSelect={handleAddressSelect}
        />
      )}
    </main>
  );
}

// Composant réutilisable pour le résumé
function OrderSummary({ cart, styles }) {
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <aside style={styles.summaryPanel}>
      <h2 style={styles.summaryTitle}>Résumé de commande</h2>

      <div style={styles.cartItems}>
        {cart.map((item) => (
          <div key={item.product._id} style={styles.cartItem}>
            <div style={styles.cartItemInfo}>
              <p style={styles.cartItemName}>{item.product.name}</p>
              <p style={styles.cartItemQty}>Qty: {item.quantity}</p>
            </div>
            <p style={styles.cartItemPrice}>
              {(item.product.price * item.quantity).toFixed(2)}€
            </p>
          </div>
        ))}
      </div>

      <div style={styles.separator} />

      <div style={styles.row}>
        <span>Sous-total</span>
        <span>{total.toFixed(2)} €</span>
      </div>

      <div style={styles.row}>
        <span>Livraison</span>
        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Calculée à l'étape suivante</span>
      </div>

      <div style={styles.separator} />

      <div style={styles.totalRow}>
        <strong>Total</strong>
        <strong>{total.toFixed(2)} €</strong>
      </div>

      <div style={styles.infoBox}>
        ✓ Paiement sécurisé
      </div>
    </aside>
  );
}

/* =======================
   STYLES
======================= */

const styles = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    background: '#f9fafb',
    minHeight: '100vh'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: 0
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 40px',
    background: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
    textAlign: 'center'
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '24px',
    opacity: 0.5
  },
  emptyTitle: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '12px'
  },
  emptyText: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '32px',
    maxWidth: '400px'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px'
  },
  formSection: {
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '32px'
  },
  section: {
    marginBottom: '32px'
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '16px'
  },
  authDescription: {
    fontSize: '0.95rem',
    color: '#6b7280',
    marginBottom: '24px'
  },
  authOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  authBtn: {
    padding: '16px',
    border: '2px solid',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    fontSize: '1rem'
  },
  authBtnTitle: {
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '4px'
  },
  authBtnDesc: {
    fontSize: '0.85rem',
    color: '#6b7280'
  },
  paymentMethods: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px'
  },
  paymentBtn: {
    padding: '16px',
    border: '2px solid',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#ffffff'
  },
  paymentBtnRadio: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioCircle: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid #d1d5db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#ffffff'
  },
  paymentBtnContent: {
    flex: 1
  },
  paymentBtnTitle: {
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '2px'
  },
  paymentBtnDesc: {
    fontSize: '0.85rem',
    color: '#6b7280'
  },
  paymentInfo: {
    padding: '16px',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '12px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  paymentInfoContent: {
    flex: 1
  },
  paymentInfoTitle: {
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '4px'
  },
  paymentInfoDesc: {
    fontSize: '0.9rem',
    color: '#6b7280'
  },
  cardFormLabel: {
    fontSize: '0.9rem',
    color: '#6b7280',
    margin: 0
  },
  cardFormSection: {
    padding: '20px',
    background: '#f9fafb',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    marginBottom: '24px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '8px'
  },
  input: {
    padding: '12px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease'
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
    marginTop: '16px',
    marginBottom: '8px'
  },
  summaryBox: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px'
  },
  summaryRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px'
  },
  summaryLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px'
  },
  summaryValue: {
    fontSize: '0.95rem',
    color: '#1f2937',
    fontWeight: '500',
    margin: '0'
  },
  separator: {
    height: '1px',
    background: '#e5e7eb',
    margin: '16px 0'
  },
  editLink: {
    background: 'none',
    border: 'none',
    color: '#059669',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
    padding: '0',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&:hover': {
      color: '#047857'
    }
  },
  backBtn: {
    width: '100%',
    padding: '12px',
    background: '#ffffff',
    border: '2px solid #059669',
    borderRadius: '8px',
    color: '#059669',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  summaryPanel: {
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '24px',
    height: 'fit-content',
    position: 'sticky',
    top: '20px'
  },
  summaryTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '20px'
  },
  cartItems: {
    marginBottom: '20px',
    maxHeight: '300px',
    overflowY: 'auto'
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '12px',
    marginBottom: '12px',
    borderBottom: '1px solid #f1f5f9'
  },
  cartItemInfo: {
    flex: 1
  },
  cartItemName: {
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px'
  },
  cartItemQty: {
    fontSize: '0.85rem',
    color: '#6b7280'
  },
  cartItemPrice: {
    fontWeight: '600',
    color: '#059669',
    minWidth: '80px',
    textAlign: 'right'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    color: '#4b5563',
    fontSize: '0.95rem'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
    fontSize: '1.1rem',
    fontWeight: '700'
  },
  infoBox: {
    padding: '12px',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    color: '#059669',
    fontSize: '0.9rem',
    textAlign: 'center',
    marginBottom: '16px'
  },
  primaryBtn: {
    width: '100%',
    maxWidth: '300px',
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
    marginBottom: '8px'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    position: 'relative'
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280'
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '24px'
  },
  modalText: {
    color: '#6b7280',
    marginBottom: '24px',
    lineHeight: 1.5
  },
  summary: {
    padding: '16px',
    background: '#f0fdf4',
    borderRadius: '8px',
    border: '1px solid #bbf7d0',
    marginBottom: '24px'
  },
  modalSubmitBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};
