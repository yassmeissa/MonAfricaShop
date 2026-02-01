import { useEffect, useRef, useState } from 'react';

export default function AddressAutocomplete({ value, onChange, onAddressSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const timeoutRef = useRef(null);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);

  // Charger l'API Google Maps au mount
  useEffect(() => {
    console.log('🔍 AddressAutocomplete mount - Vérification Google API');
    
    if (typeof window.google !== 'undefined' && window.google.maps) {
      console.log('✅ Google Maps API déjà disponible');
      const mapDiv = document.createElement('div');
      const map = new window.google.maps.Map(mapDiv);
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      placesServiceRef.current = new window.google.maps.places.PlacesService(map);
    } else {
      console.log('⏳ Google Maps API non disponible - Chargement...');
      // Charger dynamiquement si pas disponible
      const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
      console.log('🔑 Clé API:', apiKey ? 'Présente' : 'MANQUANTE');
      
      if (!apiKey) {
        console.error('❌ ERREUR: Clé API Google manquante dans .env.local');
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onerror = (error) => {
        console.error('❌ Erreur chargement API Google Maps:', error);
      };
      script.onload = () => {
        console.log('✅ Google Maps API chargée avec succès');
        // Attendre que l'API soit vraiment ready
        if (window.google && window.google.maps) {
          try {
            console.log('✅ Initialisation des services Places...');
            const mapDiv = document.createElement('div');
            const map = new window.google.maps.Map(mapDiv);
            autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
            placesServiceRef.current = new window.google.maps.places.PlacesService(map);
            console.log('✅ Services Places initialisés avec succès');
          } catch (e) {
            console.error('❌ Erreur initialisation Places:', e);
          }
        } else {
          console.error('❌ window.google.maps non disponible après chargement');
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (val.length < 3 || !autocompleteServiceRef.current) {
      console.log('⏸️ Recherche ignorée - Input trop court ou service indisponible');
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    console.log('🔍 Recherche lancée pour:', val);
    setLoading(true);

    timeoutRef.current = setTimeout(() => {
      console.log('📡 Appel API getPlacePredictions pour:', val);
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: val,
          componentRestrictions: { country: 'fr' },
          language: 'fr'
        },
        (predictions, status) => {
          console.log('📊 Réponse API:', { 
            status, 
            predictionsCount: predictions?.length || 0,
            predictions: predictions?.slice(0, 3) || []
          });
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
            setIsOpen(true);
          } else {
            console.log('⚠️ Status non OK ou pas de prédictions:', status);
            setSuggestions([]);
            setIsOpen(false);
          }
          setLoading(false);
        }
      );
    }, 150);
  };

  const handleSelectSuggestion = (placeId, description) => {
    onChange(description);
    setIsOpen(false);
    setLoading(true);

    // Récupérer les détails du lieu pour l'adresse complète
    if (placesServiceRef.current) {
      placesServiceRef.current.getDetails(
        { placeId: placeId, fields: ['address_components', 'formatted_address'] },
        (place, status) => {
          setLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            console.log('✅ Détails lieu Google:', place);
            
            let address = '';
            let city = '';
            let postalCode = '';
            let country = '';

            // Extraire les composants d'adresse
            if (place.address_components) {
              place.address_components.forEach((component) => {
                const types = component.types;
                
                if (types.includes('street_number')) {
                  address = component.long_name + ' ' + (address || '');
                }
                if (types.includes('route')) {
                  address += component.long_name;
                }
                if (types.includes('locality')) {
                  city = component.long_name;
                }
                if (types.includes('postal_code')) {
                  postalCode = component.long_name;
                }
                if (types.includes('country')) {
                  country = component.long_name;
                }
              });
            }

            onAddressSelect({
              address: address.trim(),
              city: city || '',
              postalCode: postalCode || '',
              country: country || 'France'
            });
          }
        }
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) && 
          inputRef.current && !inputRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder="Ex: 23 rue de la Paix, Paris"
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '1rem',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />

      {loading && value.length >= 3 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          padding: '16px',
          background: '#ffffff',
          border: '1px solid #d1d5db',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          zIndex: 1000,
          marginTop: '4px',
          color: '#6b7280',
          fontSize: '0.95rem'
        }}>
          Recherche en cours...
        </div>
      )}

      {!loading && isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1px solid #d1d5db',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            maxHeight: '500px',
            overflowY: 'auto',
            zIndex: 9999,
            marginTop: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}
        >
          {suggestions.map((suggestion, idx) => {
            // Extraire les composants pour l'affichage du dropdown
            const mainText = suggestion.structured_formatting?.main_text || suggestion.description;
            const secondaryText = suggestion.structured_formatting?.secondary_text || '';
            
            return (
              <div
                key={idx}
                onClick={() => handleSelectSuggestion(suggestion.place_id, suggestion.description)}
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.paddingLeft = '20px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.paddingLeft = '16px';
                }}
              >
                <div style={{ 
                  fontWeight: '600', 
                  color: '#1f2937',
                  fontSize: '0.95rem'
                }}>
                  {mainText} {secondaryText && `· ${secondaryText}`}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && isOpen && suggestions.length === 0 && value.length >= 3 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          padding: '16px',
          background: '#ffffff',
          border: '1px solid #d1d5db',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          color: '#9ca3af',
          fontSize: '0.95rem',
          zIndex: 1000,
          marginTop: '4px'
        }}>
          Aucune adresse trouvée
        </div>
      )}
    </div>
  );
}
