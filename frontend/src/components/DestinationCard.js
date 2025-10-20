import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isFavorite, addFavorite, removeFavorite } from '../services/api';
import '../styles/DestinationCard.css';

const DestinationCard = ({ destination }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [currentImageIndex] = useState(0);

  useEffect(() => {
    setIsFav(isFavorite(destination._id));
  }, [destination._id]);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFav) {
      removeFavorite(destination._id);
      setIsFav(false);
    } else {
      addFavorite(destination._id);
      setIsFav(true);
    }
  };

  const formatPrice = (price) => {
    if (!price || !price.min) return 'Hubungi kami';
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: price.currency || 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price.min);
  };

  // ✅ FIX: Get image URL with fallback
  const getImageUrl = () => {
    // Priority: imageUrl > images array > fallback
    if (destination.imageUrl && destination.imageUrl.startsWith('http')) {
      return destination.imageUrl;
    }
    
    if (destination.images && destination.images.length > 0) {
      const imagePath = destination.images[currentImageIndex]?.path || destination.images[0].path;
      return imagePath.startsWith('http') 
        ? imagePath 
        : `http://localhost:5000${imagePath}`;
    }
    
    // Fallback based on category
    const fallbackImages = {
      'Pantai': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'Gunung': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'Kota': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
      'Sejarah': 'https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=800',
      'Petualangan': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    };
    
    return fallbackImages[destination.category] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800';
  };

  const imageUrl = getImageUrl();

  const handleImageError = (e) => {
    if (!imageError) {
      console.error('Image failed to load:', imageUrl);
      setImageError(true);
      e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop';
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <Link to={`/destinations/${destination._id}`} className="destination-card">
      <div className="card-image-container">
        {!imageLoaded && (
          <div className="card-skeleton">
            <div className="skeleton-pulse"></div>
          </div>
        )}
        <img
          src={imageUrl}
          alt={destination.name}
          className={`card-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
        
        <div className="card-overlay"></div>
        
        <span className="card-category">{destination.category}</span>
        
        <button 
          className={`card-favorite ${isFav ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label="Add to favorites"
        >
          <svg viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <h3 className="card-title">{destination.name}</h3>
          {destination.averageRating > 0 && (
            <div className="card-rating">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>{destination.averageRating}</span>
            </div>
          )}
        </div>

        <p className="card-location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {destination.city}, {destination.country}
        </p>

        <p className="card-description">{destination.description}</p>

        <div className="card-footer-row">
          <div className="card-price-section">
            <span className="price-label">Mulai dari</span>
            <span className="price-value">{formatPrice(destination.price)}</span>
          </div>
          
          <button className="card-btn-explore">
            <span>Explore</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;