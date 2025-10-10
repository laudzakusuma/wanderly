import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DestinationCard from '../components/DestinationCard';
import '../styles/Destinations.css';

const CATEGORIES = ['All', 'Beach', 'Mountain', 'City', 'Island', 'Desert', 'Forest'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'recent', label: 'Recently Added' }
];

const Destinations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');

  // Fetch destinations from API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/destinations');
        
        if (!response.ok) {
          throw new Error('Failed to fetch destinations');
        }
        
        const data = await response.json();
        setDestinations(data);
        setFilteredDestinations(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching destinations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Filter and sort destinations
  useEffect(() => {
    let result = [...destinations];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(dest => dest.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price-low':
        result.sort((a, b) => a.estimatedCost - b.estimatedCost);
        break;
      case 'price-high':
        result.sort((a, b) => b.estimatedCost - a.estimatedCost);
        break;
      case 'recent':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredDestinations(result);
  }, [destinations, searchQuery, selectedCategory, sortBy]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchParams(value ? { search: value } : {});
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="destinations-page">
      {/* Page Header */}
      <section className="destinations-header">
        <div className="container">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">
                Explore <span className="title-highlight">Destinations</span>
              </h1>
              <p className="page-subtitle">
                Discover amazing places around the world and plan your next adventure
              </p>
            </div>

            <div className="header-stats">
              <div className="stat-box">
                <span className="stat-number">{destinations.length}</span>
                <span className="stat-label">Destinations</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{filteredDestinations.length}</span>
                <span className="stat-label">Found</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-wrapper">
            {/* Search Bar */}
            <div className="search-container">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search destinations, countries..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="category-filters">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort & View Controls */}
            <div className="controls-bar">
              <div className="sort-control">
                <label htmlFor="sort-select" className="sort-label">Sort by:</label>
                <select
                  id="sort-select"
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="destinations-grid-section">
        <div className="container">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading amazing destinations...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredDestinations.length === 0 && (
            <div className="empty-state">
              <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <h3>No destinations found</h3>
              <p>Try adjusting your search or filters</p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {!loading && !error && filteredDestinations.length > 0 && (
            <div className={`destinations-grid ${viewMode}`}>
              {filteredDestinations.map((destination) => (
                <DestinationCard key={destination._id} destination={destination} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Destinations;