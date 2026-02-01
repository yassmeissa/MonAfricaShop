import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function StripePayment({ customer, items, total, onClose }) {
  const navigate = useNavigate();

  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm customer={customer} items={items} total={total} onClose={onClose} navigate={navigate} />
    </Elements>
  );
}

function StripePaymentForm({ customer, items, total, onClose, navigate }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Étape 1: Créer une Payment Intent
      const intentResponse = await fetch('http://localhost:5001/api/stripe/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total, email: customer.email })
      });

      const intentData = await intentResponse.json();
      console.log('📡 Réponse create-intent:', intentData);
      
      const { clientSecret } = intentData;
      
      if (!clientSecret) {
        setError('Erreur: Pas de client_secret reçu du serveur');
        setLoading(false);
        return;
      }

      // Étape 2: Confirmer le paiement avec Stripe Elements
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${customer.firstName} ${customer.lastName}`,
            email: customer.email
          }
        }
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // Étape 3: Confirmer le paiement côté serveur
      const headers = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const confirmResponse = await fetch('http://localhost:5001/api/stripe/confirm', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          customer,
          items,
          total
        })
      });

      const order = await confirmResponse.json();

      if (confirmResponse.ok) {
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

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
        <h2 style={styles.title}>Paiement par Carte Bancaire</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.cardElement}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    fontFamily: 'inherit'
                  }
                }
              }}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.summary}>
            <p style={styles.summaryRow}>
              <span>Montant:</span>
              <strong>{total.toFixed(2)} €</strong>
            </p>
          </div>

          <button
            type="submit"
            disabled={!stripe || loading}
            style={{
              ...styles.submitBtn,
              opacity: (!stripe || loading) ? 0.6 : 1
            }}
          >
            {loading ? 'Traitement...' : 'Payer maintenant'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
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
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '24px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  cardElement: {
    padding: '16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: '#f9fafb'
  },
  error: {
    padding: '12px',
    background: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#dc2626',
    fontSize: '0.9rem'
  },
  summary: {
    padding: '16px',
    background: '#f0fdf4',
    borderRadius: '8px',
    border: '1px solid #bbf7d0'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 0,
    color: '#1f2937',
    fontSize: '1rem'
  },
  submitBtn: {
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
