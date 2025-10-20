const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  // Booking ID yang user-friendly
  bookingCode: {
    type: String,
    required: true,
    unique: true
  },
  
  // Destination reference
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  
  // Customer information
  customer: {
    name: {
      type: String,
      required: [true, 'Nama wajib diisi'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email tidak valid']
    },
    phone: {
      type: String,
      required: [true, 'Nomor telepon wajib diisi'],
      trim: true
    },
    whatsapp: {
      type: String,
      trim: true
    }
  },
  
  // Trip details
  tripDetails: {
    checkInDate: {
      type: Date,
      required: [true, 'Tanggal check-in wajib diisi']
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Tanggal check-out wajib diisi']
    },
    numberOfGuests: {
      adults: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      },
      children: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    duration: {
      type: Number, // in days
      required: true
    }
  },
  
  // Package & pricing
  package: {
    name: {
      type: String,
      required: true,
      default: 'Standard Package'
    },
    description: String,
    inclusions: [String]
  },
  
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    taxAndFees: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'IDR'
    }
  },
  
  // Special requests
  specialRequests: {
    dietary: String,
    accessibility: String,
    other: String
  },
  
  // Payment information
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'bank_transfer', 'e_wallet', 'cash'],
      default: 'bank_transfer'
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    paymentProof: String
  },
  
  // Booking status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
    default: 'pending'
  },
  
  // Confirmation & notifications
  confirmationSentAt: Date,
  reminderSentAt: Date,
  
  // Cancellation
  cancellation: {
    cancelledAt: Date,
    cancelledBy: {
      type: String,
      enum: ['customer', 'admin', 'system']
    },
    reason: String,
    refundAmount: Number
  },
  
  // AI conversation metadata
  aiMetadata: {
    sessionId: String,
    conversationSteps: [String],
    createdViaVoice: {
      type: Boolean,
      default: false
    }
  },
  
  // Notes (internal)
  notes: String
  
}, {
  timestamps: true
});

// Generate booking code (format: WDL-YYYYMMDD-XXXXX)
BookingSchema.pre('save', async function(next) {
  if (!this.bookingCode) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(10000 + Math.random() * 90000);
    this.bookingCode = `WDL-${date}-${random}`;
  }
  next();
});

// Calculate duration automatically
BookingSchema.pre('save', function(next) {
  if (this.tripDetails.checkInDate && this.tripDetails.checkOutDate) {
    const duration = Math.ceil(
      (this.tripDetails.checkOutDate - this.tripDetails.checkInDate) / (1000 * 60 * 60 * 24)
    );
    this.tripDetails.duration = duration;
  }
  next();
});

// Calculate total price
BookingSchema.methods.calculateTotalPrice = function() {
  const base = this.pricing.basePrice * this.tripDetails.duration;
  const tax = base * 0.11; // 11% tax
  const total = base + tax - (this.pricing.discount || 0);
  
  this.pricing.taxAndFees = tax;
  this.pricing.totalPrice = total;
  
  return total;
};

// Format booking for confirmation
BookingSchema.methods.formatConfirmation = function() {
  return {
    bookingCode: this.bookingCode,
    destination: this.destination.name,
    customer: this.customer.name,
    checkIn: this.tripDetails.checkInDate.toLocaleDateString('id-ID'),
    checkOut: this.tripDetails.checkOutDate.toLocaleDateString('id-ID'),
    guests: `${this.tripDetails.numberOfGuests.adults} dewasa${this.tripDetails.numberOfGuests.children > 0 ? `, ${this.tripDetails.numberOfGuests.children} anak` : ''}`,
    totalPrice: new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(this.pricing.totalPrice),
    status: this.status
  };
};

// Index untuk pencarian
BookingSchema.index({ bookingCode: 1 });
BookingSchema.index({ 'customer.email': 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', BookingSchema);