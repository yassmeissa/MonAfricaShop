import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, clearCart, updateQuantity } from '../utils/cart';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleQuantityChange = (id, qty) => {
    if (qty > 0) {
      updateQuantity(id, qty);
      setCart(getCart());
    }
  };

  if (cart.length === 0) {
    return (
      <main style={styles.page}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Mon panier</h1>
        </div>

        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>🛒</div>
          <h2 style={styles.emptyTitle}>Votre panier est vide</h2>
          <p style={styles.emptyText}>
            Découvrez notre sélection de produits africains authentiques
          </p>
          <button 
            style={styles.primaryBtn} 
            onClick={() => navigate('/products')}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
             Continuer mes achats
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.headerRow}>
        <h1 style={styles.title}>Mon panier</h1>
        <button
          style={styles.headerBtn}
          onClick={() => navigate('/products')}
          onMouseEnter={(e) => e.target.style.background = '#f0fdf4'}
          onMouseLeave={(e) => e.target.style.background = '#ffffff'}
        >
          ← Continuer mes achats
        </button>
      </div>

      <div style={styles.layout}>
        {/* PRODUITS */}
        <section style={styles.card}>
          {cart.map((item) => (
            <div key={item.product._id} style={styles.item}>
              <img
                src={item.product.image}
                alt={item.product.name}
                style={styles.image}
              />

              <div style={{ flex: 1 }}>
                <p style={styles.name}>{item.product.name}</p>
                <p style={styles.unitPrice}>
                  {item.product.price.toFixed(2)} € / unité
                </p>
              </div>

              <div style={styles.qty}>
                <button
                  style={styles.qtyBtn}
                  onClick={() =>
                    handleQuantityChange(item.product._id, item.quantity - 1)
                  }
                  onMouseEnter={(e) => {
                    e.target.style.background = '#059669';
                    e.target.style.color = '#ffffff';
                    e.target.style.borderColor = '#059669';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f9fafb';
                    e.target.style.color = '#059669';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  style={styles.qtyBtn}
                  onClick={() =>
                    handleQuantityChange(item.product._id, item.quantity + 1)
                  }
                  onMouseEnter={(e) => {
                    e.target.style.background = '#059669';
                    e.target.style.color = '#ffffff';
                    e.target.style.borderColor = '#059669';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f9fafb';
                    e.target.style.color = '#059669';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  +
                </button>
              </div>

              <strong style={styles.price}>
                {(item.product.price * item.quantity).toFixed(2)} €
              </strong>

              <button
                style={styles.remove}
                onClick={() => {
                  removeFromCart(item.product._id);
                  setCart(getCart());
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </section>

        {/* RÉSUMÉ */}
        <aside style={styles.summary}>
          <h2 style={styles.summaryTitle}>Résumé</h2>

          <div style={styles.row}>
            <span>Sous-total</span>
            <span>{total.toFixed(2)} €</span>
          </div>

          <div style={styles.row}>
            <span>Livraison</span>
            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Calculée à l'étape suivante</span>
          </div>

          <div style={styles.totalRow}>
            <strong>Total</strong>
            <strong>{total.toFixed(2)} €</strong>
          </div>

          <button
            style={styles.primaryBtn}
            onClick={() => navigate('/checkout')}
          >
            Passer au paiement
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => {
              clearCart();
              setCart([]);
            }}
          >
            Vider le panier
          </button>
        </aside>
      </div>
    </main>
  );
}

/* =======================
   STYLES
======================= */

const styles = {
  page: {
    maxWidth: '1100px',
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
  headerBtn: {
    padding: '10px 16px',
    background: '#ffffff',
    color: '#059669',
    border: '2px solid #059669',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '32px'
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
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    borderBottom: '1px solid #f1f5f9'
  },
  image: {
    width: '64px',
    height: '64px',
    objectFit: 'cover',
    borderRadius: '8px',
    background: '#f3f4f6'
  },
  name: {
    fontWeight: 600,
    marginBottom: '4px'
  },
  unitPrice: {
    fontSize: '0.85rem',
    color: '#6b7280'
  },
  qty: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  qtyBtn: {
    width: '28px',
    height: '28px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    background: '#f9fafb',
    cursor: 'pointer',
    fontWeight: 600,
    color: '#059669',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0
  },
  price: {
    minWidth: '90px',
    textAlign: 'right',
    fontWeight: 600
  },
  remove: {
    background: 'none',
    border: 'none',
    color: 'rgb(249, 115, 22)',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  summary: {
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '20px',
    height: 'fit-content'
  },
  summaryTitle: {
    marginBottom: '16px',
    fontWeight: 600
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    color: '#4b5563'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '16px 0',
    fontSize: '1.1rem',
    fontWeight: 700
  },
  primaryBtn: {
    width: '100%',
    maxWidth: '300px',
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
    marginBottom: '8px'
  },
  secondaryBtn: {
    width: '100%',
    padding: '10px',
    background: '#ffffff',
    border: '2px solid rgb(249, 115, 22)',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'rgb(249, 115, 22)',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  },
  empty: {
    color: '#6b7280',
    marginBottom: '20px'
  }
};