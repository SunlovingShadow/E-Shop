// routes/payment.routes.js
const express = require('express');
const paymentController = require('../controllers/payment.controller');
const router = express.Router();

router.post('/create-order', paymentController.createOrder);
router.post('/capture-order', paymentController.captureOrder);
router.get('/success', paymentController.handleSuccessfulPayment);

module.exports = router;