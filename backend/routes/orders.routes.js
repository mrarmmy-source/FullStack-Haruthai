const { Router } = require('express');
const { getMyOrders, getAllOrders, createOrder, updateOrderStatus } = require('../controllers/orders.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

router.get('/my', authMiddleware, getMyOrders);
router.get('/', authMiddleware, getAllOrders);
router.post('/', authMiddleware, createOrder);
router.patch('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;
