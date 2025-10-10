const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
  addReview,
  deleteImage
} = require('../controllers/destinationController');

// Konfigurasi Multer untuk upload image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'destination-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Hanya gambar (JPEG, JPG, PNG, GIF, WEBP) yang diperbolehkan.'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

// Routes
router.route('/')
  .get(getDestinations)
  .post(upload.array('images', 5), createDestination); // Max 5 images per destination

router.route('/:id')
  .get(getDestinationById)
  .put(upload.array('images', 5), updateDestination)
  .delete(deleteDestination);

router.route('/:id/reviews')
  .post(addReview);

router.route('/:id/images/:filename')
  .delete(deleteImage);

module.exports = router;