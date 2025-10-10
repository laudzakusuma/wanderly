import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDestination } from '../services/api';
import '../styles/Pages.css';
import '../styles/Form.css';

const AddDestination = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    city: '',
    description: '',
    category: 'Pantai',
    priceMin: '',
    priceMax: '',
    currency: 'IDR',
    tags: '',
    latitude: '',
    longitude: ''
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const categories = [
    'Pantai', 'Gunung', 'Kota', 'Sejarah', 
    'Kuliner', 'Petualangan', 'Religi', 'Lainnya'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      setError('Maksimal 5 gambar');
      return;
    }

    setImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      
      // Price object
      formDataToSend.append('price[currency]', formData.currency);
      formDataToSend.append('price[min]', formData.priceMin);
      formDataToSend.append('price[max]', formData.priceMax);

      // Tags (convert comma-separated to array)
      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map(tag => tag.trim());
        tagsArray.forEach(tag => {
          formDataToSend.append('tags[]', tag);
        });
      }

      // Location
      if (formData.latitude && formData.longitude) {
        formDataToSend.append('location[latitude]', formData.latitude);
        formDataToSend.append('location[longitude]', formData.longitude);
      }

      // Append images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await createDestination(formDataToSend);
      
      setSuccess(true);
      setTimeout(() => {
        navigate(`/destinations/${response.data._id}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error creating destination:', err);
      setError(err.response?.data?.message || 'Gagal menambahkan destinasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-destination-page">
      <div className="container">
        <div className="page-header-simple">
          <h1 className="page-title">Tambah Destinasi Baru</h1>
          <p className="page-subtitle">Bagikan destinasi favorit Anda dengan traveler lainnya</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            ✅ Destinasi berhasil ditambahkan! Mengalihkan...
          </div>
        )}

        <form className="destination-form" onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="form-section">
            <h3 className="form-section-title">Informasi Dasar</h3>
            
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Nama Destinasi <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="Contoh: Pantai Kuta Bali"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="country">
                  Negara <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  className="form-control"
                  placeholder="Indonesia"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="city">
                  Kota <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-control"
                  placeholder="Bali"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Kategori <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Deskripsi <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                placeholder="Ceritakan tentang destinasi ini..."
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                required
              />
            </div>
          </div>

          {/* Price Info */}
          <div className="form-section">
            <h3 className="form-section-title">Informasi Harga</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="priceMin">
                  Harga Minimum <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="priceMin"
                  name="priceMin"
                  className="form-control"
                  placeholder="50000"
                  value={formData.priceMin}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="priceMax">
                  Harga Maksimum <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="priceMax"
                  name="priceMax"
                  className="form-control"
                  placeholder="500000"
                  value={formData.priceMax}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="currency">
                  Mata Uang
                </label>
                <select
                  id="currency"
                  name="currency"
                  className="form-control"
                  value={formData.currency}
                  onChange={handleInputChange}
                >
                  <option value="IDR">IDR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="form-section">
            <h3 className="form-section-title">Foto Destinasi</h3>
            
            <div className="form-group">
              <label className="form-label">Upload Gambar (Max 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="form-control"
                disabled={images.length >= 5}
              />
              <small className="form-hint">
                Format: JPG, PNG, GIF, WEBP. Maksimal 5MB per file.
              </small>
            </div>

            {imagePreviews.length > 0 && (
              <div className="image-preview-grid">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="form-section">
            <h3 className="form-section-title">Informasi Tambahan (Opsional)</h3>
            
            <div className="form-group">
              <label className="form-label" htmlFor="tags">
                Tags (pisahkan dengan koma)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="form-control"
                placeholder="sunset, surfing, romantic"
                value={formData.tags}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="latitude">
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  className="form-control"
                  placeholder="-8.409518"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  step="any"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="longitude">
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  className="form-control"
                  placeholder="115.188919"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  step="any"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : '✨ Tambah Destinasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDestination;