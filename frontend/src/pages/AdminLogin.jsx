import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erreur de connexion');
        setLoading(false);
        return;
      }

      // Vérifier si l'utilisateur est admin
      if (data.user.role !== 'admin') {
        setError('Accès admin refusé. Vous n\'êtes pas administrateur.');
        setLoading(false);
        return;
      }

      // Sauvegarder le token et l'utilisateur
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Rediriger vers le dashboard admin
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Erreur de connexion: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🔐 Connexion Admin</h1>
          <p style={styles.subtitle}>Accès réservé aux administrateurs</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@africashop.com"
              required
              style={styles.input}
            />
          </div>

          {/* Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={styles.errorBox}>
              <p style={styles.errorText}>⚠️ {error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        {/* Info Box */}
        <div style={styles.infoBox}>
          <p style={styles.infoTitle}>📝 Identifiants par défaut:</p>
          <p style={styles.infoText}>
            <strong>Email:</strong> admin@africashop.com
          </p>
          <p style={styles.infoText}>
            <strong>Mot de passe:</strong> Admin@123456
          </p>
        </div>

        {/* Back Link */}
        <div style={styles.footer}>
          <button
            onClick={() => navigate('/')}
            style={styles.backBtn}
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  wrapper: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(5, 150, 105, 0.3)',
    maxWidth: '400px',
    width: '100%'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#059669',
    margin: '0 0 12px 0'
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#6b7280',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '24px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  },
  errorBox: {
    background: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '12px 16px',
    marginTop: '8px'
  },
  errorText: {
    color: '#dc2626',
    margin: 0,
    fontSize: '0.95rem'
  },
  submitBtn: {
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
    marginTop: '8px'
  },
  infoBox: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px'
  },
  infoTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#047857',
    margin: '0 0 8px 0'
  },
  infoText: {
    fontSize: '0.85rem',
    color: '#047857',
    margin: '4px 0',
    fontFamily: 'monospace'
  },
  footer: {
    textAlign: 'center'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#059669',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    transition: 'color 0.2s ease'
  }
};
