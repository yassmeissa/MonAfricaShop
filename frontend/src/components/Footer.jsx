import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };

    fetchCategories();
  }, []);

  const footerStyle = {
    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    color: 'white',
    padding: '60px 20px 30px 20px'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const topSectionStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '40px',
    marginBottom: '50px'
  };

  const brandSectionStyle = {
    maxWidth: '350px'
  };

  const logoStyle = {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '16px',
    background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent'
  };

  const descriptionStyle = {
    color: '#d1d5db',
    lineHeight: '1.6',
    marginBottom: '20px',
    fontSize: '0.95rem'
  };

  const socialLinksStyle = {
    display: 'flex',
    gap: '12px'
  };

  const socialLinkStyle = {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #059669, #34d399)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: 'white',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(5, 150, 105, 0.2)'
  };

  const columnTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: '20px',
    color: 'white',
    position: 'relative',
    paddingBottom: '10px',
    color: '#fbbf24'
  };

  const linkStyle = {
    color: '#d1d5db',
    textDecoration: 'none',
    fontSize: '0.95rem',
    lineHeight: '2',
    transition: 'all 0.3s ease',
    display: 'block'
  };

  const contactInfoStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px'
  };

  const iconStyle = {
    fontSize: '1.1rem',
    marginTop: '2px',
    color: '#fbbf24'
  };

  const bottomSectionStyle = {
    borderTop: '1px solid #374151',
    paddingTop: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
    textAlign: 'center'
  };

  const copyrightStyle = {
    color: '#9ca3af',
    fontSize: '0.9rem'
  };

  const bottomLinksStyle = {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  };

  const bottomLinkStyle = {
    color: '#d1d5db',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.3s ease'
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={topSectionStyle}>
          {/* Section Marque */}
          <div style={brandSectionStyle}>
            <h3 style={logoStyle}>Africa Shop</h3>
            <p style={descriptionStyle}>
              Votre épicerie africaine de confiance. Nous vous apportons 
              les saveurs authentiques d'Afrique avec des produits de qualité 
              premium sélectionnés avec soin.
            </p>
            <div style={socialLinksStyle}>
              <a 
                href="#" 
                style={socialLinkStyle}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.1)';
                  e.target.style.boxShadow = '0 8px 25px rgba(5, 150, 105, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(5, 150, 105, 0.2)';
                }}
                title="Facebook"
              >
                <svg style={{ width: '22px', height: '22px' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                style={socialLinkStyle}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.1)';
                  e.target.style.boxShadow = '0 8px 25px rgba(5, 150, 105, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(5, 150, 105, 0.2)';
                }}
                title="Instagram"
              >
                <svg style={{ width: '22px', height: '22px' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 15.892c-1.005 1.005-2.354 1.557-3.777 1.557s-2.772-.552-3.777-1.557c-2.079-2.079-2.079-5.474 0-7.553 1.005-1.005 2.354-1.557 3.777-1.557s2.772.552 3.777 1.557c2.079 2.079 2.079 5.474 0 7.553zm3.881-9.988c-.394.394-.394 1.035 0 1.429.394.394 1.035.394 1.429 0 .394-.394.394-1.035 0-1.429-.394-.394-1.035-.394-1.429 0zm-4.322-2.955c-1.556 0-3.029.606-4.123 1.700-1.094 1.094-1.7 2.567-1.7 4.123s.606 3.029 1.7 4.123c1.094 1.094 2.567 1.7 4.123 1.7s3.029-.606 4.123-1.7c1.094-1.094 1.7-2.567 1.7-4.123s-.606-3.029-1.7-4.123c-1.094-1.094-2.567-1.7-4.123-1.7z"/>
                </svg>
              </a>
              <a 
                href="#" 
                style={socialLinkStyle}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.1)';
                  e.target.style.boxShadow = '0 8px 25px rgba(5, 150, 105, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(5, 150, 105, 0.2)';
                }}
                title="Twitter"
              >
                <svg style={{ width: '22px', height: '22px' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-9.997-10.607z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Section Navigation */}
          <div>
            <h4 style={columnTitleStyle}>
              Navigation
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '30px',
                height: '2px',
                background: 'linear-gradient(45deg, #fbbf24, #f59e0b)'
              }}></div>
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              <Link 
                to="/" 
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.target.style.color = '#fbbf24';
                  e.target.style.paddingLeft = '8px';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#d1d5db';
                  e.target.style.paddingLeft = '0';
                }}
              >
                Accueil
              </Link>
              <Link 
                to="/products" 
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.target.style.color = '#fbbf24';
                  e.target.style.paddingLeft = '8px';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#d1d5db';
                  e.target.style.paddingLeft = '0';
                }}
              >
                Nos Produits
              </Link>
              <Link 
                to="/cart" 
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.target.style.color = '#fbbf24';
                  e.target.style.paddingLeft = '8px';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#d1d5db';
                  e.target.style.paddingLeft = '0';
                }}
              >
                Panier
              </Link>
              <Link 
                to="/login" 
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.target.style.color = '#fbbf24';
                  e.target.style.paddingLeft = '8px';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#d1d5db';
                  e.target.style.paddingLeft = '0';
                }}
              >
                Connexion
              </Link>
            </nav>
          </div>

          {/* Section Catégories */}
          <div>
            <h4 style={columnTitleStyle}>
              Catégories
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '30px',
                height: '2px',
                background: 'linear-gradient(45deg, #fbbf24, #f59e0b)'
              }}></div>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {categories.map(category => (
                <a 
                  key={category._id}
                  href="#" 
                  style={linkStyle}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#fbbf24';
                    e.target.style.paddingLeft = '8px';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#d1d5db';
                    e.target.style.paddingLeft = '0';
                  }}
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>

          {/* Section Contact */}
          <div>
            <h4 style={columnTitleStyle}>
              Contact
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '30px',
                height: '2px',
                background: 'linear-gradient(45deg, #fbbf24, #f59e0b)'
              }}></div>
            </h4>
            <div>
              <div style={contactInfoStyle}>
                <span style={iconStyle}>
                  <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <div style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
                  Paris, France
                </div>
              </div>
              <div style={contactInfoStyle}>
                <span style={iconStyle}>
                  <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <div style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
                  01 23 45 67 89
                </div>
              </div>
              <div style={contactInfoStyle}>
                <span style={iconStyle}>
                  <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <div style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
                  contact@africashop.fr
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={bottomSectionStyle}>
          <div style={bottomLinksStyle}>
            <a 
              href="#" 
              style={bottomLinkStyle}
              onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
              onMouseLeave={(e) => e.target.style.color = '#d1d5db'}
            >
              Conditions d'utilisation
            </a>
            <a 
              href="#" 
              style={bottomLinkStyle}
              onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
              onMouseLeave={(e) => e.target.style.color = '#d1d5db'}
            >
              Politique de confidentialité
            </a>
            <a 
              href="#" 
              style={bottomLinkStyle}
              onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
              onMouseLeave={(e) => e.target.style.color = '#d1d5db'}
            >
              Livraisons & Retours
            </a>
          </div>
          <p style={copyrightStyle}>
            © 2025 Africa Shop. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
