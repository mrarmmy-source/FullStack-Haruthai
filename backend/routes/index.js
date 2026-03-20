const { Router } = require('express');
const authRoutes = require('./auth.routes');
const menuRoutes = require('./menu.routes');
const ordersRoutes = require('./orders.routes');
const paymentsRoutes = require('./payments.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/menus', menuRoutes);
router.use('/orders', ordersRoutes);
router.use('/payments', paymentsRoutes);

module.exports = router;
