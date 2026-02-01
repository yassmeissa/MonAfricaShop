import React from 'react';
import AddressAutocomplete from './AddressAutocomplete';

const EditCheckoutModal = ({ 
  formData, 
  onClose, 
  handleInputChange, 
  handleAddressSelect 
}) => {
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      animation: 'slideUp 0.3s ease-out',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px',
      borderBottom: '1px solid #e5e5e5',
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      borderRadius: '12px 12px 0 0',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: 'white',
      margin: 0,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: 'white',
      padding: '0',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '4px',
      transition: 'background-color 0.2s',
    },
    content: {
      padding: '24px',
    },
    section: {
      marginBottom: '24px',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '16px',
      margin: '0 0 16px 0',
      paddingBottom: '8px',
      borderBottom: '2px solid #059669',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '16px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '16px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#333',
      marginBottom: '8px',
    },
    input: {
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      fontFamily: 'inherit',
      transition: 'border-color 0.3s',
      boxSizing: 'border-box',
    },
    inputFocus: {
      borderColor: '#059669',
      outline: 'none',
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Modifier mes informations</h2>
          <button
            onClick={onClose}
            style={styles.closeButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Section Informations personnelles */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Informations personnelles</h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Prénom *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#059669';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ddd';
                  }}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nom *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#059669';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ddd';
                  }}
                />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#059669';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ddd';
                }}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Téléphone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#059669';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ddd';
                }}
              />
            </div>
          </div>

          {/* Section Adresse de livraison */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Adresse de livraison</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Adresse *</label>
              <AddressAutocomplete
                value={formData.address}
                onChange={(value) => {
                  handleInputChange({
                    target: { name: 'address', value }
                  });
                }}
                onAddressSelect={handleAddressSelect}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Complément d'adresse</label>
              <input
                type="text"
                name="addressComplement"
                placeholder="Apt, bâtiment, etc. (optionnel)"
                value={formData.addressComplement}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#059669';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ddd';
                }}
              />
            </div>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Ville *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#059669';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ddd';
                  }}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Code postal *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#059669';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ddd';
                  }}
                />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Pays *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#059669';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ddd';
                }}
              />
            </div>
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px 24px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#333',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.borderColor = '#999';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = '#ddd';
              }}
            >
              Annuler
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(5, 150, 105, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCheckoutModal;
