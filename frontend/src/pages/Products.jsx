import { useEffect, useState } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    Promise.all([
      api.get('/products'),
      api.get('/categories')
    ])
      .then(([productsRes, categoriesRes]) => {
        console.log('Products reçus:', productsRes.data);
        console.log('Categories reçues:', categoriesRes.data);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
          setSelectedCategory(categoryParam);
          setFilteredProducts(productsRes.data.filter(p => {
            // Support both string and object category structure
            const categoryName = typeof p.category === 'string' ? p.category : p.category?.name;
            return categoryName === categoryParam;
          }));
        } else {
          setFilteredProducts(productsRes.data);
        }
      })
      .catch((error) => {
        console.error('Erreur:', error);
        setProducts([]);
        setFilteredProducts([]);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(p => {
        // Support both string and object category structure
        const categoryName = typeof p.category === 'string' ? p.category : p.category?.name;
        return categoryName === selectedCategory;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    console.log('Filtered products:', filtered);
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  const styles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes shimmer {
      0% {
        background-position: -200% center;
      }
      100% {
        background-position: 200% center;
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0) translateX(0) scale(1);
      }
      33% {
        transform: translateY(-30px) translateX(20px) scale(1.05);
      }
      66% {
        transform: translateY(20px) translateX(-20px) scale(0.95);
      }
    }

    .search-input:focus {
      outline: none;
      border-color: #059669;
      box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.1);
    }

    .category-item {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .category-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(5, 150, 105, 0.1), transparent);
      transition: left 0.5s;
    }

    .category-item:hover::before {
      left: 100%;
    }

    .category-item:hover {
      transform: translateX(6px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .product-card-wrapper {
      transition: transform 0.3s ease;
    }

    .product-card-wrapper:hover {
      transform: translateY(-8px);
    }

    .glass-effect {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    .gradient-border {
      position: relative;
      background: white;
    }

    .gradient-border::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 2px;
      background: linear-gradient(135deg, #059669, #10b981, #34d399);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .gradient-border:hover::before {
      opacity: 1;
    }

    @media (max-width: 1024px) {
      .sidebar {
        position: relative !important;
        top: 0 !important;
        margin-bottom: 32px;
      }
      
      .layout-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;

  // Calculer le nombre de produits par catégorie
  const getProductCount = (categoryName) => {
    const count = products.filter(p => {
      // Support both string and object category structure
      const prodCategoryName = typeof p.category === 'string' ? p.category : p.category?.name;
      return prodCategoryName === categoryName;
    }).length;
    console.log(`Products pour "${categoryName}":`, count);
    return count;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <style>{styles}</style>

      {/* Hero Section - Ultra Moderne */}
      <div style={{
        background: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)',
        padding: '120px 20px 100px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 20s ease-in-out infinite'
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 25s ease-in-out infinite reverse'
        }}></div>

        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.5
        }}></div>

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ 
            animation: 'slideDown 0.8s ease-out',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {/* Subtitle badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: '8px 20px',
              borderRadius: '50px',
              marginBottom: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              animation: 'fadeInUp 0.8s ease-out 0.2s backwards'
            }}>
              <svg style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.9)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span style={{
                color: 'rgba(255,255,255,0.95)',
                fontSize: '0.875rem',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                QUALITÉ PREMIUM
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: '800',
              marginBottom: '20px',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              animation: 'fadeInUp 0.8s ease-out 0.3s backwards',
              background: 'linear-gradient(45deg, #ffffff, #fbbf24)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>
              Découvrez nos Produits Authentiques
            </h1>
            
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: '600px',
              margin: '0 auto 32px',
              lineHeight: '1.7',
              fontWeight: '400',
              animation: 'fadeInUp 0.8s ease-out 0.4s backwards'
            }}>
              Une sélection rigoureuse de produits africains de qualité, livrés directement chez vous
            </p>

            {/* Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '48px',
              flexWrap: 'wrap',
              animation: 'fadeInUp 0.8s ease-out 0.5s backwards'
            }}>
              <div style={{
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: '#f97316',
                  lineHeight: 1,
                  marginBottom: '8px'
                }}>
                  {products.length}+
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: '500'
                }}>
                  Produits
                </div>
              </div>
              
              <div style={{
                width: '1px',
                background: 'rgba(255,255,255,0.2)',
                alignSelf: 'stretch'
              }}></div>
              
              <div style={{
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: '#f97316',
                  lineHeight: 1,
                  marginBottom: '8px'
                }}>
                  {categories.length}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: '500'
                }}>
                  Catégories
                </div>
              </div>
              
              <div style={{
                width: '1px',
                background: 'rgba(255,255,255,0.2)',
                alignSelf: 'stretch'
              }}></div>
              
              <div style={{
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: '#f97316',
                  lineHeight: 1,
                  marginBottom: '8px'
                }}>
                  100%
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: '500'
                }}>
                  Authentique
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div style={{
          position: 'absolute',
          bottom: '-1px',
          left: 0,
          right: 0,
          height: '60px',
          background: '#fafafa'
        }}>
          <svg 
            style={{
              position: 'absolute',
              bottom: '0',
              left: 0,
              width: '100%',
              height: '60px'
            }}
            viewBox="0 0 1200 60" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,30 C300,10 600,50 900,30 C1050,20 1150,40 1200,30 L1200,60 L0,60 Z" 
              fill="#fafafa"
            />
          </svg>
        </div>
      </div>

      {/* Main Content avec Sidebar */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px 80px'
      }}>
        <div className="layout-grid" style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Sidebar Ultra Moderne */}
          <aside className="sidebar" style={{
            position: 'sticky',
            top: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Stats Card */}
            <div style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              borderRadius: '24px',
              padding: '28px',
              color: 'white',
              boxShadow: '0 10px 30px rgba(5, 150, 105, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '200px',
                height: '200px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(40px)'
              }}></div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  marginBottom: '8px',
                  lineHeight: 1
                }}>
                  {filteredProducts.length}
                </div>
                <div style={{
                  fontSize: '0.95rem',
                  opacity: 0.95,
                  fontWeight: '500'
                }}>
                  Produit{filteredProducts.length !== 1 ? 's' : ''} disponible{filteredProducts.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Catégories Card */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Filtrer par catégorie
                </h3>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg style={{ width: '20px', height: '20px', color: '#059669' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {/* Tous les produits */}
                <button
                  className="category-item"
                  onClick={() => setSelectedCategory('')}
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: selectedCategory === '' ? 'none' : '2px solid #f3f4f6',
                    background: selectedCategory === '' 
                      ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' 
                      : 'white',
                    color: selectedCategory === '' ? 'white' : '#4b5563',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: selectedCategory === '' 
                      ? '0 4px 12px rgba(5, 150, 105, 0.3)' 
                      : 'none'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontSize: '1.3rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      background: selectedCategory === '' 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : '#f9fafb',
                      borderRadius: '10px'
                    }}>
                      🛍️
                    </span>
                    Tous
                  </span>
                  <span style={{
                    background: selectedCategory === '' 
                      ? 'rgba(255, 255, 255, 0.25)' 
                      : '#f3f4f6',
                    padding: '4px 12px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    minWidth: '32px',
                    textAlign: 'center'
                  }}>
                    {products.length}
                  </span>
                </button>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)',
                  margin: '8px 0'
                }}></div>

                {/* Catégories */}
                {categories.map((category) => (
                  <button
                    key={category._id}
                    className="category-item gradient-border"
                    onClick={() => setSelectedCategory(category.name)}
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      border: selectedCategory === category.name ? 'none' : '2px solid #f3f4f6',
                      background: selectedCategory === category.name 
                        ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' 
                        : 'white',
                      color: selectedCategory === category.name ? 'white' : '#4b5563',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: selectedCategory === category.name 
                        ? '0 4px 12px rgba(5, 150, 105, 0.3)' 
                        : 'none'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        fontSize: '1.3rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        background: selectedCategory === category.name 
                          ? 'rgba(255, 255, 255, 0.2)' 
                          : '#f9fafb',
                        borderRadius: '10px'
                      }}>
                        {category.emoji}
                      </span>
                      {category.name}
                    </span>
                    <span style={{
                      background: selectedCategory === category.name 
                        ? 'rgba(255, 255, 255, 0.25)' 
                        : '#f3f4f6',
                      padding: '4px 12px',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      minWidth: '32px',
                      textAlign: 'center'
                    }}>
                      {getProductCount(category.name)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'white',
                  color: '#059669',
                  border: '2px solid #059669',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#059669';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#059669';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                }}
              >
                <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Réinitialiser
              </button>
            )}
          </aside>

          {/* Main Content Area */}
          <main>
            {/* Search Bar */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '24px',
              marginBottom: '32px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ position: 'relative' }}>
                <svg style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: '#9ca3af'
                }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  style={{
                    width: '100%',
                    padding: '18px 20px 18px 52px',
                    fontSize: '1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '16px',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#fafafa'
                  }}
                />
              </div>
            </div>

            {/* Results Summary */}
            {!loading && (
              <div style={{
                marginBottom: '24px',
                padding: '16px 0'
              }}>
                <p style={{
                  margin: 0,
                  color: '#6b7280',
                  fontSize: '0.95rem'
                }}>
                  Affichage de <strong style={{ color: '#059669', fontSize: '1.1rem' }}>{filteredProducts.length}</strong> {' '}
                  produit{filteredProducts.length !== 1 ? 's' : ''}
                  {selectedCategory && (
                    <span> dans <strong style={{ color: '#1f2937' }}>"{selectedCategory}"</strong></span>
                  )}
                </p>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '120px 20px',
                background: 'white',
                borderRadius: '24px',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{
                  display: 'inline-block',
                  width: '50px',
                  height: '50px',
                  border: '3px solid #e5e7eb',
                  borderTop: '3px solid #059669',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}></div>
                <p style={{
                  marginTop: '24px',
                  color: '#6b7280',
                  fontSize: '1rem'
                }}>
                  Chargement des produits...
                </p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
              }}>
                {filteredProducts.map((product, idx) => (
                  <div
                    key={product._id}
                    className="product-card-wrapper"
                    onClick={() => navigate(`/products/${product._id}`)}
                    style={{
                      cursor: 'pointer',
                      animation: `fadeInUp 0.5s ease-out ${idx * 0.04}s backwards`
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '100px 20px',
                background: 'white',
                borderRadius: '24px',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{
                  fontSize: '64px',
                  marginBottom: '24px',
                  opacity: 0.3
                }}>
                  🔍
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '12px',
                  color: '#1f2937',
                  fontWeight: '600'
                }}>
                  Aucun produit trouvé
                </h3>
                <p style={{
                  marginBottom: '32px',
                  fontSize: '1rem',
                  color: '#6b7280',
                  maxWidth: '400px',
                  margin: '0 auto 32px'
                }}>
                  {searchTerm
                    ? `Aucun résultat pour "${searchTerm}"`
                    : 'Aucun produit disponible dans cette catégorie'}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  style={{
                    padding: '14px 32px',
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    fontSize: '1rem',
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
                  Voir tous les produits
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}