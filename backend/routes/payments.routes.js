const { Router } = require('express');
const { getAllPayments, getPaymentByOrderId, createPayment, confirmPayment } = require('../controllers/payments.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

router.get('/', authMiddleware, getAllPayments);
router.get('/order/:order_id', getPaymentByOrderId);
router.post('/', createPayment);
router.patch('/:id/confirm', authMiddleware, confirmPayment);

module.exports = router;
