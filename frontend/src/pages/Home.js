import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
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
  }, []);

  // Beach Destinations
  const beachDestinations = [
    {
      id: 1,
      name: 'Bali',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop',
      price: 'Rp 2.500.000',
      rating: 4.8,
      reviews: 1234,
      location: 'Bali, Indonesia'
    },
    {
      id: 2,
      name: 'Raja Ampat',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      price: 'Rp 8.000.000',
      rating: 5.0,
      reviews: 892,
      location: 'Papua Barat'
    },
    {
      id: 3,
      name: 'Lombok',
      image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600&h=400&fit=crop',
      price: 'Rp 2.200.000',
      rating: 4.7,
      reviews: 1876,
      location: 'Nusa Tenggara'
    },
    {
      id: 4,
      name: 'Labuan Bajo',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
      price: 'Rp 3.500.000',
      rating: 4.9,
      reviews: 1687,
      location: 'Flores'
    },
    {
      id: 5,
      name: 'Nusa Penida',
      image: 'https://images.unsplash.com/photo-1580837119756-563d608dd119?w=600&h=400&fit=crop',
      price: 'Rp 1.800.000',
      rating: 4.6,
      reviews: 2134,
      location: 'Bali'
    },
    {
      id: 6,
      name: 'Belitung',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
      price: 'Rp 2.800.000',
      rating: 4.8,
      reviews: 956,
      location: 'Bangka Belitung'
    }
  ];

  // Mountain Destinations
  const mountainDestinations = [
    {
      id: 1,
      name: 'Bromo',
      image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=600&h=400&fit=crop',
      price: 'Rp 1.800.000',
      rating: 4.7,
      reviews: 2156,
      location: 'Jawa Timur'
    },
    {
      id: 2,
      name: 'Rinjani',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      price: 'Rp 2.500.000',
      rating: 4.9,
      reviews: 1432,
      location: 'Lombok'
    },
    {
      id: 3,
      name: 'Semeru',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop',
      price: 'Rp 2.200.000',
      rating: 4.8,
      reviews: 987,
      location: 'Jawa Timur'
    },
    {
      id: 4,
      name: 'Merbabu',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      price: 'Rp 1.500.000',
      rating: 4.6,
      reviews: 1245,
      location: 'Jawa Tengah'
    },
    {
      id: 5,
      name: 'Kerinci',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=400&fit=crop',
      price: 'Rp 3.200.000',
      rating: 4.7,
      reviews: 678,
      location: 'Jambi'
    },
    {
      id: 6,
      name: 'Gede Pangrango',
      image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&h=400&fit=crop',
      price: 'Rp 1.200.000',
      rating: 4.5,
      reviews: 1543,
      location: 'Jawa Barat'
    }
  ];

  // Cultural Destinations
  const culturalDestinations = [
    {
      id: 1,
      name: 'Yogyakarta',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop',
      price: 'Rp 1.500.000',
      rating: 4.6,
      reviews: 3421,
      location: 'Yogyakarta'
    },
    {
      id: 2,
      name: 'Ubud',
      image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&h=400&fit=crop',
      price: 'Rp 2.000.000',
      rating: 4.7,
      reviews: 2876,
      location: 'Bali'
    },
    {
      id: 3,
      name: 'Toraja',
      image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&h=400&fit=crop',
      price: 'Rp 3.500.000',
      rating: 4.8,
      reviews: 1234,
      location: 'Sulawesi Selatan'
    },
    {
      id: 4,
      name: 'Solo',
      image: 'https://images.unsplash.com/photo-1601815060149-8e3bbaf33e6b?w=600&h=400&fit=crop',
      price: 'Rp 1.200.000',
      rating: 4.5,
      reviews: 1987,
      location: 'Jawa Tengah'
    },
    {
      id: 5,
      name: 'Borobudur',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&h=400&fit=crop',
      price: 'Rp 2.300.000',
      rating: 4.9,
      reviews: 3456,
      location: 'Yogyakarta'
    },
    {
      id: 6,
      name: 'Prambanan',
      image: 'https://images.unsplash.com/photo-1591606663918-baa05f46eb74?w=600&h=400&fit=crop',
      price: 'Rp 900.000',
      rating: 4.4,
      reviews: 2134,
      location: 'Yogyakarta'
    }
  ];

  // Promo Destinations
  const promoDestinations = [
    {
      id: 1,
      name: 'Danau Toba',
      image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600&h=400&fit=crop',
      price: 'Rp 1.600.000',
      originalPrice: 'Rp 2.000.000',
      discount: 20,
      rating: 4.6,
      reviews: 876,
      location: 'Sumatera Utara'
    },
    {
      id: 2,
      name: 'Malang',
      image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&h=400&fit=crop',
      price: 'Rp 1.200.000',
      originalPrice: 'Rp 1.600.000',
      discount: 25,
      rating: 4.5,
      reviews: 1234,
      location: 'Jawa Timur'
    },
    {
      id: 3,
      name: 'Bandung',
      image: 'https://images.unsplash.com/photo-1601815060149-8e3bbaf33e6b?w=600&h=400&fit=crop',
      price: 'Rp 900.000',
      originalPrice: 'Rp 1.300.000',
      discount: 30,
      rating: 4.4,
      reviews: 2456,
      location: 'Jawa Barat'
    },
    {
      id: 4,
      name: 'Wakatobi',
      image: 'https://images.unsplash.com/photo-1583843156871-de22fb3dbcba?w=600&h=400&fit=crop',
      price: 'Rp 5.500.000',
      originalPrice: 'Rp 6.500.000',
      discount: 15,
      rating: 4.9,
      reviews: 723,
      location: 'Sulawesi Tenggara'
    },
    {
      id: 5,
      name: 'Derawan',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      price: 'Rp 4.200.000',
      originalPrice: 'Rp 5.000.000',
      discount: 16,
      rating: 4.8,
      reviews: 654,
      location: 'Kalimantan Timur'
    },
    {
      id: 6,
      name: 'Sumba',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      price: 'Rp 3.400.000',
      originalPrice: 'Rp 4.000.000',
      discount: 15,
      rating: 4.7,
      reviews: 543,
      location: 'Nusa Tenggara Timur'
    }
  ];

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
                <div className="stat-number">1,000+</div>
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
      <section className="destinations-row animate-on-scroll">
        <div className="container">
          <div className="row-header">
            <div className="row-title-group">
              <h2>Beach & Island Destinations</h2>
              <p>Explore pristine beaches and tropical paradises</p>
            </div>
          </div>

          <div className="cards-horizontal-scroll">
            {beachDestinations.map((dest) => (
              <div key={dest.id} className="travel-card">
                <div className="travel-card-image">
                  <img src={dest.image} alt={dest.name} loading="lazy" />
                  <button className="btn-wishlist-card">
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
                    {dest.location}
                  </div>
                  <h3>{dest.name}</h3>
                  <div className="card-rating-row">
                    <div className="rating-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <span>{dest.rating}</span>
                    </div>
                    <span className="reviews-count">({dest.reviews} reviews)</span>
                  </div>
                  <div className="card-price-row">
                    <span className="price-label">From</span>
                    <span className="price-amount">{dest.price}</span>
                  </div>
                  <button className="btn-book-card">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mountain Destinations */}
      <section className="destinations-row animate-on-scroll">
        <div className="container">
          <div className="row-header">
            <div className="row-title-group">
              <h2>Mountain & Hiking Adventures</h2>
              <p>Conquer peaks and enjoy breathtaking views</p>
            </div>
          </div>

          <div className="cards-horizontal-scroll">
            {mountainDestinations.map((dest) => (
              <div key={dest.id} className="travel-card">
                <div className="travel-card-image">
                  <img src={dest.image} alt={dest.name} loading="lazy" />
                  <button className="btn-wishlist-card">
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
                    {dest.location}
                  </div>
                  <h3>{dest.name}</h3>
                  <div className="card-rating-row">
                    <div className="rating-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <span>{dest.rating}</span>
                    </div>
                    <span className="reviews-count">({dest.reviews} reviews)</span>
                  </div>
                  <div className="card-price-row">
                    <span className="price-label">From</span>
                    <span className="price-amount">{dest.price}</span>
                  </div>
                  <button className="btn-book-card">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Destinations */}
      <section className="destinations-row animate-on-scroll">
        <div className="container">
          <div className="row-header">
            <div className="row-title-group">
              <h2>Cultural & Heritage Sites</h2>
              <p>Experience rich traditions and historical wonders</p>
            </div>
          </div>

          <div className="cards-horizontal-scroll">
            {culturalDestinations.map((dest) => (
              <div key={dest.id} className="travel-card">
                <div className="travel-card-image">
                  <img src={dest.image} alt={dest.name} loading="lazy" />
                  <button className="btn-wishlist-card">
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
                    {dest.location}
                  </div>
                  <h3>{dest.name}</h3>
                  <div className="card-rating-row">
                    <div className="rating-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <span>{dest.rating}</span>
                    </div>
                    <span className="reviews-count">({dest.reviews} reviews)</span>
                  </div>
                  <div className="card-price-row">
                    <span className="price-label">From</span>
                    <span className="price-amount">{dest.price}</span>
                  </div>
                  <button className="btn-book-card">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="destinations-row promo-row animate-on-scroll">
        <div className="container">
          <div className="row-header">
            <div className="row-title-group">
              <h2>Special Offers & Deals</h2>
              <p>Save up to 30% on selected destinations</p>
            </div>
          </div>

          <div className="cards-horizontal-scroll">
            {promoDestinations.map((dest) => (
              <div key={dest.id} className="travel-card promo-card">
                <div className="travel-card-image">
                  <img src={dest.image} alt={dest.name} loading="lazy" />
                  <div className="discount-badge">{dest.discount}% OFF</div>
                  <button className="btn-wishlist-card">
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
                    {dest.location}
                  </div>
                  <h3>{dest.name}</h3>
                  <div className="card-rating-row">
                    <div className="rating-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <span>{dest.rating}</span>
                    </div>
                    <span className="reviews-count">({dest.reviews} reviews)</span>
                  </div>
                  <div className="promo-price-row">
                    <span className="original-price">{dest.originalPrice}</span>
                    <span className="promo-price">{dest.price}</span>
                  </div>
                  <button className="btn-book-card promo-btn">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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