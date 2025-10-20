import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Destinations.css';

function Destinations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Semua', icon: '🌍' },
    { id: 'beach', name: 'Pantai', icon: '🏖️' },
    { id: 'mountain', name: 'Gunung', icon: '⛰️' },
    { id: 'city', name: 'Kota', icon: '🏙️' },
    { id: 'culture', name: 'Budaya', icon: '🏛️' },
  ];

  const destinations = [
    {
      id: 1,
      name: 'Bali',
      category: 'beach',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format',
      description: 'Pulau Dewata dengan pantai eksotis dan budaya yang kaya',
      price: 'Mulai dari Rp 2.500.000',
      rating: 4.8,
      reviews: 1234
    },
    {
      id: 2,
      name: 'Raja Ampat',
      category: 'beach',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&auto=format',
      description: 'Surga bawah laut dengan keanekaragaman hayati terbaik',
      price: 'Mulai dari Rp 8.000.000',
      rating: 5.0,
      reviews: 892
    },
    {
      id: 3,
      name: 'Bromo',
      category: 'mountain',
      image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=600&auto=format',
      description: 'Gunung berapi aktif dengan pemandangan sunrise menakjubkan',
      price: 'Mulai dari Rp 1.800.000',
      rating: 4.7,
      reviews: 2156
    },
    {
      id: 4,
      name: 'Yogyakarta',
      category: 'culture',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&auto=format',
      description: 'Kota budaya dengan candi Borobudur dan Prambanan',
      price: 'Mulai dari Rp 1.500.000',
      rating: 4.6,
      reviews: 3421
    },
    {
      id: 5,
      name: 'Labuan Bajo',
      category: 'beach',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format',
      description: 'Gerbang menuju Pulau Komodo dan Pink Beach',
      price: 'Mulai dari Rp 3.500.000',
      rating: 4.9,
      reviews: 1687
    },
    {
      id: 6,
      name: 'Jakarta',
      category: 'city',
      image: 'https://images.unsplash.com/photo-1555899434-94d1eb5ac6db?w=600&auto=format',
      description: 'Ibu kota modern dengan kehidupan malam yang vibrant',
      price: 'Mulai dari Rp 1.200.000',
      rating: 4.3,
      reviews: 4532
    },
    {
      id: 7,
      name: 'Lombok',
      category: 'beach',
      image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600&auto=format',
      description: 'Pulau dengan pantai pristine dan Gunung Rinjani',
      price: 'Mulai dari Rp 2.200.000',
      rating: 4.7,
      reviews: 1876
    },
    {
      id: 8,
      name: 'Bandung',
      category: 'city',
      image: 'https://images.unsplash.com/photo-1601815060149-8e3bbaf33e6b?w=600&auto=format',
      description: 'Kota kembang dengan kuliner dan factory outlet',
      price: 'Mulai dari Rp 900.000',
      rating: 4.4,
      reviews: 2945
    },
    {
      id: 9,
      name: 'Wakatobi',
      category: 'beach',
      image: 'https://images.unsplash.com/photo-1583843156871-de22fb3dbcba?w=600&auto=format',
      description: 'Surga diving dengan terumbu karang spektakuler',
      price: 'Mulai dari Rp 6.500.000',
      rating: 4.9,
      reviews: 723
    }
  ];

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="destinations-page">
      {/* Hero Section */}
      <section className="destinations-hero">
        <div className="container">
          <h1>Jelajahi Destinasi Impian</h1>
          <p>Temukan destinasi wisata terbaik di Indonesia</p>
          
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Cari destinasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link to="/voice-agent" className="voice-search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" strokeWidth="2"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeWidth="2"/>
              </svg>
              Cari dengan Suara
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-grid">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="destinations-grid-section">
        <div className="container">
          <div className="destinations-header">
            <h2>
              {selectedCategory === 'all' ? 'Semua Destinasi' : 
               categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p>{filteredDestinations.length} destinasi ditemukan</p>
          </div>

          {filteredDestinations.length > 0 ? (
            <div className="destinations-grid">
              {filteredDestinations.map(dest => (
                <div key={dest.id} className="destination-card">
                  <div className="destination-image">
                    <img src={dest.image} alt={dest.name} />
                    <div className="destination-overlay">
                      <button className="btn-favorite">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="destination-content">
                    <h3>{dest.name}</h3>
                    <p>{dest.description}</p>
                    
                    <div className="destination-meta">
                      <div className="rating">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        <span>{dest.rating}</span>
                        <span className="reviews">({dest.reviews})</span>
                      </div>
                      <div className="price">{dest.price}</div>
                    </div>

                    <div className="destination-actions">
                      <button className="btn btn-outline btn-sm">Detail</button>
                      <button className="btn btn-primary btn-sm">Booking</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="50" fill="#f3f4f6"/>
                <path d="M60 30c-16.57 0-30 13.43-30 30s13.43 30 30 30 30-13.43 30-30-13.43-30-30-30zm0 54c-13.23 0-24-10.77-24-24s10.77-24 24-24 24 10.77 24 24-10.77 24-24 24z" fill="#9ca3af"/>
              </svg>
              <h3>Tidak Ada Hasil</h3>
              <p>Coba kata kunci lain atau gunakan AI Assistant untuk pencarian yang lebih baik</p>
              <Link to="/voice-agent" className="btn btn-primary">
                Coba AI Assistant
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Destinations;