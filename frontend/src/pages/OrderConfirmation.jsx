import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clearCart } from '../utils/cart';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setOrder(data);
        // Vider le panier après un paiement réussi
        clearCart();
      } catch (err) {
        console.error('Erreur lors du chargement de la commande:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Chargement de votre commande...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={styles.page}>
        <div style={styles.errorContainer}>
          <h1 style={styles.errorTitle}>Erreur</h1>
          <p style={styles.errorText}>{error}</p>
          <button 
            style={styles.primaryBtn}
            onClick={() => navigate('/products')}
          >
            Retour aux produits
          </button>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main style={styles.page}>
        <div style={styles.errorContainer}>
          <h1 style={styles.errorTitle}>Commande introuvable</h1>
          <button 
            style={styles.primaryBtn}
            onClick={() => navigate('/products')}
          >
            Retour aux produits
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      {/* Header avec succès */}
      <div style={styles.successHeader}>
        <div style={styles.successIcon}>✓</div>
        <h1 style={styles.successTitle}>Commande confirmée!</h1>
        <p style={styles.successDescription}>
          Merci pour votre achat. Vous recevrez bientôt un email de confirmation.
        </p>
      </div>

      <div style={styles.container}>
        {/* Numéro de commande */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Détails de votre commande</h2>
          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}>
              <p style={styles.detailLabel}>Numéro de commande</p>
              <p style={styles.detailValue}>{order._id.substring(0, 12)}</p>
            </div>
            <div style={styles.detailItem}>
              <p style={styles.detailLabel}>Date</p>
              <p style={styles.detailValue}>
                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div style={styles.detailItem}>
              <p style={styles.detailLabel}>Statut</p>
              <p style={{...styles.detailValue, ...styles.statusBadge}}>
                {order.status === 'paid' ? 'Payée' : order.status}
              </p>
            </div>
            <div style={styles.detailItem}>
              <p style={styles.detailLabel}>Montant total</p>
              <p style={styles.detailValue}>{order.total.toFixed(2)} €</p>
            </div>
          </div>
        </div>

        {/* Infos client */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Informations de livraison</h2>
          <div style={styles.shippingInfo}>
            <div>
              <p style={styles.infoLabel}>Destinataire</p>
              <p style={styles.infoValue}>
                {order.customer.firstName} {order.customer.lastName}
              </p>
            </div>
            <div>
              <p style={styles.infoLabel}>Email</p>
              <p style={styles.infoValue}>{order.customer.email}</p>
            </div>
            <div>
              <p style={styles.infoLabel}>Téléphone</p>
              <p style={styles.infoValue}>{order.customer.phone}</p>
            </div>
            <div style={styles.fullWidth}>
              <p style={styles.infoLabel}>Adresse</p>
              <p style={styles.infoValue}>{order.customer.address}</p>
              {order.customer.addressComplement && (
                <p style={styles.infoValue}>{order.customer.addressComplement}</p>
              )}
              <p style={styles.infoValue}>
                {order.customer.postalCode} {order.customer.city}
              </p>
              <p style={styles.infoValue}>{order.customer.country}</p>
            </div>
          </div>
        </div>

        {/* Articles commandés */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Articles commandés</h2>
          <div style={styles.itemsList}>
            {order.items.map((item, index) => (
              <div key={index} style={styles.itemRow}>
                <div style={styles.itemInfo}>
                  <p style={styles.itemName}>{item.productName}</p>
                  <p style={styles.itemDetails}>
                    Quantité: {item.quantity} × {item.price.toFixed(2)}€
                  </p>
                </div>
                <p style={styles.itemPrice}>
                  {(item.price * item.quantity).toFixed(2)}€
                </p>
              </div>
            ))}
            <div style={styles.separator}></div>
            <div style={styles.totalRow}>
              <span>Total</span>
              <span style={styles.totalAmount}>{order.total.toFixed(2)}€</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actionsContainer}>
          <button 
            style={styles.primaryBtn}
            onClick={() => navigate('/products')}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(5, 150, 105, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
            }}
          >
            Continuer vos achats
          </button>
          <button 
            style={styles.secondaryBtn}
            onClick={() => navigate('/dashboard')}
            onMouseEnter={(e) => {
              e.target.style.background = '#f0fdf4';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#ffffff';
            }}
          >
            Voir mes commandes
          </button>
        </div>

        {/* Info message */}
        <div style={styles.infoMessage}>
          <p>
            <strong>📧 Email de confirmation:</strong> Un email avec les détails de votre commande a été envoyé à {order.customer.email}
          </p>
          <p>
            <strong>🚚 Livraison:</strong> Vous recevrez votre commande dans 3-5 jours ouvrables.
          </p>
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    padding: '40px 20px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 40px',
    background: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #059669',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '1rem',
    color: '#6b7280',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 40px',
    background: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: '12px',
  },
  errorText: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '32px',
  },
  successHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '40px 20px',
    marginBottom: '40px',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    borderRadius: '16px',
    color: '#ffffff',
  },
  successIcon: {
    fontSize: '80px',
    fontWeight: 'bold',
    marginBottom: '16px',
    background: 'rgba(255, 255, 255, 0.2)',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 12px 0',
  },
  successDescription: {
    fontSize: '1.1rem',
    opacity: 0.95,
    margin: 0,
    maxWidth: '400px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  cardTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '2px solid #059669',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  detailValue: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    background: '#d1fae5',
    color: '#065f46',
    borderRadius: '6px',
    textAlign: 'center',
    fontSize: '0.95rem',
  },
  shippingInfo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  infoLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  infoValue: {
    fontSize: '0.95rem',
    color: '#1f2937',
    margin: 0,
    marginBottom: '4px',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '16px',
    marginBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '6px',
    margin: 0,
  },
  itemDetails: {
    fontSize: '0.9rem',
    color: '#6b7280',
    margin: 0,
  },
  itemPrice: {
    fontWeight: '600',
    color: '#059669',
    fontSize: '1rem',
    textAlign: 'right',
    margin: 0,
  },
  separator: {
    height: '1px',
    background: '#e5e7eb',
    margin: '16px 0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1f2937',
  },
  totalAmount: {
    fontSize: '1.3rem',
    color: '#059669',
  },
  actionsContainer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '24px',
  },
  primaryBtn: {
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
  },
  secondaryBtn: {
    padding: '14px 32px',
    background: '#ffffff',
    color: '#059669',
    border: '2px solid #059669',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  infoMessage: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '12px',
    padding: '20px',
    color: '#047857',
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
};
