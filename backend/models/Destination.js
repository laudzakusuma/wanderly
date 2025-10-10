const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Nama user wajib diisi'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating wajib diisi'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Komentar wajib diisi'],
    maxlength: [500, 'Komentar maksimal 500 karakter']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const DestinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama destinasi wajib diisi'],
    trim: true,
    maxlength: [100, 'Nama maksimal 100 karakter']
  },
  country: {
    type: String,
    required: [true, 'Negara wajib diisi'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Kota wajib diisi'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Deskripsi wajib diisi'],
    maxlength: [1000, 'Deskripsi maksimal 1000 karakter']
  },
  category: {
    type: String,
    enum: ['Pantai', 'Gunung', 'Kota', 'Sejarah', 'Kuliner', 'Petualangan', 'Religi', 'Lainnya'],
    required: [true, 'Kategori wajib dipilih']
  },
  price: {
    currency: {
      type: String,
      default: 'IDR'
    },
    min: {
      type: Number,
      required: [true, 'Harga minimum wajib diisi'],
      min: 0
    },
    max: {
      type: Number,
      required: [true, 'Harga maksimum wajib diisi'],
      min: 0
    }
  },
  images: [{
    filename: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  reviews: [ReviewSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  tags: [String],
  location: {
    latitude: Number,
    longitude: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method untuk menghitung rata-rata rating
DestinationSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = (sum / this.reviews.length).toFixed(1);
    this.totalReviews = this.reviews.length;
  }
  return this.save();
};

// Index untuk search
DestinationSchema.index({ name: 'text', description: 'text', city: 'text', country: 'text' });

module.exports = mongoose.model('Destination', DestinationSchema);