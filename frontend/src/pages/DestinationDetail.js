import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDestinationById, deleteDestination, addReview, isFavorite, addFavorite, removeFavorite } from '../services/api';
import '../styles/DestinationDetail.css';

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    userName: '',
    rating: 5,
    comment: ''
  });
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchDestination();
  }, [id]);

  useEffect(() => {
    if (destination) {
      setIsFav(isFavorite(destination._id));
    }
  }, [destination]);

  const fetchDestination = async () => {
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
  };

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus destinasi ini?')) {
      try {
        await deleteDestination(id);
        alert('Destinasi berhasil dihapus');
        navigate('/');
      } catch (err) {
        alert('Gagal menghapus destinasi');
      }
    }
  };

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
      fetchDestination(); // Refresh data
    } catch (err) {
      alert('Gagal menambahkan review');
    } finally {
      setReviewLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < rating ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const formatPrice = (price) => {
    if (!price) return 'Gratis';
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Memuat destinasi...</p>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="container">
        <div className="alert alert-error">
          <p>{error || 'Destinasi tidak ditemukan'}</p>
          <Link to="/" className="btn btn-primary">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  const images = destination.images && destination.images.length > 0
    ? destination.images.map(img => `http://localhost:5000${img.path}`)
    : ['https://via.placeholder.com/800x600?text=No+Image'];

  return (
    <div className="destination-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Beranda</Link>
          <span>/</span>
          <Link to="/destinations">Destinasi</Link>
          <span>/</span>
          <span>{destination.name}</span>
        </nav>

        {/* Image Gallery */}
        <div className="detail-gallery">
          <div className="gallery-main">
            <img 
              src={images[selectedImage]} 
              alt={destination.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
              }}
            />
            <button className={`favorite-btn-large ${isFav ? 'active' : ''}`} onClick={toggleFavorite}>
              {isFav ? '❤️' : '🤍'}
            </button>
          </div>
          
          {images.length > 1 && (
            <div className="gallery-thumbnails">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${destination.name} ${index + 1}`}
                  className={selectedImage === index ? 'active' : ''}
                  onClick={() => setSelectedImage(index)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="detail-content">
          {/* Main Info */}
          <div className="detail-main">
            <div className="detail-header">
              <div>
                <span className="category-badge">{destination.category}</span>
                <h1 className="detail-title">{destination.name}</h1>
                <div className="detail-location">
                  <span className="location-icon">📍</span>
                  <span>{destination.city}, {destination.country}</span>
                </div>
              </div>
              
              <div className="detail-actions">
                <Link to={`/edit-destination/${destination._id}`} className="btn btn-outline">
                  ✏️ Edit
                </Link>
                <button className="btn btn-danger" onClick={handleDelete}>
                  🗑️ Hapus
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="detail-rating">
              <div className="stars-large">
                {renderStars(Math.round(destination.averageRating || 0))}
              </div>
              <span className="rating-text">
                {destination.averageRating > 0 
                  ? `${destination.averageRating} / 5.0 (${destination.totalReviews} review)`
                  : 'Belum ada review'}
              </span>
            </div>

            {/* Description */}
            <div className="detail-description">
              <h2>Tentang Destinasi Ini</h2>
              <p>{destination.description}</p>
            </div>

            {/* Tags */}
            {destination.tags && destination.tags.length > 0 && (
              <div className="detail-tags">
                <h3>Tags:</h3>
                <div className="tags-list">
                  {destination.tags.map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="reviews-section">
              <div className="reviews-header">
                <h2>Review dari Traveler</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  {showReviewForm ? 'Batal' : '+ Tulis Review'}
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form className="review-form" onSubmit={handleReviewSubmit}>
                  <div className="form-group">
                    <label className="form-label">Nama Anda</label>
                    <input
                      type="text"
                      className="form-control"
                      value={reviewData.userName}
                      onChange={(e) => setReviewData({...reviewData, userName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Rating</label>
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
                    <label className="form-label">Komentar</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                    {reviewLoading ? 'Mengirim...' : 'Kirim Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="reviews-list">
                {destination.reviews && destination.reviews.length > 0 ? (
                  destination.reviews.map((review, index) => (
                    <div key={index} className="review-item">
                      <div className="review-header">
                        <div className="review-avatar">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="review-author">{review.userName}</h4>
                          <div className="review-stars">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-reviews">Belum ada review. Jadilah yang pertama!</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            <div className="sidebar-card">
              <h3>Informasi Harga</h3>
              <div className="price-info">
                <span className="price-label">Estimasi biaya</span>
                <span className="price-value">{formatPrice(destination.price)}</span>
              </div>
            </div>

            {destination.location && destination.location.latitude && (
              <div className="sidebar-card">
                <h3>Lokasi</h3>
                <p className="location-coords">
                  📍 {destination.location.latitude}, {destination.location.longitude}
                </p>
                <a 
                  href={`https://www.google.com/maps?q=${destination.location.latitude},${destination.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  🗺️ Lihat di Google Maps
                </a>
              </div>
            )}

            <div className="sidebar-card">
              <h3>Bagikan</h3>
              <div className="share-buttons">
                <button className="share-btn">📱 WhatsApp</button>
                <button className="share-btn">📘 Facebook</button>
                <button className="share-btn">🐦 Twitter</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;