const Destination = require('../models/Destination');
const path = require('path');
const fs = require('fs');

// @desc    Get all destinations (dengan search & filter)
// @route   GET /api/destinations
// @access  Public
exports.getDestinations = async (req, res) => {
  try {
    const { search, category, country, minPrice, maxPrice, sortBy } = req.query;
    
    // PENTING: Jangan filter isActive dulu untuk testing
    let query = {};
    
    // Search berdasarkan nama, deskripsi, kota, atau negara
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
        { country: new RegExp(search, 'i') }
      ];
    }
    
    // Filter berdasarkan kategori
    if (category) {
      query.category = category;
    }
    
    // Filter berdasarkan negara
    if (country) {
      query.country = new RegExp(country, 'i');
    }
    
    // Filter berdasarkan harga
    if (minPrice || maxPrice) {
      query['price.min'] = {};
      if (minPrice) query['price.min'].$gte = Number(minPrice);
      if (maxPrice) query['price.max'] = { $lte: Number(maxPrice) };
    }
    
    // Sorting
    let sort = {};
    if (sortBy === 'rating') {
      sort = { averageRating: -1 };
    } else if (sortBy === 'price-low') {
      sort = { 'price.min': 1 };
    } else if (sortBy === 'price-high') {
      sort = { 'price.min': -1 };
    } else {
      sort = { createdAt: -1 }; // Default: newest first
    }
    
    console.log('🔍 Query:', JSON.stringify(query));
    
    const destinations = await Destination.find(query).sort(sort);
    
    console.log('✅ Found destinations:', destinations.length);
    
    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (error) {
    console.error('❌ Error in getDestinations:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data destinasi',
      error: error.message
    });
  }
};

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
// @access  Public
exports.getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destinasi tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: destination
    });
  } catch (error) {
    console.error('Error in getDestinationById:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail destinasi',
      error: error.message
    });
  }
};

// @desc    Create new destination
// @route   POST /api/destinations
// @access  Public (untuk MVP)
exports.createDestination = async (req, res) => {
  try {
    const destinationData = {
      ...req.body,
      images: []
    };
    
    // Handle multiple file uploads
    if (req.files && req.files.length > 0) {
      destinationData.images = req.files.map(file => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`
      }));
    }
    
    const destination = await Destination.create(destinationData);
    
    res.status(201).json({
      success: true,
      message: 'Destinasi berhasil ditambahkan',
      data: destination
    });
  } catch (error) {
    console.error('Error in createDestination:', error);
    res.status(400).json({
      success: false,
      message: 'Gagal menambahkan destinasi',
      error: error.message
    });
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Public (untuk MVP)
exports.updateDestination = async (req, res) => {
  try {
    let destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destinasi tidak ditemukan'
      });
    }
    
    const updateData = { ...req.body };
    
    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`
      }));
      
      updateData.images = [...destination.images, ...newImages];
    }
    
    destination = await Destination.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Destinasi berhasil diupdate',
      data: destination
    });
  } catch (error) {
    console.error('Error in updateDestination:', error);
    res.status(400).json({
      success: false,
      message: 'Gagal mengupdate destinasi',
      error: error.message
    });
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Public (untuk MVP)
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destinasi tidak ditemukan'
      });
    }
    
    // Hapus file gambar dari storage
    if (destination.images && destination.images.length > 0) {
      destination.images.forEach(image => {
        const imagePath = path.join(__dirname, '..', 'uploads', image.filename);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }
    
    await destination.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Destinasi berhasil dihapus',
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteDestination:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus destinasi',
      error: error.message
    });
  }
};

// @desc    Add review to destination
// @route   POST /api/destinations/:id/reviews
// @access  Public (untuk MVP)
exports.addReview = async (req, res) => {
  try {
    const { userName, rating, comment } = req.body;
    
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destinasi tidak ditemukan'
      });
    }
    
    const review = {
      userName,
      rating: Number(rating),
      comment
    };
    
    destination.reviews.push(review);
    await destination.calculateAverageRating();
    
    res.status(201).json({
      success: true,
      message: 'Review berhasil ditambahkan',
      data: destination
    });
  } catch (error) {
    console.error('Error in addReview:', error);
    res.status(400).json({
      success: false,
      message: 'Gagal menambahkan review',
      error: error.message
    });
  }
};

// @desc    Delete image from destination
// @route   DELETE /api/destinations/:id/images/:filename
// @access  Public (untuk MVP)
exports.deleteImage = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destinasi tidak ditemukan'
      });
    }
    
    const { filename } = req.params;
    
    // Hapus dari array images
    destination.images = destination.images.filter(img => img.filename !== filename);
    await destination.save();
    
    // Hapus file dari storage
    const imagePath = path.join(__dirname, '..', 'uploads', filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    res.status(200).json({
      success: true,
      message: 'Gambar berhasil dihapus',
      data: destination
    });
  } catch (error) {
    console.error('Error in deleteImage:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus gambar',
      error: error.message
    });
  }
};