const express = require('express');
const ordersController = require('../controllers/orders.controller');
const protectRoutesMiddleware = require('../middlewares/protect-routes');

const router = express.Router();

router.get('/', protectRoutesMiddleware, ordersController.getOrders);

module.exports = router;