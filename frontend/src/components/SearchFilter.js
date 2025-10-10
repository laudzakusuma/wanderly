import React, { useState } from 'react';
import '../styles/SearchFilter.css';

const SearchFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    country: '',
    sortBy: ''
  });

  const categories = [
    'Semua',
    'Pantai',
    'Gunung',
    'Kota',
    'Sejarah',
    'Kuliner',
    'Petualangan',
    'Religi',
    'Lainnya'
  ];

  const sortOptions = [
    { value: '', label: 'Terbaru' },
    { value: 'rating', label: 'Rating Tertinggi' },
    { value: 'price-low', label: 'Harga Terendah' },
    { value: 'price-high', label: 'Harga Tertinggi' }
  ];

  const handleInputChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryClick = (category) => {
    const categoryValue = category === 'Semua' ? '' : category;
    handleInputChange('category', categoryValue);
  };

  const resetFilters = () => {
    const resetFilters = { search: '', category: '', country: '', sortBy: '' };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="search-filter">
      {/* Search Bar */}
      <div className="filter-row">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Cari destinasi, kota, atau negara..."
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
          />
          {filters.search && (
            <button
              className="clear-btn"
              onClick={() => handleInputChange('search', '')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-controls">
          <input
            type="text"
            className="form-control country-input"
            placeholder="🌍 Filter negara..."
            value={filters.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
          />

          <select
            className="form-control sort-select"
            value={filters.sortBy}
            onChange={(e) => handleInputChange('sortBy', e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button className="btn btn-outline reset-btn" onClick={resetFilters}>
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-pills">
        {categories.map(category => (
          <button
            key={category}
            className={`category-pill ${
              (category === 'Semua' && !filters.category) || 
              filters.category === category 
                ? 'active' 
                : ''
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;