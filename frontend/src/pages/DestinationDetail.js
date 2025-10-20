import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDestinationById, addReview, isFavorite, addFavorite, removeFavorite } from '../services/api';
import '../styles/DestinationDetail.css';

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    userName: '',
    rating: 5,
    comment: ''
  });
  const [reviewLoading, setReviewLoading] = useState(false);

  const mapRef = useRef(null);

  const fetchDestination = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDestinationById(id);
      setDestination(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching destination:', err);
      setError('Destinasi tidak ditemukan');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDestination();
  }, [fetchDestination]);

  useEffect(() => {
    if (destination) {
      setIsFav(isFavorite(destination._id));
    }
  }, [destination]);

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(id);
      setIsFav(false);
    } else {
      addFavorite(id);
      setIsFav(true);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    
    try {
      await addReview(id, reviewData);
      alert('Review berhasil ditambahkan!');
      setReviewData({ userName: '', rating: 5, comment: '' });
      setShowReviewForm(false);
      fetchDestination();
    } catch (err) {
      alert('Gagal menambahkan review');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const text = `Check out ${destination.name} - ${destination.description.substring(0, 100)}...`;
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link berhasil disalin!');
        break;
      default:
        if (navigator.share) {
          navigator.share({ title: destination.name, text, url });
        }
    }
    setShowShareMenu(false);
  };

  const openGoogleMaps = () => {
    if (destination?.location?.latitude && destination?.location?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.location.latitude},${destination.location.longitude}&travelmode=driving`;
      window.open(url, '_blank');
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Hubungi kami';
    const min = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: price.currency || 'IDR',
      minimumFractionDigits: 0
    }).format(price.min);
    
    const max = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: price.currency || 'IDR',
      minimumFractionDigits: 0
    }).format(price.max);
    
    return `${min} - ${max}`;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : 'empty'}`}>★</span>
    ));
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading destination...</p>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="detail-error">
        <div className="error-icon">⚠️</div>
        <h2>Destination Not Found</h2>
        <p>{error || 'The destination you are looking for does not exist.'}</p>
        <Link to="/" className="btn-back-home">← Back to Home</Link>
      </div>
    );
  }

  const images = destination.imageUrl 
    ? [destination.imageUrl] 
    : destination.images?.length > 0 
    ? destination.images.map(img => `http://localhost:5000${img.path}`)
    : ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200'];

  return (
    <div className="destination-detail-modern">
      {/* Header Bar */}
      <div className="detail-header-bar">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <div className="header-actions">
          <button className="btn-icon" onClick={() => setShowShareMenu(!showShareMenu)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
          
          <button className={`btn-icon ${isFav ? 'active' : ''}`} onClick={toggleFavorite}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {showShareMenu && (
          <div className="share-menu">
            <button onClick={() => handleShare('whatsapp')}>
              <span>📱</span> WhatsApp
            </button>
            <button onClick={() => handleShare('facebook')}>
              <span>📘</span> Facebook
            </button>
            <button onClick={() => handleShare('twitter')}>
              <span>🐦</span> Twitter
            </button>
            <button onClick={() => handleShare('copy')}>
              <span>🔗</span> Copy Link
            </button>
          </div>
        )}
      </div>

      {/* Photo Gallery */}
      <div className="photo-gallery">
        <div className="main-photo">
          <img src={images[selectedImage]} alt={destination.name} />
          <button className="btn-show-all-photos">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            Show all photos
          </button>
        </div>
        
        {images.length > 1 && (
          <div className="photo-thumbnails">
            {images.slice(0, 4).map((img, idx) => (
              <div 
                key={idx} 
                className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={img} alt={`${destination.name} ${idx + 1}`} />
                {idx === 3 && images.length > 4 && (
                  <div className="thumbnail-overlay">+{images.length - 4}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="detail-content-wrapper">
        <div className="detail-main-content">
          {/* Title Section */}
          <div className="title-section">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/destinations">Destinations</Link>
              <span>/</span>
              <span>{destination.name}</span>
            </div>
            
            <h1>{destination.name}</h1>
            
            <div className="meta-info">
              <div className="rating-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <strong>{destination.averageRating || 4.5}</strong>
                <span>({destination.totalReviews || 0} reviews)</span>
              </div>
              
              <div className="location-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{destination.city}, {destination.country}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="description-section">
            <h2>About this destination</h2>
            <p>{destination.description}</p>
            
            {destination.tags && destination.tags.length > 0 && (
              <div className="tags-container">
                {destination.tags.map((tag, idx) => (
                  <span key={idx} className="tag">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Google Maps Integration */}
          {destination.location?.latitude && destination.location?.longitude && (
            <div className="maps-section">
              <h2>Location</h2>
              <p className="maps-subtitle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {destination.city}, {destination.country}
              </p>
              
              <div className="map-container" ref={mapRef}>
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${destination.location.latitude},${destination.location.longitude}&zoom=14`}
                  allowFullScreen
                  title="Destination Map"
                ></iframe>
              </div>
              
              <button className="btn-navigate" onClick={openGoogleMaps}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Get Directions in Google Maps
              </button>
            </div>
          )}

          {/* Reviews Section */}
          <div className="reviews-section">
            <div className="reviews-header">
              <h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                {destination.averageRating || 4.5} · {destination.totalReviews || 0} reviews
              </h2>
              <button className="btn-add-review" onClick={() => setShowReviewForm(!showReviewForm)}>
                {showReviewForm ? 'Cancel' : '+ Write a Review'}
              </button>
            </div>

            {showReviewForm && (
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    value={reviewData.userName}
                    onChange={(e) => setReviewData({...reviewData, userName: e.target.value})}
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label>Rating</label>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        type="button"
                        className={`star-btn ${reviewData.rating >= num ? 'active' : ''}`}
                        onClick={() => setReviewData({...reviewData, rating: num})}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Review</label>
                  <textarea
                    rows="4"
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                    required
                    placeholder="Share your experience..."
                  />
                </div>

                <button type="submit" className="btn-submit-review" disabled={reviewLoading}>
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            <div className="reviews-list">
              {destination.reviews && destination.reviews.length > 0 ? (
                destination.reviews.map((review, index) => (
                  <div key={index} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-avatar">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="reviewer-info">
                        <h4>{review.userName}</h4>
                        <div className="review-meta">
                          <div className="review-stars">
                            {renderStars(review.rating)}
                          </div>
                          <span className="review-date">
                            {new Date(review.createdAt).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="no-reviews">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          <div className="booking-card">
            <div className="price-section">
              <div className="price-label">Price starts from</div>
              <div className="price-value">{formatPrice(destination.price)}</div>
              <div className="price-note">per person</div>
            </div>

            <Link to={`/booking/${destination._id}`} className="btn-book-now">
              Book Now
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>

            <div className="booking-features">
              <div className="feature-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>Free cancellation</span>
              </div>
              <div className="feature-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>Reserve now, pay later</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3>Need help?</h3>
            <p>Contact our customer service for assistance</p>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="btn-contact">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;