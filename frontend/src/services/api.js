import axios from 'axios';

// Base API URL (akan otomatis proxy ke backend)
const API_URL = '/api/destinations';
const BACKEND_URL = 'http://localhost:5000';

// Helper function to format image URLs
export const formatImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop';
  }
  
  // If it's already a full URL (Unsplash, etc), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend backend URL
  return `${BACKEND_URL}${imagePath}`;
};

// Get all destinations dengan query params
export const getDestinations = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, { params });
    
    // Format image URLs in response
    if (response.data && response.data.data) {
      response.data.data = response.data.data.map(dest => ({
        ...dest,
        imageUrl: dest.imageUrl || formatImageUrl(dest.images?.[0]?.path),
        images: dest.images?.map(img => ({
          ...img,
          path: formatImageUrl(img.path)
        }))
      }));
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
};

// Get single destination by ID
export const getDestinationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    
    // Format image URLs in response
    if (response.data && response.data.data) {
      const dest = response.data.data;
      response.data.data = {
        ...dest,
        imageUrl: dest.imageUrl || formatImageUrl(dest.images?.[0]?.path),
        images: dest.images?.map(img => ({
          ...img,
          path: formatImageUrl(img.path)
        }))
      };
    }
    
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
  try {
    const favorites = localStorage.getItem('wanderly_favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addFavorite = (destinationId) => {
  try {
    const favorites = getFavorites();
    if (!favorites.includes(destinationId)) {
      favorites.push(destinationId);
      localStorage.setItem('wanderly_favorites', JSON.stringify(favorites));
    }
    return favorites;
  } catch (error) {
    console.error('Error adding favorite:', error);
    return getFavorites();
  }
};

export const removeFavorite = (destinationId) => {
  try {
    let favorites = getFavorites();
    favorites = favorites.filter(id => id !== destinationId);
    localStorage.setItem('wanderly_favorites', JSON.stringify(favorites));
    return favorites;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return getFavorites();
  }
};

export const isFavorite = (destinationId) => {
  try {
    const favorites = getFavorites();
    return favorites.includes(destinationId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};