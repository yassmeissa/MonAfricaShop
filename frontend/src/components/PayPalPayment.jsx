import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PayPalPayment({ customer, items, total, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handlePayPalPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Créer une commande PayPal
      const createResponse = await fetch('http://localhost:5001/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, items, total })
      });

      const { id, approvalUrl } = await createResponse.json();

      if (!approvalUrl) {
        setError('Impossible de créer la commande PayPal');
        setLoading(false);
        return;
      }

      // Rediriger vers PayPal pour l'approbation
      localStorage.setItem('paypalOrderId', id);
      localStorage.setItem('paypalCustomer', JSON.stringify(customer));
      localStorage.setItem('paypalItems', JSON.stringify(items));
      localStorage.setItem('paypalTotal', total);

      window.location.href = approvalUrl;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
        <h2 style={styles.title}>Paiement PayPal</h2>
        
        <div style={styles.info}>
          <p style={styles.infoText}>
            Vous allez être redirigé vers PayPal pour finaliser votre paiement sécurisé.
          </p>
        </div>

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
          onClick={handlePayPalPayment}
          disabled={loading}
          style={{
            ...styles.submitBtn,
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Redirection...' : 'Continuer vers PayPal'}
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
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '24px'
  },
  info: {
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
