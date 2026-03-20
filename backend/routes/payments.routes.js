const { Router } = require('express');
const { getMyPayments, getAllPayments, createPayment, updatePaymentStatus, updatePaymentStatusByCustomer } = require('../controllers/payments.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

router.get('/my', authMiddleware, getMyPayments);
router.get('/', authMiddleware, getAllPayments);
router.post('/', authMiddleware, createPayment);
router.patch('/by-customer', authMiddleware, updatePaymentStatusByCustomer);
router.patch('/:id/status', authMiddleware, updatePaymentStatus);

module.exports = router;
