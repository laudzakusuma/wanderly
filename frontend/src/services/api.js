import axios from 'axios';

// Base API URL - pakai direct URL untuk testing
const API_URL = 'http://localhost:5000/api/destinations';

// Get all destinations dengan query params
export const getDestinations = async (params = {}) => {
  try {
    console.log('🔍 Fetching destinations from:', API_URL);
    console.log('📋 Params:', params);
    
    const response = await axios.get(API_URL, { params });
    
    console.log('✅ Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching destinations:', error);
    throw error;
  }
};

// Get single destination by ID
export const getDestinationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching destination:', error);
    throw error;
  }
};

// Create new destination
export const createDestination = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating destination:', error);
    throw error;
  }
};

// Update destination
export const updateDestination = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating destination:', error);
    throw error;
  }
};

// Delete destination
export const deleteDestination = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting destination:', error);
    throw error;
  }
};

// Add review to destination
export const addReview = async (id, reviewData) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// Delete image from destination
export const deleteImage = async (destinationId, filename) => {
  try {
    const response = await axios.delete(`${API_URL}/${destinationId}/images/${filename}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// LocalStorage helpers for favorites
export const getFavorites = () => {
  const favorites = localStorage.getItem('wanderly_favorites');
  return favorites ? JSON.parse(favorites) : [];
};

export const addFavorite = (destinationId) => {
  const favorites = getFavorites();
  if (!favorites.includes(destinationId)) {
    favorites.push(destinationId);
    localStorage.setItem('wanderly_favorites', JSON.stringify(favorites));
  }
  return favorites;
};

export const removeFavorite = (destinationId) => {
  let favorites = getFavorites();
  favorites = favorites.filter(id => id !== destinationId);
  localStorage.setItem('wanderly_favorites', JSON.stringify(favorites));
  return favorites;
};

export const isFavorite = (destinationId) => {
  const favorites = getFavorites();
  return favorites.includes(destinationId);
};