// frontend/src/pages/Destinations.js - PROFESSIONAL REDESIGN
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDestinations } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import NearbyPlacesMap from '../components/NearbyPlacesMap';
import '../styles/Destinations.css';

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const categories = [
    { id: 'all', name: 'All Destinations', icon: '🌍' },
    { id: 'Pantai', name: 'Beach & Islands', icon: '🏖️' },
    { id: 'Gunung', name: 'Mountains', icon: '⛰️' },
    { id: 'Kota', name: 'Cities', icon: '🏙️' },
    { id: 'Sejarah', name: 'Historical', icon: '🏛️' },
    { id: 'Petualangan', name: 'Adventure', icon: '🎿' },
  ];

  useEffect(() => {
    fetchDestinations();
  }, []);

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

  const filteredDestinations = destinations
    .filter(dest => {
      const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
      const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dest.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'price-low':
          return (a.price?.min || 0) - (b.price?.min || 0);
        case 'price-high':
          return (b.price?.min || 0) - (a.price?.min || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const handleDestinationSelect = (dest) => {
    setSelectedDestination(dest);
    setShowMap(true);
  };

  if (loading) {
    return (
      <div className="destinations-page">
        <div className="loading-state">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p className="loading-text">Loading amazing destinations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="destinations-page">
        <div className="error-state">
          <div className="error-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button className="btn-retry" onClick={fetchDestinations}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="destinations-page">
      {/* Hero Header */}
      <div className="destinations-hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
          <div className="hero-gradient"></div>
        </div>
        
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="badge-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </span>
            <span>Explore Indonesia</span>
          </div>
          
          <h1 className="hero-title">
            Discover Amazing <span className="title-highlight">Destinations</span>
          </h1>
          
          <p className="hero-subtitle">
            From pristine beaches to majestic mountains, find your perfect getaway
          </p>

          {/* Search Bar */}
          <div className="search-bar-wrapper">
            <div className="search-bar">
              <div className="search-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search destinations, cities, or activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
            
            <Link to="/voice-agent" className="btn-voice-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              </svg>
              <span>Voice Search</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{destinations.length}+</div>
              <div className="stat-label">Destinations</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Happy Travelers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.8</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="container">
          {/* Categories */}
          <div className="categories-scroll">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="chip-label">{cat.name}</span>
                {selectedCategory === cat.id && (
                  <span className="chip-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Sort & View Controls */}
          <div className="controls-row">
            <div className="results-count">
              <strong>{filteredDestinations.length}</strong> {filteredDestinations.length === 1 ? 'destination' : 'destinations'} found
            </div>
            
            <div className="controls-group">
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>

              <button 
                className={`btn-map-toggle ${showMap ? 'active' : ''}`}
                onClick={() => setShowMap(!showMap)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                  <line x1="8" y1="2" x2="8" y2="18"/>
                  <line x1="16" y1="6" x2="16" y2="22"/>
                </svg>
                <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container main-content-section">
        {filteredDestinations.length === 0 ? (
          <div className="empty-results">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <h3>No destinations found</h3>
            <p>Try adjusting your search or filters</p>
            <button 
              className="btn-reset"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="destinations-grid">
            {filteredDestinations.map((dest, index) => (
              <div 
                key={dest._id}
                className="grid-item"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleDestinationSelect(dest)}
              >
                <DestinationCard destination={dest} />
              </div>
            ))}
          </div>
        )}

        {/* Maps & Nearby Places */}
        {showMap && selectedDestination && (
          <div className="map-section">
            <div className="map-header">
              <h2>Explore Nearby</h2>
              <p>Discover restaurants, cafes, and attractions near {selectedDestination.name}</p>
            </div>
            <NearbyPlacesMap 
              destination={selectedDestination}
              onClose={() => {
                setShowMap(false);
                setSelectedDestination(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Destinations;