const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', menuController.list);
router.post('/', adminMiddleware, menuController.create);
router.post('/seed', adminMiddleware, menuController.seed);
router.get('/:id', menuController.get);
router.put('/:id', adminMiddleware, menuController.update);
router.delete('/:id', adminMiddleware, menuController.remove);

module.exports = router;
