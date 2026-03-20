const { Router } = require('express');
const { getAllMenus, createMenu, updateMenu, deleteMenu } = require('../controllers/menu.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

router.get('/', getAllMenus);
router.post('/', authMiddleware, createMenu);
router.patch('/:id', authMiddleware, updateMenu);
router.delete('/:id', authMiddleware, deleteMenu);

module.exports = router;
