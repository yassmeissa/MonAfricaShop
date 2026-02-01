import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }

    // Vérifier si l'admin est connecté
    const adminToken = localStorage.getItem('token');
    const adminData = localStorage.getItem('user');
    if (adminToken && adminData) {
      const parsedAdminData = JSON.parse(adminData);
      if (parsedAdminData.role === 'admin') {
        setIsAdminLoggedIn(true);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  const navbarStyle = {
    backgroundColor: '#059669',
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 50
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px'
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const desktopNavStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '32px'
  };

  const navLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '8px 0',
    borderBottom: '2px solid transparent',
    transition: 'all 0.3s ease'
  };

  const ctaButtonStyle = {
    backgroundColor: '#ea580c',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '25px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <nav style={navbarStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          {/* Logo */}
          <Link to="/" style={{
            ...logoStyle,
            background: 'linear-gradient(45deg, #ffffff, #fbbf24)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              color: '#1f2937',
              fontSize: '1.3rem',
              letterSpacing: '-1px'
            }}>
              AS
            </div>
            Africa Shop
          </Link>

          {/* Navigation Desktop */}
          <div style={{ ...desktopNavStyle, '@media (max-width: 768px)': { display: 'none' } }}>
            <Link 
              to="/" 
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.target.style.color = '#fbbf24';
                e.target.style.borderBottomColor = '#fbbf24';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'white';
                e.target.style.borderBottomColor = 'transparent';
              }}
            >
              Accueil
            </Link>
            <Link 
              to="/products" 
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.target.style.color = '#fbbf24';
                e.target.style.borderBottomColor = '#fbbf24';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'white';
                e.target.style.borderBottomColor = 'transparent';
              }}
            >
              Produits
            </Link>
            <Link 
              to="/cart" 
              style={{
                ...navLinkStyle,
                border: '2px solid #fbbf24',
                borderRadius: '8px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fbbf24';
                e.currentTarget.style.color = '#1f2937';
                const svg = e.currentTarget.querySelector('svg');
                if (svg) svg.style.stroke = '#1f2937';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#fbbf24';
                const svg = e.currentTarget.querySelector('svg');
                if (svg) svg.style.stroke = '#fbbf24';
              }}
              title="Panier"
            >
              <svg style={{ width: '20px', height: '20px', display: 'inline', marginTop: '2px', marginRight: '6px', stroke: 'currentColor' }} fill="none" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </Link>
            {isLoggedIn ? (
              <Link 
                to="/dashboard" 
                style={ctaButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#dc2626';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ea580c';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                Mon compte
              </Link>
            ) : (
              <Link 
                to="/login" 
                style={ctaButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#dc2626';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ea580c';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                Connexion
              </Link>
            )}
            
            {/* Admin Link */}
            {isAdminLoggedIn && (
              <Link 
                to="/admin/dashboard" 
                style={{
                  fontSize: '0.85rem',
                  color: '#fbbf24',
                  textDecoration: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  display: 'block',
                  textAlign: 'center',
                  border: '2px solid #fbbf24'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#fbbf24';
                  e.target.style.color = '#1f2937';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#fbbf24';
                }}
              >
                 Dashboard Admin
              </Link>
            )}
          </div>

          {/* Menu Mobile Button */}
          <button 
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              display: window.innerWidth <= 768 ? 'block' : 'none'
            }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div style={{ 
            backgroundColor: '#047857', 
            padding: '20px',
            borderRadius: '12px',
            marginTop: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <Link 
              to="/" 
              style={{ 
                display: 'block',
                padding: '12px 0',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              to="/products" 
              style={{ 
                display: 'block',
                padding: '12px 0',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              Produits
            </Link>
            <Link 
              to="/cart" 
              style={{ 
                display: 'block',
                padding: '12px 0',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              Panier
            </Link>
            {isLoggedIn ? (
              <Link 
                to="/dashboard" 
                style={{ 
                  display: 'block',
                  padding: '10px 16px',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '600',
                  backgroundColor: '#ea580c',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  textAlign: 'center'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Mon compte
              </Link>
            ) : (
              <Link 
                to="/login" 
                style={{ 
                  display: 'block',
                  padding: '12px 0',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
            )}
            
            {/* Admin Link Mobile */}
            {isAdminLoggedIn && (
              <>
                <Link 
                  to="/admin/dashboard" 
                  style={{ 
                    display: 'block',
                    padding: '10px 16px',
                    color: '#1f2937',
                    textDecoration: 'none',
                    fontWeight: '600',
                    backgroundColor: '#fbbf24',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    textAlign: 'center'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  🔐 Dashboard Admin
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 16px',
                    color: 'white',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: '0.95rem'
                  }}
                >
                  Déconnexion Admin
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
