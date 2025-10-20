import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDestinations } from '../services/api';
import '../styles/Home.css';

function Home() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch destinations from backend
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await getDestinations();
        
        if (response && response.data) {
          setDestinations(response.data);
        }
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Failed to load destinations');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, [destinations]);

  // Categorize destinations
  const beachDestinations = destinations.filter(d => d.category === 'Pantai').slice(0, 6);
  const mountainDestinations = destinations.filter(d => d.category === 'Gunung').slice(0, 6);
  const culturalDestinations = destinations.filter(d => d.category === 'Sejarah').slice(0, 6);
  const promoDestinations = destinations.filter(d => d.price?.min < 2000000).slice(0, 6);

  // Format price
  const formatPrice = (price) => {
    if (!price || !price.min) return 'Hubungi kami';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: price.currency || 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price.min);
  };

  // Render destination card
  const renderDestinationCard = (dest) => (
    <Link to={`/destinations/${dest._id}`} key={dest._id} className="travel-card">
      <div className="travel-card-image">
        <img 
          src={dest.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600'} 
          alt={dest.name} 
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600';
          }}
        />
        <button className="btn-wishlist-card" onClick={(e) => e.preventDefault()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2"/>
          </svg>
        </button>
      </div>
      <div className="travel-card-content">
        <div className="card-location-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2"/>
          </svg>
          {dest.city}, {dest.country}
        </div>
        <h3>{dest.name}</h3>
        <div className="card-rating-row">
          <div className="rating-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>{dest.averageRating || 4.5}</span>
          </div>
          <span className="reviews-count">({dest.totalReviews || 0} reviews)</span>
        </div>
        <div className="card-price-row">
          <span className="price-label">From</span>
          <span className="price-amount">{formatPrice(dest.price)}</span>
        </div>
        <button className="btn-book-card" onClick={(e) => e.preventDefault()}>
          View Details
        </button>
      </div>
    </Link>
  );

  // Loading state
  if (loading) {
    return (
      <div className="home-page-travel">
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div className="spinner" style={{ 
            width: '64px', 
            height: '64px', 
            border: '4px solid #e5e7eb',
            borderTopColor: '#6366f1',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '1.125rem', fontWeight: 600 }}>
            Loading destinations...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="home-page-travel">
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '4rem' }}>❌</div>
          <h2 style={{ color: '#ef4444', margin: 0 }}>Failed to Load</h2>
          <p style={{ color: '#6b7280', textAlign: 'center' }}>{error}</p>
          <button 
            className="btn-cta-travel" 
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (destinations.length === 0) {
    return (
      <div className="home-page-travel">
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ fontSize: '4rem' }}>🏝️</div>
          <h2 style={{ color: '#1f2937', margin: 0 }}>No Destinations Available</h2>
          <p style={{ color: '#6b7280' }}>Please run the seed script to populate destinations.</p>
          <code style={{ 
            background: '#f3f4f6', 
            padding: '10px 20px', 
            borderRadius: '8px',
            fontFamily: 'monospace'
          }}>
            cd backend && npm run seed
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page-travel">
      {/* Hero Section */}
      <section className="hero-travel">
        <div className="hero-background-travel">
          <div className="hero-bg-video" style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&auto=format')" 
          }}></div>
          <div className="hero-overlay-travel"></div>
        </div>
        
        <div className="container">
          <div className="hero-content-travel animate-fade-in">
            <span className="hero-badge-travel">Premium Travel Experience</span>
            <h1 className="hero-title-travel">
              Discover Your Next <span className="accent-text">Adventure</span>
            </h1>
            <p className="hero-subtitle-travel">
              Explore Indonesia's most breathtaking destinations with AI-powered recommendations
            </p>
            
            <div className="hero-search-travel">
              <input type="text" placeholder="Where do you want to go?" />
              <Link to="/voice-agent" className="btn-voice-travel">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" strokeWidth="2"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeWidth="2"/>
                </svg>
                AI Assistant
              </Link>
            </div>

            <div className="hero-stats-travel">
              <div className="stat-box">
                <div className="stat-number">{destinations.length}+</div>
                <div className="stat-label">Destinations</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Happy Travelers</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">4.8</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beach Destinations */}
      {beachDestinations.length > 0 && (
        <section className="destinations-row animate-on-scroll">
          <div className="container">
            <div className="row-header">
              <div className="row-title-group">
                <h2>Beach & Island Destinations</h2>
                <p>Explore pristine beaches and tropical paradises</p>
              </div>
            </div>
            <div className="cards-horizontal-scroll">
              {beachDestinations.map(renderDestinationCard)}
            </div>
          </div>
        </section>
      )}

      {/* Mountain Destinations */}
      {mountainDestinations.length > 0 && (
        <section className="destinations-row animate-on-scroll">
          <div className="container">
            <div className="row-header">
              <div className="row-title-group">
                <h2>Mountain & Hiking Adventures</h2>
                <p>Conquer peaks and enjoy breathtaking views</p>
              </div>
            </div>
            <div className="cards-horizontal-scroll">
              {mountainDestinations.map(renderDestinationCard)}
            </div>
          </div>
        </section>
      )}

      {/* Cultural Destinations */}
      {culturalDestinations.length > 0 && (
        <section className="destinations-row animate-on-scroll">
          <div className="container">
            <div className="row-header">
              <div className="row-title-group">
                <h2>Cultural & Heritage Sites</h2>
                <p>Experience rich traditions and historical wonders</p>
              </div>
            </div>
            <div className="cards-horizontal-scroll">
              {culturalDestinations.map(renderDestinationCard)}
            </div>
          </div>
        </section>
      )}

      {/* Special Offers */}
      {promoDestinations.length > 0 && (
        <section className="destinations-row promo-row animate-on-scroll">
          <div className="container">
            <div className="row-header">
              <div className="row-title-group">
                <h2>Budget-Friendly Destinations</h2>
                <p>Amazing destinations under Rp 2.000.000</p>
              </div>
            </div>
            <div className="cards-horizontal-scroll">
              {promoDestinations.map((dest) => (
                <Link to={`/destinations/${dest._id}`} key={dest._id} className="travel-card promo-card">
                  <div className="travel-card-image">
                    <img 
                      src={dest.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600'} 
                      alt={dest.name} 
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600';
                      }}
                    />
                    <div className="discount-badge">Budget Pick</div>
                    <button className="btn-wishlist-card" onClick={(e) => e.preventDefault()}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2"/>
                      </svg>
                    </button>
                  </div>
                  <div className="travel-card-content">
                    <div className="card-location-tag">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2"/>
                      </svg>
                      {dest.city}, {dest.country}
                    </div>
                    <h3>{dest.name}</h3>
                    <div className="card-rating-row">
                      <div className="rating-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        <span>{dest.averageRating || 4.5}</span>
                      </div>
                      <span className="reviews-count">({dest.totalReviews || 0} reviews)</span>
                    </div>
                    <div className="promo-price-row">
                      <span className="promo-price">{formatPrice(dest.price)}</span>
                    </div>
                    <button className="btn-book-card promo-btn" onClick={(e) => e.preventDefault()}>
                      View Details
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-travel animate-on-scroll">
        <div className="container">
          <div className="cta-content-travel">
            <h2>Ready To Start Your Journey?</h2>
            <p>Let our AI assistant help you find the perfect destination tailored just for you</p>
            <Link to="/voice-agent" className="btn-cta-travel">
              Try AI Assistant
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="12 5 19 12 12 19" strokeWidth="2"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;