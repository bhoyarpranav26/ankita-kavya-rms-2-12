const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, ordersController.createOrder);
router.get('/', authMiddleware, ordersController.listOrders);
router.get('/:id', authMiddleware, ordersController.getOrder);
router.put('/:id/status', authMiddleware, ordersController.updateStatus);

module.exports = router;
