export default function ProductCard({ product }) {
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid #e5e7eb',
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer'
  };

  const imageContainerStyle = {
    position: 'relative',
    paddingTop: '75%', // Ratio 4:3 pour des images plus compactes
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
  };

  const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const badgeStyle = {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: '#059669',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '600',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(5, 150, 105, 0.1)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const stockBadgeStyle = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'rgba(234, 88, 12, 0.95)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '600',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 8px rgba(234, 88, 12, 0.3)'
  };

  const contentStyle = {
    padding: '20px',
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const titleStyle = {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    minHeight: '2.8em'
  };

  const descriptionStyle = {
    color: '#6b7280',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    flex: '1'
  };

  const footerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '12px',
    borderTop: '1px solid #f3f4f6'
  };

  const priceStyle = {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#059669'
  };

  const priceUnitStyle = {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: '2px'
  };

  const quickViewStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#059669',
    fontSize: '0.85rem',
    fontWeight: '600',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  };

  const outOfStockOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    zIndex: 10
  };

  const outOfStockIconStyle = {
    width: '48px',
    height: '48px',
    color: '#9ca3af'
  };

  const outOfStockTextStyle = {
    color: '#6b7280',
    fontSize: '1rem',
    fontWeight: '600'
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
        e.currentTarget.style.borderColor = '#059669';
        
        const image = e.currentTarget.querySelector('img');
        if (image) {
          image.style.transform = 'scale(1.05)';
        }

        const quickView = e.currentTarget.querySelector('.quick-view');
        if (quickView) {
          quickView.style.opacity = '1';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        e.currentTarget.style.borderColor = '#e5e7eb';
        
        const image = e.currentTarget.querySelector('img');
        if (image) {
          image.style.transform = 'scale(1)';
        }

        const quickView = e.currentTarget.querySelector('.quick-view');
        if (quickView) {
          quickView.style.opacity = '0';
        }
      }}
    >
      {/* Image Container */}
      <div style={imageContainerStyle}>
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1556909114-3e8678aa04d5?auto=format&fit=crop&w=400&q=80'} 
          alt={product.name} 
          style={imageStyle}
        />
        
        {/* Category Badge */}
        <div style={badgeStyle}>
          {product.category?.name || 'Épicerie'}
        </div>

        {/* Stock Badge */}
        {product.stock < 10 && product.stock > 0 && (
          <div style={stockBadgeStyle}>
            Dernières pièces
          </div>
        )}

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div style={outOfStockOverlayStyle}>
            <svg style={outOfStockIconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span style={outOfStockTextStyle}>Rupture de stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={contentStyle}>
        <h3 style={titleStyle}>{product.name}</h3>
        
        <p style={descriptionStyle}>
          {product.description || 'Produit authentique d\'Afrique'}
        </p>
        
        {/* Footer with Price */}
        <div style={footerStyle}>
          <div>
            <span style={priceStyle}>
              {product.price}
            </span>
            <span style={priceUnitStyle}>€</span>
          </div>
          
          {/* Quick View Indicator - appears on hover */}
          <div className="quick-view" style={quickViewStyle}>
            <span>Voir plus</span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}