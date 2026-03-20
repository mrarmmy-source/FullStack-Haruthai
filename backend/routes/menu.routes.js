const { Router } = require('express');
const { getAllMenus, getMenuById, createMenu, updateMenu, deleteMenu } = require('../controllers/menu.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

router.get('/', getAllMenus);
router.get('/:id', getMenuById);
router.post('/', authMiddleware, createMenu);
router.put('/:id', authMiddleware, updateMenu);
router.delete('/:id', authMiddleware, deleteMenu);

module.exports = router;
