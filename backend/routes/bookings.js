const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingByCode,
  getBookingsByEmail,
  updateBookingStatus,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController');

// Public routes
router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/:bookingCode', getBookingByCode);
router.get('/customer/:email', getBookingsByEmail);
router.put('/:bookingCode/status', updateBookingStatus);
router.post('/:bookingCode/cancel', cancelBooking);

module.exports = router;