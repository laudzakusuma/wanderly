import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDestinationById, updateDestination } from '../services/api';
import '../styles/Form.css';

const EditDestination = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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

  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const categories = [
    'Pantai', 'Gunung', 'Kota', 'Sejarah', 
    'Kuliner', 'Petualangan', 'Religi', 'Lainnya'
  ];

  useEffect(() => {
    fetchDestination();
  }, [id]);

  const fetchDestination = async () => {
    try {
      setLoading(true);
      const response = await getDestinationById(id);
      const dest = response.data;
      
      setFormData({
        name: dest.name || '',
        country: dest.country || '',
        city: dest.city || '',
        description: dest.description || '',
        category: dest.category || 'Pantai',
        priceMin: dest.price?.min || '',
        priceMax: dest.price?.max || '',
        currency: dest.price?.currency || 'IDR',
        tags: dest.tags ? dest.tags.join(', ') : '',
        latitude: dest.location?.latitude || '',
        longitude: dest.location?.longitude || ''
      });
      
    } catch (err) {
      setError('Gagal memuat destinasi');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      setError('Maksimal 5 gambar baru');
      return;
    }

    setNewImages(files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price[currency]', formData.currency);
      formDataToSend.append('price[min]', formData.priceMin);
      formDataToSend.append('price[max]', formData.priceMax);

      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map(tag => tag.trim());
        tagsArray.forEach(tag => formDataToSend.append('tags[]', tag));
      }

      if (formData.latitude && formData.longitude) {
        formDataToSend.append('location[latitude]', formData.latitude);
        formDataToSend.append('location[longitude]', formData.longitude);
      }

      newImages.forEach(image => {
        formDataToSend.append('images', image);
      });

      await updateDestination(id, formDataToSend);
      alert('Destinasi berhasil diupdate!');
      navigate(`/destinations/${id}`);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengupdate destinasi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="add-destination-page">
      <div className="container">
        <div className="page-header-simple">
          <h1 className="page-title">Edit Destinasi</h1>
          <p className="page-subtitle">Perbarui informasi destinasi Anda</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="destination-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="form-section-title">Informasi Dasar</h3>
            
            <div className="form-group">
              <label className="form-label">Nama Destinasi *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Negara *</label>
                <input
                  type="text"
                  name="country"
                  className="form-control"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kota *</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Kategori *</label>
              <select
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
              <label className="form-label">Deskripsi *</label>
              <textarea
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Informasi Harga</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Harga Minimum *</label>
                <input
                  type="number"
                  name="priceMin"
                  className="form-control"
                  value={formData.priceMin}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Harga Maksimum *</label>
                <input
                  type="number"
                  name="priceMax"
                  className="form-control"
                  value={formData.priceMax}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Tambah Gambar Baru (Opsional)</h3>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="form-control"
            />
            {imagePreviews.length > 0 && (
              <div className="image-preview-grid" style={{marginTop: '1rem'}}>
                {imagePreviews.map((preview, index) => (
                  <img key={index} src={preview} alt={`Preview ${index + 1}`} style={{width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px'}} />
                ))}
              </div>
            )}
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Info Tambahan</h3>
            
            <div className="form-group">
              <label className="form-label">Tags (pisahkan dengan koma)</label>
              <input
                type="text"
                name="tags"
                className="form-control"
                value={formData.tags}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  className="form-control"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  step="any"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  className="form-control"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  step="any"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(`/destinations/${id}`)}
              disabled={saving}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDestination;