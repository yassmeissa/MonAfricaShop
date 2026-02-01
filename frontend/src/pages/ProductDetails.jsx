import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { addToCart } from '../utils/cart';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 3000);
    }
  };

  const styles = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes successPulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    .quantity-btn:hover {
      background: #047857;
    }

    .image-thumbnail:hover {
      border-color: #059669;
      transform: scale(1.05);
    }
  `;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <style>{styles}</style>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '40px 20px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #059669',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <p style={{
            marginTop: '24px',
            color: '#6b7280',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            Chargement du produit...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <style>{styles}</style>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '40px 20px'
        }}>
          <div style={{
            fontSize: '80px',
            marginBottom: '24px',
            opacity: 0.3
          }}>
            😕
          </div>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '12px'
          }}>
            Produit introuvable
          </h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '32px',
            fontSize: '1rem'
          }}>
            Ce produit n'existe pas ou a été supprimé
          </p>
          <button
            onClick={() => navigate('/products')}
            style={{
              padding: '14px 32px',
              background: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
            }}
          >
            ← Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  // Mock images for gallery (in reality, you'd have multiple product images)
  const images = [
    product.image || 'https://images.unsplash.com/photo-1556909114-3e8678aa04d5?auto=format&fit=crop&w=800&q=80',
    product.image || 'https://images.unsplash.com/photo-1556909114-3e8678aa04d5?auto=format&fit=crop&w=800&q=80',
    product.image || 'https://images.unsplash.com/photo-1556909114-3e8678aa04d5?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <style>{styles}</style>

      {/* Success Message */}
      {showAddedMessage && (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          background: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 1000,
          animation: 'slideDown 0.3s ease-out, successPulse 0.5s ease-out 0.3s',
          border: '2px solid #059669'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: '#059669',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg style={{ width: '14px', height: '14px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span style={{ color: '#1f2937', fontWeight: '600', fontSize: '0.95rem' }}>
            Produit ajouté au panier !
          </span>
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 0'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            color: '#6b7280'
          }}>
            <span
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer', color: '#059669', fontWeight: '500' }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Accueil
            </span>
            <span>/</span>
            <span
              onClick={() => navigate('/products')}
              style={{ cursor: 'pointer', color: '#059669', fontWeight: '500' }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Produits
            </span>
            <span>/</span>
            <span style={{ color: '#1f2937', fontWeight: '600' }}>
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Left: Images Gallery */}
          <div style={{
            animation: 'slideInLeft 0.6s ease-out'
          }}>
            {/* Main Image */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
              borderRadius: '32px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(5, 150, 105, 0.08) 0%, transparent 70%)',
                borderRadius: '50%'
              }}></div>
              <div style={{
                position: 'relative',
                paddingTop: '100%',
                overflow: 'hidden',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
              }}>
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* Badge catégorie */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#059669',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(5, 150, 105, 0.1)'
                }}>
                  {product.category?.name || 'Produit'}
                </div>

                {/* Stock badge */}
                {product.stock < 10 && product.stock > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(234, 88, 12, 0.95)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    backdropFilter: 'blur(10px)'
                  }}>
                    Stock limité
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              paddingTop: '12px'
            }}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="image-thumbnail"
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImage === idx ? '3px solid #059669' : '3px solid #e5e7eb',
                    transition: 'all 0.2s ease',
                    opacity: selectedImage === idx ? 1 : 0.6
                  }}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div style={{
            animation: 'slideInRight 0.6s ease-out'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(5, 150, 105, 0.08) 0%, transparent 70%)',
                borderRadius: '50%'
              }}></div>
              {/* Title */}
              <h1 style={{
                fontSize: 'clamp(1.4rem, 2vw, 2rem)',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '12px',
                lineHeight: '1.2',
                position: 'relative',
                zIndex: 1
              }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e5e7eb',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  color: '#fbbf24',
                  fontSize: '1.2rem'
                }}>
                  ★★★★★
                </div>
                <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                  (4.8) · 127 avis
                </span>
              </div>

              {/* Price */}
              <div style={{
                marginBottom: '24px',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  marginBottom: '8px'
                }}>
                  {product.price}€
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#6b7280',
                  fontSize: '0.9rem'
                }}>
                  <svg style={{ width: '18px', height: '18px', color: '#10b981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>TVA incluse · Livraison calculée à l'étape suivante</span>
                </div>
              </div>

              {/* Description */}
              <div style={{
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: '1px solid #e5e7eb',
                position: 'relative',
                zIndex: 1
              }}>
                <h3 style={{
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  Description
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontSize: '0.9rem'
                }}>
                  {product.description || 'Produit authentique d\'Afrique, sélectionné avec soin pour garantir la meilleure qualité.'}
                </p>
              </div>

              {/* Stock Info */}
              <div style={{
                marginBottom: '20px',
                padding: '12px',
                background: product.stock > 0 ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                borderRadius: '12px',
                border: `2px solid ${product.stock > 0 ? '#bbf7d0' : '#fecaca'}`,
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: product.stock > 0 ? '#059669' : '#dc2626',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {product.stock > 0 ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    )}
                  </svg>
                  <span>
                    {product.stock > 0 
                      ? `En stock · ${product.stock} unité${product.stock > 1 ? 's' : ''} disponible${product.stock > 1 ? 's' : ''}`
                      : 'Rupture de stock'
                    }
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div style={{
                  marginBottom: '16px',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Quantité
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <button
                      className="quantity-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{
                        width: '36px',
                        height: '36px',
                        background: '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '700',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      −
                    </button>
                    <div style={{
                      width: '60px',
                      height: '36px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>
                      {quantity}
                    </div>
                    <button
                      className="quantity-btn"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      style={{
                        width: '36px',
                        height: '36px',
                        background: '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '700',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: product.stock > 0 
                    ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                    : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                  fontWeight: '700',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: product.stock > 0 ? '0 8px 20px rgba(5, 150, 105, 0.3)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  position: 'relative',
                  zIndex: 1,
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (product.stock > 0) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 30px rgba(5, 150, 105, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (product.stock > 0) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 20px rgba(5, 150, 105, 0.3)';
                  }
                }}
              >
                <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {product.stock > 0 ? 'Ajouter au panier' : 'Produit indisponible'}
              </button>

              {/* Additional Info */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.05) 0%, rgba(5, 150, 105, 0.02) 100%)',
                borderRadius: '12px',
                border: '1px solid rgba(5, 150, 105, 0.1)',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#6b7280',
                  fontSize: '0.85rem'
                }}>
                  <svg style={{ width: '18px', height: '18px', color: '#059669', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span>Livraison rapide sous 3-5 jours</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#6b7280',
                  fontSize: '0.85rem'
                }}>
                  <svg style={{ width: '18px', height: '18px', color: '#059669', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Garantie qualité 100% authentique</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#6b7280',
                  fontSize: '0.85rem'
                }}>
                  <svg style={{ width: '18px', height: '18px', color: '#059669', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Retour gratuit sous 14 jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}