import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/DestinationCard.css';

const DestinationCard = ({ destination }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFav, setIsFav] = useState(false);

  // Get first image or use placeholder
  const getImageUrl = () => {
    if (destination.images && destination.images.length > 0) {
      return destination.images[0].path;
    }
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80'; // Placeholder
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    // TODO: API call to save favorite
  };

  const formatPrice = (price) => {
    if (!price || !price.min) return 'Hubungi Kami';
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: price.currency || 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price.min);
  };

  return (
    <Link to={`/destinations/${destination._id}`} className="destination-card">
      <div className="card-image-wrapper">
        {!imageLoaded && (
          <div className="card-image-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
        )}
        <img
          src={getImageUrl()}
          alt={destination.name}
          className={`card-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';
          }}
          loading="lazy"
        />
        
        {/* Category Badge */}
        <div className="card-badge">
          <svg className="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>{destination.category}</span>
        </div>

        {/* Favorite Button */}
        <button 
          className={`favorite-btn ${isFav ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label="Add to favorites"
        >
          <svg viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Overlay Gradient */}
        <div className="card-overlay"></div>
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{destination.name}</h3>
          <div className="card-rating">
            <svg className="rating-icon" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>{destination.averageRating || 0}</span>
          </div>
        </div>

        <p className="card-location">
          <svg className="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {destination.country}
        </p>

        <p className="card-description">{destination.description}</p>

        <div className="card-footer">
          <div className="card-price">
            <span className="price-label">From</span>
            <span className="price-value">{formatPrice(destination.price)}</span>
          </div>
          
          <button className="card-cta">
            <span>Explore</span>
            <svg className="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;