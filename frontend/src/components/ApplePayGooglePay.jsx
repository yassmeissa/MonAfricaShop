import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';

export default function ApplePayGooglePay({ customer, items, total, onClose, paymentMethod }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleApplePayTest = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simuler Payment Intent
      const fakePaymentIntentId = 'pi_test_' + Math.random().toString(36).substring(7);

      // Créer la commande directement
      const confirmResponse = await fetch(`${API_URL}/api/stripe/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: fakePaymentIntentId,
          customer,
          items,
          total,
          paymentMethod: 'applepay'
        })
      });

      const order = await confirmResponse.json();

      if (confirmResponse.ok) {
        navigate(`/order-confirmation/${order._id}`);
      } else {
        setError(order.message || 'Erreur lors du paiement');
      }
    } catch (err) {
      setError('Erreur: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePayTest = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simuler Payment Intent
      const fakePaymentIntentId = 'pi_test_' + Math.random().toString(36).substring(7);

      // Créer la commande directement
      const confirmResponse = await fetch(`${API_URL}/api/stripe/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: fakePaymentIntentId,
          customer,
          items,
          total,
          paymentMethod: 'googlepay'
        })
      });

      const order = await confirmResponse.json();

      if (confirmResponse.ok) {
        navigate(`/order-confirmation/${order._id}`);
      } else {
        setError(order.message || 'Erreur lors du paiement');
      }
    } catch (err) {
      setError('Erreur: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
        <h2 style={styles.modalTitle}>
          {paymentMethod === 'applepay' ? 'Apple Pay' : 'Google Pay'}
        </h2>

        {!isSupported && (
          <div style={styles.infoBox}>
            <p style={styles.infoText}>
              {paymentMethod === 'applepay'
                ? 'Apple Pay n\'est pas disponible sur cet appareil. Utilisez une carte bancaire.'
                : 'Google Pay n\'est pas disponible sur cet appareil. Utilisez une carte bancaire.'}
            </p>
          </div>
        )}

        <div style={styles.summary}>
          <p style={styles.summaryRow}>
            <span>Montant:</span>
            <strong>{total.toFixed(2)} €</strong>
          </p>
          <p style={styles.summaryRow}>
            <span>Bénéficiaire:</span>
            <strong>{customer.firstName} {customer.lastName}</strong>
          </p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button
          onClick={handleManualPayment}
          disabled={loading || !isSupported}
          style={{
            ...styles.submitBtn,
            opacity: (loading || !isSupported) ? 0.6 : 1
          }}
        >
          {loading ? 'Traitement...' : `Continuer avec ${paymentMethod === 'applepay' ? 'Apple Pay' : 'Google Pay'}`}
        </button>

        <button
          onClick={onClose}
          style={{ ...styles.submitBtn, background: '#ffffff', color: '#059669', border: '2px solid #059669', marginTop: '12px' }}
        >
          Utiliser une carte bancaire
        </button>
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
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '24px'
  },
  infoBox: {
    padding: '16px',
    background: '#eff6ff',
    borderRadius: '8px',
    border: '1px solid #bfdbfe',
    marginBottom: '24px'
  },
  infoText: {
    color: '#1e40af',
    margin: 0,
    fontSize: '0.95rem'
  },
  summary: {
    padding: '16px',
    background: '#f0fdf4',
    borderRadius: '8px',
    border: '1px solid #bbf7d0',
    marginBottom: '24px'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '8px 0',
    color: '#1f2937',
    fontSize: '0.95rem'
  },
  error: {
    padding: '12px',
    background: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#dc2626',
    fontSize: '0.9rem',
    marginBottom: '16px'
  },
  submitBtn: {
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
