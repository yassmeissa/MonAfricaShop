import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const finishPayment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get('token');

        if (!orderId) {
          setError('ID commande manquant');
          return;
        }

        // Récupérer les données sauvegardées
        const customer = JSON.parse(localStorage.getItem('paypalCustomer') || '{}');
        const items = JSON.parse(localStorage.getItem('paypalItems') || '[]');
        const total = parseFloat(localStorage.getItem('paypalTotal') || '0');

        // Capturer le paiement
        const response = await fetch(`${API_URL}/api/paypal/capture`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, customer, items, total })
        });

        const order = await response.json();

        if (response.ok) {
          localStorage.removeItem('paypalOrderId');
          localStorage.removeItem('paypalCustomer');
          localStorage.removeItem('paypalItems');
          localStorage.removeItem('paypalTotal');
          navigate(`/order-confirmation/${order._id}`);
        } else {
          setError(order.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    finishPayment();
  }, [navigate]);

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.spinner} />
          <h2>Finalisation de votre paiement...</h2>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorBox}>
            <h2>Erreur lors du paiement</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate('/cart')}
              style={styles.btn}
            >
              Retour au panier
            </button>
          </div>
        </div>
      </main>
    );
  }

  return null;
}

const styles = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    minHeight: '100vh'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 40px'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #059669',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  errorBox: {
    background: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    maxWidth: '400px'
  },
  btn: {
    padding: '12px 32px',
    background: '#059669',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '16px'
  }
};
