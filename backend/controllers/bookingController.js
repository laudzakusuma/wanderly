const Booking = require('../models/Booking');
const Destination = require('../models/Destination');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
exports.createBooking = async (req, res) => {
  try {
    const {
      destinationId,
      customer,
      tripDetails,
      specialRequests,
      aiMetadata
    } = req.body;

    // Validate destination exists
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destinasi tidak ditemukan'
      });
    }

    // Validate dates
    const checkIn = new Date(tripDetails.checkInDate);
    const checkOut = new Date(tripDetails.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return res.status(400).json({
        success: false,
        message: 'Tanggal check-in tidak boleh di masa lalu'
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        success: false,
        message: 'Tanggal check-out harus setelah check-in'
      });
    }

    // Calculate pricing
    const duration = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const basePrice = destination.price.min; // Use minimum price as base
    const totalGuests = tripDetails.numberOfGuests.adults + (tripDetails.numberOfGuests.children || 0);
    
    const pricing = {
      basePrice: basePrice * totalGuests,
      taxAndFees: (basePrice * totalGuests * duration) * 0.11,
      discount: 0,
      totalPrice: 0,
      currency: destination.price.currency
    };

    pricing.totalPrice = (pricing.basePrice * duration) + pricing.taxAndFees;

    // Create booking
    const booking = await Booking.create({
      destination: destinationId,
      customer,
      tripDetails: {
        ...tripDetails,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        duration
      },
      package: {
        name: 'Standard Package',
        description: `Paket wisata ${duration} hari ${duration - 1} malam ke ${destination.name}`,
        inclusions: [
          'Akomodasi',
          'Tour guide',
          'Transportasi lokal',
          'Tiket masuk objek wisata'
        ]
      },
      pricing,
      specialRequests: specialRequests || {},
      aiMetadata: aiMetadata || {}
    });

    // Populate destination details
    await booking.populate('destination');

    res.status(201).json({
      success: true,
      message: 'Booking berhasil dibuat',
      data: booking,
      confirmation: booking.formatConfirmation()
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({
      success: false,
      message: 'Gagal membuat booking',
      error: error.message
    });
  }
};

// @desc    Get booking by code
// @route   GET /api/bookings/:bookingCode
// @access  Public
exports.getBookingByCode = async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      bookingCode: req.params.bookingCode 
    }).populate('destination');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Error getting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data booking'
    });
  }
};

// @desc    Get bookings by email
// @route   GET /api/bookings/customer/:email
// @access  Public
exports.getBookingsByEmail = async (req, res) => {
  try {
    const bookings = await Booking.find({
      'customer.email': req.params.email
    })
    .populate('destination')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {
    console.error('Error getting bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data booking'
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:bookingCode/status
// @access  Public (should be protected in production)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findOne({ 
      bookingCode: req.params.bookingCode 
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking tidak ditemukan'
      });
    }

    if (status) {
      booking.status = status;
    }

    if (paymentStatus) {
      booking.payment.status = paymentStatus;
      if (paymentStatus === 'completed') {
        booking.payment.paidAt = Date.now();
        booking.status = 'confirmed';
        booking.confirmationSentAt = Date.now();
      }
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Status booking berhasil diupdate',
      data: booking
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(400).json({
      success: false,
      message: 'Gagal mengupdate booking'
    });
  }
};

// @desc    Cancel booking
// @route   POST /api/bookings/:bookingCode/cancel
// @access  Public
exports.cancelBooking = async (req, res) => {
  try {
    const { reason, cancelledBy } = req.body;

    const booking = await Booking.findOne({ 
      bookingCode: req.params.bookingCode 
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking tidak ditemukan'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking sudah dibatalkan'
      });
    }

    // Calculate refund (simplified - 100% if > 7 days, 50% if 3-7 days, 0% if < 3 days)
    const daysUntilCheckIn = Math.ceil(
      (booking.tripDetails.checkInDate - Date.now()) / (1000 * 60 * 60 * 24)
    );

    let refundPercentage = 0;
    if (daysUntilCheckIn > 7) refundPercentage = 100;
    else if (daysUntilCheckIn >= 3) refundPercentage = 50;

    const refundAmount = (booking.pricing.totalPrice * refundPercentage) / 100;

    booking.status = 'cancelled';
    booking.cancellation = {
      cancelledAt: Date.now(),
      cancelledBy: cancelledBy || 'customer',
      reason,
      refundAmount
    };

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking berhasil dibatalkan',
      data: booking,
      refund: {
        amount: refundAmount,
        percentage: refundPercentage
      }
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(400).json({
      success: false,
      message: 'Gagal membatalkan booking'
    });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Public (should be protected)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('destination')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: bookings
    });

  } catch (error) {
    console.error('Error getting bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data booking'
    });
  }
};