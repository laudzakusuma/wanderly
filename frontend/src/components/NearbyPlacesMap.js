import React, { useState, useEffect } from 'react';
import '../styles/NearbyPlacesMap.css';

const NearbyPlacesMap = ({ destination, onClose }) => {
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('restaurant');
  const [mapLoaded, setMapLoaded] = useState(false);

  const placeTypes = [
    { id: 'restaurant', name: 'Restaurants', icon: '🍽️' },
    { id: 'cafe', name: 'Cafes', icon: '☕' },
    { id: 'tourist_attraction', name: 'Attractions', icon: '🎭' },
    { id: 'shopping_mall', name: 'Shopping', icon: '🛍️' },
  ];

  useEffect(() => {
    fetchNearbyPlaces();
  }, [destination, selectedType]);

  const fetchNearbyPlaces = async () => {
    if (!destination?.location?.latitude || !destination?.location?.longitude) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/destinations/${destination._id}/nearby?type=${selectedType}`
      );
      const data = await response.json();
      
      if (data.success) {
        setNearbyPlaces(data.places || []);
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    } finally {
      setLoading(false);
      setMapLoaded(true);
    }
  };

  if (!destination?.location?.latitude) {
    return (
      <div className="nearby-map-container">
        <div className="map-unavailable">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <p>Location data not available for this destination</p>
        </div>
      </div>
    );
  }

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${destination.location.latitude},${destination.location.longitude}&zoom=14`;

  return (
    <div className="nearby-map-container">
      <button className="map-close-btn" onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div className="map-wrapper">
        {/* Google Maps Embed */}
        <div className="map-embed">
          <iframe
            title="Destination Map"
            src={mapUrl}
            style={{ border: 0, width: '100%', height: '100%' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Nearby Places Sidebar */}
        <div className="nearby-sidebar">
          <div className="sidebar-header">
            <h3>Nearby Places</h3>
            <p className="sidebar-subtitle">Around {destination.name}</p>
          </div>

          {/* Place Type Filters */}
          <div className="place-type-tabs">
            {placeTypes.map(type => (
              <button
                key={type.id}
                className={`type-tab ${selectedType === type.id ? 'active' : ''}`}
                onClick={() => setSelectedType(type.id)}
              >
                <span className="tab-icon">{type.icon}</span>
                <span className="tab-label">{type.name}</span>
              </button>
            ))}
          </div>

          {/* Places List */}
          <div className="places-list">
            {loading ? (
              <div className="places-loading">
                <div className="loading-spinner-small"></div>
                <p>Finding nearby places...</p>
              </div>
            ) : nearbyPlaces.length === 0 ? (
              <div className="no-places">
                <p>No {placeTypes.find(t => t.id === selectedType)?.name.toLowerCase()} found nearby</p>
              </div>
            ) : (
              nearbyPlaces.map((place, index) => (
                <div key={index} className="place-card" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="place-info">
                    <h4 className="place-name">{place.name}</h4>
                    <p className="place-address">{place.vicinity || place.address}</p>
                    
                    {place.rating && (
                      <div className="place-rating">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        <span>{place.rating}</span>
                        {place.user_ratings_total && (
                          <span className="rating-count">({place.user_ratings_total})</span>
                        )}
                      </div>
                    )}
                    
                    {place.distance && (
                      <div className="place-distance">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        </svg>
                        <span>{place.distance} km away</span>
                      </div>
                    )}
                  </div>
                  
                  {place.opening_hours && (
                    <div className={`place-status ${place.opening_hours.open_now ? 'open' : 'closed'}`}>
                      {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* View on Google Maps */}
          
            href={`https://www.google.com/maps/search/?api=1&query=${destination.location.latitude},${destination.location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-view-gmaps"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            <span>View on Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NearbyPlacesMap;