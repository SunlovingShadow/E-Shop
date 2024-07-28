// controllers/payment.controller.js

const paypal = require('@paypal/checkout-server-sdk');
const Order = require('../models/order.model');
const User = require('../models/user.model');

const clientId = "AUqrNtTocvjV7j2u9Trny79i2Id6J4bL5xeAVw8JIB22Oopnxrjr7h5o5JOCKbg5xsPhmKjxShxEh_Xe";
const clientSecret = "EHZkLHiSUMXru1U8GzegbeuqFAR6g_8Ta9woagx58a_wsP9p1t4BE0PipZa_N85wg7S8xB8frABmn0Zr";

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

exports.createOrder = async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: req.body.amount // Use the actual amount from the request body
      }
    }]
  });

  try {
    const order = await client.execute(request);
    res.status(200).json({
      id: order.result.id
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.captureOrder = async (req, res) => {
  const orderId = req.body.orderId;
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const capture = await client.execute(request);
    
    // Create order in your system
    const cart = req.session.cart;
    const userId = res.locals.uid;

    if (!cart || !userId) {
      throw new Error('Cart or user information missing');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const order = new Order(cart, user);
    order.status = 'success';  // Set the status to success
    await order.save();

    // Clear the cart
    req.session.cart = { items: [], totalQuantity: 0, totalPrice: 0 };

    res.status(200).json({
      capture: capture.result,
      orderId: order.id
    });
  } catch (error) {
    console.error('Error capturing PayPal order or creating system order:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

// New function to handle successful payment and order creation
exports.handleSuccessfulPayment = async (req, res, next) => {
  try {
    const transactionId = req.query.transaction_id;
    if (!transactionId) {
      throw new Error('Transaction ID is missing');
    }

    // At this point, the order should already be created in the captureOrder function
    // We just need to redirect to the orders page

    res.redirect('/orders');
  } catch (error) {
    console.error('Error in handleSuccessfulPayment:', error);
    next(error);
  }
};