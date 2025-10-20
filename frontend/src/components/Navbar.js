// frontend/src/components/Navbar.js - COMPLETE REWRITE
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
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
  }, [location]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="logo-circle">
              <span className="logo-w">W</span>
            </div>
            <span className="logo-text">Wanderly</span>
          </Link>

          {/* Desktop Menu */}
          <div className="navbar-menu">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2"/>
              </svg>
              <span>Home</span>
            </Link>

            <Link to="/voice-agent" className={`nav-link nav-link-voice ${isActive('/voice-agent') ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" strokeWidth="2"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" strokeWidth="2"/>
              </svg>
              <span>Voice AI</span>
              <span className="badge-new">NEW</span>
            </Link>

            <Link to="/favorites" className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2"/>
              </svg>
              <span>Favorites</span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`mobile-toggle ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-backdrop" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <span className="mobile-logo">Wanderly</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="mobile-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2"/>
                  <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2"/>
                </svg>
              </button>
            </div>

            <div className="mobile-menu-links">
              <Link to="/" className={`mobile-link ${isActive('/') ? 'active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2"/>
                </svg>
                <span>Home</span>
              </Link>

              <Link to="/voice-agent" className={`mobile-link mobile-link-featured ${isActive('/voice-agent') ? 'active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" strokeWidth="2"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" strokeWidth="2"/>
                </svg>
                <span>Voice AI</span>
                <span className="badge-new">NEW</span>
              </Link>

              <Link to="/favorites" className={`mobile-link ${isActive('/favorites') ? 'active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2"/>
                </svg>
                <span>Favorites</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;