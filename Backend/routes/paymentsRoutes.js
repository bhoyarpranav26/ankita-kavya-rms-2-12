const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

router.post('/create', paymentsController.createPayment);
router.post('/webhook', paymentsController.webhook);

module.exports = router;
