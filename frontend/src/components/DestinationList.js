import React, { useState, useEffect, useRef } from 'react';
import { getDestinations } from '../services/api';
import DestinationCard from './DestinationCard';
import SearchFilter from './SearchFilter';
import '../styles/DestinationList.css';

const DestinationList = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    country: '',
    sortBy: ''
  });

  const sectionRef = useRef(null);

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, destinations]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await getDestinations();
      setDestinations(response.data);
      setFilteredDestinations(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching destinations:', err);
      setError('Failed to load destinations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...destinations];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchLower) ||
        dest.description.toLowerCase().includes(searchLower) ||
        dest.city.toLowerCase().includes(searchLower) ||
        dest.country.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(dest => dest.category === filters.category);
    }

    if (filters.country) {
      filtered = filtered.filter(dest =>
        dest.country.toLowerCase().includes(filters.country.toLowerCase())
      );
    }

    if (filters.sortBy === 'rating') {
      filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else if (filters.sortBy === 'price-low') {
      filtered.sort((a, b) => (a.price?.min || 0) - (b.price?.min || 0));
    } else if (filters.sortBy === 'price-high') {
      filtered.sort((a, b) => (b.price?.min || 0) - (a.price?.min || 0));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredDestinations(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading destinations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchDestinations}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="destination-list-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Popular Destinations</h2>
          <p className="section-subtitle">
            Discover your dream destination from our curated collection of breathtaking locations
          </p>
        </div>

        <SearchFilter onFilterChange={handleFilterChange} />

        <div className="results-info">
          <p className="results-count">
            Showing <strong>{filteredDestinations.length}</strong> of <strong>{destinations.length}</strong> destinations
          </p>
        </div>

        {filteredDestinations.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <h3>No destinations found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button 
              className="btn btn-primary"
              onClick={() => setFilters({ search: '', category: '', country: '', sortBy: '' })}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="destination-grid">
            {filteredDestinations.map((destination) => (
              <DestinationCard key={destination._id} destination={destination} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DestinationList;