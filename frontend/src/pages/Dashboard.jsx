import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { API_URL } from '../config/api';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/orders/my`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getFilteredOrders = () => {
    let filtered = [...orders];

    // Filtre par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Filtre par date
    if (filterDate !== 'all') {
      const now = new Date();
      const orderDate = new Date();
      
      if (filterDate === '7days') {
        orderDate.setDate(now.getDate() - 7);
      } else if (filterDate === '30days') {
        orderDate.setDate(now.getDate() - 30);
      } else if (filterDate === '90days') {
        orderDate.setDate(now.getDate() - 90);
      } else if (filterDate === 'year') {
        orderDate.setFullYear(now.getFullYear() - 1);
      }

      filtered = filtered.filter(order => new Date(order.createdAt) >= orderDate);
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p>Chargement...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* Header avec gradient */}
        <div style={styles.headerBanner}>
          <div style={styles.headerContent}>
            <div>
              <h1 style={styles.title}>Bonjour, <span style={styles.nameHighlight}>{user.firstName}</span></h1>
              <p style={styles.subtitle}>Bienvenue sur votre espace personnel</p>
            </div>
            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 16px rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.2)';
              }}
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Stats rapides */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}><i className="fas fa-shopping-cart"></i></div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>Commandes totales</p>
              <p style={styles.statValue}>{filteredOrders.length}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}><i className="fas fa-euro-sign"></i></div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>Montant total</p>
              <p style={styles.statValue}>{filteredOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0).toFixed(2)}€</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}><i className="fas fa-calendar"></i></div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>Dernière commande</p>
              <p style={styles.statValue}>{filteredOrders.length > 0 ? new Date(filteredOrders[0].createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '-'}</p>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div style={styles.contentSection}>
          {/* Informations personnelles - Plus compact */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Mes informations</h2>
            </div>

            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>Prénom</label>
                <p style={styles.infoValue}>{user.firstName}</p>
              </div>
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>Nom</label>
                <p style={styles.infoValue}>{user.lastName}</p>
              </div>
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>Email</label>
                <p style={styles.infoValue}>{user.email}</p>
              </div>
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>Téléphone</label>
                <p style={styles.infoValue}>{user.phone || '-'}</p>
              </div>
            </div>

            {user.address && (
              <>
                <div style={styles.separator}></div>
                <p style={styles.addressTitle}>Adresse de livraison</p>
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <label style={styles.infoLabel}>Adresse</label>
                    <p style={styles.infoValue}>{user.address}</p>
                  </div>
                  <div style={styles.infoItem}>
                    <label style={styles.infoLabel}>Code postal</label>
                    <p style={styles.infoValue}>{user.postalCode}</p>
                  </div>
                  <div style={styles.infoItem}>
                    <label style={styles.infoLabel}>Ville</label>
                    <p style={styles.infoValue}>{user.city}</p>
                  </div>
                  <div style={styles.infoItem}>
                    <label style={styles.infoLabel}>Pays</label>
                    <p style={styles.infoValue}>{user.country}</p>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => setShowEditModal(true)}
              style={styles.compactBtn}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 16px rgba(5, 150, 105, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 8px rgba(5, 150, 105, 0.2)';
              }}
            >
              Modifier mes informations
            </button>
          </div>

          {/* Commandes */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Mes commandes</h2>
            </div>

            {/* Filtres */}
            <div style={styles.filterSection}>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Statut</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="paid">Payée</option>
                  <option value="pending">En attente</option>
                </select>
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Période</label>
                <select 
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="all">Toutes les dates</option>
                  <option value="7days">7 derniers jours</option>
                  <option value="30days">30 derniers jours</option>
                  <option value="90days">90 derniers jours</option>
                  <option value="year">Dernière année</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>Aucune commande correspondant aux filtres</p>
                <button
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterDate('all');
                  }}
                  style={{...styles.compactBtn, background: '#ffffff', border: '2px solid #059669', color: '#059669'}}
                  onMouseEnter={(e) => e.target.style.background = '#f0fdf4'}
                  onMouseLeave={(e) => e.target.style.background = '#ffffff'}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div style={styles.ordersGrid}>
                {filteredOrders.map((order) => (
                  <div key={order._id} style={styles.orderCard}>
                    <div style={styles.orderCardHeader}>
                      <div>
                        <p style={styles.orderNumber}>Commande #{order._id.slice(-8).toUpperCase()}</p>
                        <p style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      </div>
                      <span style={{
                        ...styles.orderStatusBadge,
                        background: order.status === 'paid' ? '#d1fae5' : '#fef3c7',
                        color: order.status === 'paid' ? '#065f46' : '#92400e'
                      }}>
                        {order.status === 'paid' ? '✓ Payée' : '⏳ En attente'}
                      </span>
                    </div>
                    <div style={styles.orderCardBody}>
                      <div style={styles.orderItems}>
                        {order.items && order.items.length > 0 ? (
                          <>
                            <p style={styles.itemsLabel}>{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                            {order.items.map((item, idx) => (
                              <div key={idx} style={styles.orderItemRow}>
                                <span style={styles.itemName}>{item.product?.name || 'Produit supprimé'}</span>
                                <span style={styles.itemQty}>x{item.quantity}</span>
                              </div>
                            ))}
                          </>
                        ) : (
                          <p style={styles.itemsLabel}>Pas de détails disponibles</p>
                        )}
                      </div>
                    </div>
                    <div style={styles.orderCardFooter}>
                      <span style={styles.amountLabel}>Total</span>
                      <span style={styles.amountValue}>{parseFloat(order.total).toFixed(2)}€</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {orders.length > 0 && (
              <button
                onClick={() => navigate('/')}
                style={styles.compactBtn}
                onMouseEnter={(e) => e.target.style.background = '#f0fdf4'}
                onMouseLeave={(e) => e.target.style.background = '#ffffff'}
              >
                Continuer mes achats
              </button>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedUser) => setUser(updatedUser)}
        />
      )}
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    padding: '60px 140px'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px'
  },
  headerBanner: {
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    borderRadius: '16px',
    padding: '40px',
    marginBottom: '40px',
    color: '#ffffff',
    boxShadow: '0 10px 30px rgba(5, 150, 105, 0.2)'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px'
  },
  nameHighlight: {
    color: '#d1fae5'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#d1fae5',
    margin: '0',
    fontWeight: '500'
  },
  logoutBtn: {
    padding: '12px 28px',
    background: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 8px rgba(239, 68, 68, 0.2)',
    whiteSpace: 'nowrap'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s ease',
    cursor: 'default'
  },
  statIcon: {
    fontSize: '2.5rem'
  },
  statContent: {
    flex: 1
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#6b7280',
    margin: '0 0 4px 0',
    fontWeight: '500'
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '24px',
    marginBottom: '40px'
  },
  contentSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    paddingBottom: '16px',
    borderBottom: '2px solid #f3f4f6'
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0'
  },
  cardIcon: {
    fontSize: '1.8rem'
  },
  infoSection: {
    marginBottom: '28px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px'
  },
  infoItem: {
    paddingBottom: '8px'
  },
  infoRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px'
  },
  infoField: {
    paddingBottom: '16px'
  },
  infoLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
    display: 'block'
  },
  infoValue: {
    fontSize: '1rem',
    color: '#1f2937',
    margin: '0',
    fontWeight: '500'
  },
  separator: {
    height: '1px',
    background: '#e5e7eb',
    margin: '20px 0'
  },
  addressTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#059669',
    margin: '0 0 16px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  primaryBtn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 8px rgba(5, 150, 105, 0.2)'
  },
  compactBtn: {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 8px rgba(5, 150, 105, 0.2)',
    display: 'inline-block',
    marginTop: '16px'
  },
  ordersList: {
    marginBottom: '24px'
  },
  orderItem: {
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  orderTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  orderNumber: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 4px 0'
  },
  orderDate: {
    fontSize: '0.9rem',
    color: '#6b7280',
    margin: '0'
  },
  orderStatusBadge: {
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  orderAmount: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  amountLabel: {
    fontSize: '0.9rem',
    color: '#6b7280',
    fontWeight: '500'
  },
  amountValue: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#059669'
  },
  secondaryBtn: {
    width: '100%',
    padding: '12px',
    background: '#ffffff',
    border: '2px solid #059669',
    borderRadius: '8px',
    color: '#059669',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    marginBottom: '24px'
  },
  emptyIcon: {
    fontSize: '3rem',
    margin: '0 0 12px 0'
  },
  emptyText: {
    fontSize: '1.1rem',
    color: '#6b7280',
    margin: '0 0 24px 0',
    fontWeight: '500'
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '16px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #059669',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  filterSection: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    padding: '16px',
    background: '#f9fafb',
    borderRadius: '8px',
    flexWrap: 'wrap'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: '200px'
  },
  filterLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#1f2937',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  filterSelect: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.95rem',
    background: '#ffffff',
    color: '#1f2937',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
  },
  ordersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  orderCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.2s ease'
  },
  orderCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px',
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },
  orderCardBody: {
    padding: '16px',
    flex: 1
  },
  orderItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  itemsLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#6b7280',
    margin: '0 0 8px 0',
    textTransform: 'uppercase'
  },
  orderItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: '#4b5563'
  },
  itemName: {
    fontWeight: '500'
  },
  itemQty: {
    color: '#6b7280',
    fontSize: '0.85rem'
  },
  orderCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#f0fdf4',
    borderTop: '1px solid #bbf7d0'
  }
};
