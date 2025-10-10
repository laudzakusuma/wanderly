import React, { useState, useEffect } from 'react';
import { getDestinations, getFavorites } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const favoriteIds = getFavorites();
      
      if (favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const response = await getDestinations();
      const favoriteDests = response.data.filter(dest => 
        favoriteIds.includes(dest._id)
      );
      
      setFavorites(favoriteDests);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Memuat favorit...</p>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">❤️ Destinasi Favorit Saya</h1>
          <p className="page-subtitle">
            Destinasi yang telah Anda simpan untuk referensi nanti
          </p>
        </div>
      </div>

      <div className="container" style={{paddingTop: '3rem', paddingBottom: '3rem'}}>
        {favorites.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">💔</span>
            <h3>Belum ada destinasi favorit</h3>
            <p>Mulai jelajahi dan tambahkan destinasi ke favorit Anda</p>
            <Link to="/destinations" className="btn btn-primary">
              Jelajahi Destinasi
            </Link>
          </div>
        ) : (
          <>
            <p className="results-count" style={{marginBottom: '2rem', textAlign: 'center'}}>
              Anda memiliki <strong>{favorites.length}</strong> destinasi favorit
            </p>
            <div className="destination-grid">
              {favorites.map(destination => (
                <DestinationCard key={destination._id} destination={destination} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;