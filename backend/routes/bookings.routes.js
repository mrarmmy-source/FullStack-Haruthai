const { Router } = require('express');
const { createBooking, getMyBookings, getAllBookings, updateBookingStatus } = require('../controllers/bookings.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

router.get('/my', authMiddleware, getMyBookings);
router.get('/', authMiddleware, getAllBookings);
router.post('/', authMiddleware, createBooking);
router.patch('/:id/status', authMiddleware, updateBookingStatus);

module.exports = router;
