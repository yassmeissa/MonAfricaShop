import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      setLoading(false);
    }
  };

  const heroStyle = {
    background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
    color: 'white',
    padding: '100px 20px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all 1.2s ease-out'
  };

  const heroOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.1)',
    zIndex: 1
  };

  const heroContentStyle = {
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
    margin: '0 auto'
  };

  const titleStyle = {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '800',
    marginBottom: '24px',
    lineHeight: '1.1',
    background: 'linear-gradient(45deg, #ffffff, #fbbf24)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'all 1.5s ease-out 0.3s'
  };

  const subtitleStyle = {
    fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
    marginBottom: '40px',
    lineHeight: '1.6',
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '300',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'all 1.5s ease-out 0.6s'
  };

  const ctaButtonStyle = {
    background: 'linear-gradient(45deg, #ea580c, #dc2626)',
    color: 'white',
    padding: '18px 40px',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-block',
    boxShadow: '0 8px 25px rgba(234, 88, 12, 0.3)',
    border: '2px solid transparent',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
    transition: 'all 1.5s ease-out 0.9s, transform 0.4s ease, box-shadow 0.4s ease',
    animation: isVisible ? 'pulse 2s infinite' : 'none'
  };

  const sectionStyle = {
    padding: '80px 20px'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const sectionTitleStyle = {
    fontSize: 'clamp(2rem, 4vw, 2.75rem)',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '60px',
    color: '#1f2937',
    position: 'relative',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'all 1s ease-out 1.2s'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '40px 32px 32px',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid #e5e7eb',
    position: 'relative',
    overflow: 'hidden',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
    animation: isVisible ? 'fadeInUp 1s ease-out forwards' : 'none',
    minHeight: '240px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '12px'
  };

  const animationStyles = `
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 8px 25px rgba(234, 88, 12, 0.3);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 15px 40px rgba(234, 88, 12, 0.4);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    /* Effets hover pour les catégories */
    .category-card:hover .category-top-bar {
      transform: scaleX(1) !important;
    }

    .category-card:hover .category-title {
      color: #059669 !important;
    }

    .category-card:hover .category-hover-indicator {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;

  const cardTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#1f2937',
    letterSpacing: '-0.01em'
  };

  const cardDescStyle = {
    color: '#6b7280',
    marginBottom: '16px',
    lineHeight: '1.6',
    fontSize: '0.95rem'
  };

  const advantageIconStyle = {
    fontSize: '4rem', 
    marginBottom: '20px',
    borderRadius: '50%',
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px auto',
    transition: 'all 0.4s ease',
    animation: isVisible ? 'float 4s ease-in-out infinite' : 'none'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <style>{animationStyles}</style>
      
      {/* Section Hero */}
      <section style={heroStyle}>
        <div style={heroOverlayStyle}></div>
        <div style={heroContentStyle}>
          <h1 style={titleStyle}>
            Saveurs Authentiques d'Afrique
          </h1>
          <p style={subtitleStyle}>
            Découvrez notre sélection premium de produits africains. 
            Épices rares, fruits exotiques et spécialités culinaires 
            livrés avec passion dans toute la France.
          </p>
          <Link 
            to="/products" 
            style={ctaButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.05)';
              e.target.style.boxShadow = '0 15px 35px rgba(234, 88, 12, 0.4)';
              e.target.style.borderColor = '#fbbf24';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(234, 88, 12, 0.3)';
              e.target.style.borderColor = 'transparent';
            }}
          >
            Explorez notre collection
          </Link>
        </div>
      </section>

      {/* Section Catégories */}
      <section style={{ ...sectionStyle, backgroundColor: 'white' }}>
        <div style={containerStyle}>
          <h2 style={sectionTitleStyle}>
            Nos Spécialités
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(45deg, #059669, #fbbf24)',
              borderRadius: '2px',
              opacity: isVisible ? 1 : 0,
              transition: 'all 1s ease-out 1.5s'
            }}></div>
          </h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Chargement des catégories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Aucune catégorie disponible</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '40px' 
            }}>
              {categories.map((category, idx) => {
                const getGradientColor = (idx) => {
                  const gradients = [
                    { top: '#ea580c', bottom: '#dc2626' },
                    { top: '#059669', bottom: '#34d399' },
                    { top: '#fbbf24', bottom: '#f59e0b' },
                    { top: '#3b82f6', bottom: '#2563eb' },
                    { top: '#8b5cf6', bottom: '#7c3aed' },
                    { top: '#ec4899', bottom: '#db2777' }
                  ];
                  return gradients[idx % gradients.length];
                };

                const gradient = getGradientColor(idx);

                return (
                  <Link
                    key={category._id}
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div 
                      className="category-card"
                      style={{
                        ...cardStyle,
                        animationDelay: `${0.2 + idx * 0.2}s`,
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                        e.currentTarget.style.borderColor = '#059669';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                    >
                      {/* Barre de couleur en haut */}
                      <div 
                        className="category-top-bar"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: `linear-gradient(90deg, ${gradient.top}, ${gradient.bottom})`,
                          borderRadius: '16px 16px 0 0',
                          transform: 'scaleX(0)',
                          transformOrigin: 'left',
                          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      ></div>
                      
                      <h3 
                        className="category-title"
                        style={{
                          ...cardTitleStyle,
                          transition: 'color 0.3s ease',
                          marginTop: '0'
                        }}
                      >
                        {category.name}
                      </h3>
                      
                      <p style={cardDescStyle}>
                        {category.description}
                      </p>
                      
                      {/* Indicateur hover - apparaît au survol */}
                      <div 
                        className="category-hover-indicator"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          color: '#059669',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          opacity: 0,
                          transform: 'translateY(8px)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        <span>Explorer</span>
                        <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Section Avantages */}
      <section style={{ ...sectionStyle, backgroundColor: '#f8fafc' }}>
        <div style={containerStyle}>
          <h2 style={{
            ...sectionTitleStyle,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s ease-out 2s'
          }}>
            L'Excellence Africa Shop
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(45deg, #059669, #fbbf24)',
              borderRadius: '2px',
              opacity: isVisible ? 1 : 0,
              transition: 'all 1s ease-out 2.3s'
            }}></div>
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '40px'
          }}>
            <div style={{ 
              textAlign: 'center',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 1s ease-out 2.2s'
            }}>
              <div style={{ 
                ...advantageIconStyle,
                background: 'linear-gradient(45deg, #059669, #34d399)',
                boxShadow: '0 15px 40px rgba(5, 150, 105, 0.2)',
                animationDelay: '1s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1) rotate(5deg)';
                e.target.style.boxShadow = '0 20px 50px rgba(5, 150, 105, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1) rotate(0deg)';
                e.target.style.boxShadow = '0 15px 40px rgba(5, 150, 105, 0.2)';
              }}>
                <svg style={{ width: '50px', height: '50px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                Livraison Express
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Livraison rapide 24-48h dans toute la France métropolitaine. 
                Emballage soigné pour préserver la fraîcheur.
              </p>
            </div>

            <div style={{ 
              textAlign: 'center',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 1s ease-out 2.4s'
            }}>
              <div style={{ 
                ...advantageIconStyle,
                background: 'linear-gradient(45deg, #ea580c, #dc2626)',
                boxShadow: '0 15px 40px rgba(234, 88, 12, 0.2)',
                animationDelay: '1.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1) rotate(-5deg)';
                e.target.style.boxShadow = '0 20px 50px rgba(234, 88, 12, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1) rotate(0deg)';
                e.target.style.boxShadow = '0 15px 40px rgba(234, 88, 12, 0.2)';
              }}>
                <svg style={{ width: '50px', height: '50px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                Qualité Premium
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Produits sélectionnés directement auprès de producteurs africains. 
                Authenticité et qualité garanties.
              </p>
            </div>

            <div style={{ 
              textAlign: 'center',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 1s ease-out 2.6s'
            }}>
              <div style={{ 
                ...advantageIconStyle,
                background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                boxShadow: '0 15px 40px rgba(251, 191, 36, 0.2)',
                animationDelay: '1.4s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1) rotate(5deg)';
                e.target.style.boxShadow = '0 20px 50px rgba(251, 191, 36, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1) rotate(0deg)';
                e.target.style.boxShadow = '0 15px 40px rgba(251, 191, 36, 0.2)';
              }}>
                <svg style={{ width: '50px', height: '50px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                Prix Justes
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Commerce équitable et prix transparents. 
                Nous rémunérons justement nos producteurs partenaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Testimoniales */}
      <section style={{ ...sectionStyle, backgroundColor: 'white' }}>
        <div style={containerStyle}>
          <h2 style={{
            ...sectionTitleStyle,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s ease-out 2.8s'
          }}>
            Avis de nos Clients
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(45deg, #059669, #fbbf24)',
              borderRadius: '2px',
              opacity: isVisible ? 1 : 0,
              transition: 'all 1s ease-out 3s'
            }}></div>
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '30px'
          }}>
            {[
              { name: 'Marie Diallo', text: 'Excellente qualité! Les épices sont fraîches et authentiques. Livraison rapide et bien emballée. Je recommande vivement!', rating: 5 },
              { name: 'Ahmed Hassan', text: 'Retrouver les saveurs de mon pays en France, c\'est magique! Les produits sont vrais et le service client très réactif.', rating: 5 },
              { name: 'Sophie Bernard', text: 'Très impressionnée par la variété. Les mangues sont succulentes et les prix sont honnêtes. Client fidèle maintenant!', rating: 5 }
            ].map((testimonial, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: '#f9fafb',
                  padding: '30px',
                  borderRadius: '16px',
                  border: '2px solid #e5e7eb',
                  position: 'relative',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                  transition: 'all 0.4s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(5, 150, 105, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{ marginBottom: '12px', fontSize: '1.3rem', color: '#fbbf24' }}>
                  {'★'.repeat(testimonial.rating)}
                </div>
                <p style={{ color: '#6b7280', marginBottom: '16px', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{testimonial.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #059669, #34d399)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '600', color: '#1f2937' }}>{testimonial.name}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#9ca3af' }}>Client Vérifié</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Newsletter */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.1)', zIndex: 1 }}></div>
        <div style={{ ...containerStyle, position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: '700',
            marginBottom: '20px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s ease-out 3.2s'
          }}>
            Recevez nos Offres Exclusives
          </h2>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            color: 'rgba(255,255,255,0.95)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s ease-out 3.4s'
          }}>
            Abonnez-vous à notre newsletter pour bénéficier de réductions exclusives et découvrir nos nouveaux produits en avant-première.
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            maxWidth: '500px',
            margin: '0 auto',
            flexWrap: 'wrap',
            justifyContent: 'center',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s ease-out 3.6s'
          }}>
            <input 
              type="email" 
              placeholder="Votre email..." 
              style={{
                flex: 1,
                minWidth: '250px',
                padding: '14px 20px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '1rem',
                backgroundColor: 'white',
                color: '#1f2937',
                outline: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            />
            <button 
              style={{
                padding: '14px 40px',
                borderRadius: '50px',
                border: 'none',
                background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                color: '#1f2937',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(251, 191, 36, 0.3)';
              }}
            >
              S'abonner
            </button>
          </div>
        </div>
      </section>

      {/* Section Call-to-Action Final */}
      <section style={{ ...sectionStyle, backgroundColor: '#f8fafc', textAlign: 'center' }}>
        <div style={containerStyle}>
          <h2 style={{
            ...sectionTitleStyle,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s ease-out 3.8s'
          }}>
            Prêt à Explorer?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#6b7280',
            marginBottom: '30px',
            maxWidth: '600px',
            margin: '0 auto 30px auto',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s ease-out 4s'
          }}>
            Rejoignez des milliers de clients satisfaits qui ont découvert les saveurs authentiques d'Afrique.
          </p>
          <Link 
            to="/products" 
            style={{
              background: 'linear-gradient(45deg, #059669, #047857)',
              color: 'white',
              padding: '16px 48px',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 8px 25px rgba(5, 150, 105, 0.3)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
              transition: 'all 1s ease-out 4.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.05)';
              e.target.style.boxShadow = '0 15px 40px rgba(5, 150, 105, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(5, 150, 105, 0.3)';
            }}
          >
            Découvrez nos Produits
          </Link>
        </div>
      </section>
    </div>
  );
}