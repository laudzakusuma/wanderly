import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Hero.css';

const DESTINATION_BACKGROUNDS = [
  {
    name: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2938&auto=format&fit=crop',
  },
  {
    name: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2894&auto=format&fit=crop',
  },
  {
    name: 'Hawaii, USA',
    image: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?q=80&w=2969&auto=format&fit=crop',
  },
  {
    name: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2835&auto=format&fit=crop',
  },
  {
    name: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2940&auto=format&fit=crop',
  },
  {
    name: 'Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2865&auto=format&fit=crop',
  }
];

const Hero = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % DESTINATION_BACKGROUNDS.length);
          setTimeout(() => setIsTransitioning(false), 100);
        }, 300);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(`/destinations?search=${searchQuery}`);
    }
  };

  const parallaxStyle = {
    transform: `translateY(${scrollY * 0.4}px)`,
    opacity: Math.max(0, 1 - scrollY / 600)
  };

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 300);
  };

  return (
    <section 
      className="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-background">
        <div className="hero-slides-wrapper">
          {DESTINATION_BACKGROUNDS.map((destination, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''} ${
                isTransitioning && index === currentSlide ? 'transitioning' : ''
              }`}
            >
              <img
                src={destination.image}
                alt={destination.name}
                className="hero-background-image"
                style={{ 
                  transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0001})` 
                }}
              />
            </div>
          ))}
          <div className="hero-overlay-gradient"></div>
        </div>

        <div className="destination-indicator">
          <svg className="indicator-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span className="destination-name">{DESTINATION_BACKGROUNDS[currentSlide].name}</span>
        </div>

        <div className="slide-dots">
          {DESTINATION_BACKGROUNDS.map((_, index) => (
            <button
              key={index}
              className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to ${DESTINATION_BACKGROUNDS[index].name}`}
            >
              <span className="dot-inner"></span>
              <span 
                className="dot-progress" 
                style={{
                  animationPlayState: index === currentSlide && !isPaused ? 'running' : 'paused'
                }}
              ></span>
            </button>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="hero-content" style={parallaxStyle}>
          <div className="hero-badge">
            <svg className="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <span>Explore the World</span>
          </div>

          <h1 className="hero-title">
            Discover Your Next
            <span className="hero-title-highlight"> Adventure</span>
          </h1>
          
          <p className="hero-subtitle">
            Explore breathtaking destinations, curate your travel bucket list, 
            and share unforgettable experiences with travelers worldwide
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <div className="search-wrapper">
              <div className="search-icon-box">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <input
                type="text"
                className="search-input"
                placeholder="Search destinations, cities, or countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="search-button">
              <span>Search Now</span>
              <svg className="button-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </form>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">100+</h3>
                <p className="stat-label">Destinations</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">2.5K+</h3>
                <p className="stat-label">Reviews</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">5K+</h3>
                <p className="stat-label">Travelers</p>
              </div>
            </div>
          </div>

          <div className="scroll-indicator">
            <div className="scroll-mouse">
              <div className="scroll-wheel"></div>
            </div>
            <p>Scroll to explore</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;