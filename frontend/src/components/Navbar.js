import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-content">
            {/* Logo - Simple Unique W */}
            <Link to="/" className="navbar-logo">
              <div className="logo-icon-wrapper">
                <div className="logo-w">W</div>
                <div className="logo-dot"></div>
              </div>
              <span className="logo-text">Wanderly</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="navbar-links">
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
                <span>Home</span>
              </Link>
              
              <Link to="/destinations" className={`nav-link ${isActive('/destinations') ? 'active' : ''}`}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Explore</span>
              </Link>
              
              <Link to="/add-destination" className={`nav-link ${isActive('/add-destination') ? 'active' : ''}`}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v8M8 12h8"/>
                </svg>
                <span>Add New</span>
              </Link>
              
              <Link to="/favorites" className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span>Favorites</span>
              </Link>
            </div>

            {/* CTA Button */}
            <Link to="/add-destination" className="navbar-cta">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              <span>Add Destination</span>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="nav-progress-bar"></div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <div className="mobile-menu-logo">
              <div className="logo-icon-wrapper">
                <div className="logo-w">W</div>
                <div className="logo-dot"></div>
              </div>
              <span>Wanderly</span>
            </div>
            <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div className="mobile-menu-links">
            <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
              <span>Home</span>
              {isActive('/') && <div className="link-indicator"></div>}
            </Link>
            
            <Link to="/destinations" className={`mobile-nav-link ${isActive('/destinations') ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Explore</span>
              {isActive('/destinations') && <div className="link-indicator"></div>}
            </Link>
            
            <Link to="/add-destination" className={`mobile-nav-link ${isActive('/add-destination') ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v8M8 12h8"/>
              </svg>
              <span>Add New</span>
              {isActive('/add-destination') && <div className="link-indicator"></div>}
            </Link>
            
            <Link to="/favorites" className={`mobile-nav-link ${isActive('/favorites') ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>Favorites</span>
              {isActive('/favorites') && <div className="link-indicator"></div>}
            </Link>
          </div>

          <div className="mobile-menu-footer">
            <Link to="/add-destination" className="mobile-cta-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              <span>Add Destination</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;