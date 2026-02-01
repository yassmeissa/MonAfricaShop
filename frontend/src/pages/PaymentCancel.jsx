import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function PaymentCancel() {
  const navigate = useNavigate();

  useEffect(() => {
    // Nettoyer les données PayPal
    localStorage.removeItem('paypalOrderId');
    localStorage.removeItem('paypalCustomer');
    localStorage.removeItem('paypalItems');
    localStorage.removeItem('paypalTotal');
  }, []);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.cancelBox}>
          <div style={styles.icon}>⚠️</div>
          <h2 style={styles.title}>Paiement annulé</h2>
          <p style={styles.text}>
            Votre paiement a été annulé. Vous pouvez réessayer à tout moment.
          </p>
          <button
            onClick={() => navigate('/checkout')}
            style={styles.btn}
          >
            Retour au paiement
          </button>
          <button
            onClick={() => navigate('/cart')}
            style={{ ...styles.btn, background: '#ffffff', color: '#059669', border: '2px solid #059669' }}
          >
            Retour au panier
          </button>
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    minHeight: '100vh',
    background: '#f9fafb'
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 40px'
  },
  cancelBox: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '48px 32px',
    textAlign: 'center',
    maxWidth: '400px'
  },
  icon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '12px'
  },
  text: {
    color: '#6b7280',
    fontSize: '1rem',
    marginBottom: '32px'
  },
  btn: {
    display: 'block',
    width: '100%',
    padding: '12px 32px',
    background: '#059669',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '12px',
    fontSize: '1rem'
  }
};
