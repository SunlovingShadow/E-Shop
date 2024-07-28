const express = require('express');
const cartController = require('../controllers/cart.controller');
const orderController = require('../controllers/orders.controller');

const router = express.Router();

router.get('/', cartController.getCart); 
router.post('/items', cartController.addCartItem); 
router.patch('/items', cartController.updateCartItem);

// New success route
// router.get('/success', async (req, res, next) => {
//   try {
//     const transactionId = req.query.transaction_id;
//     if (!transactionId) {
//       throw new Error('Transaction ID is missing');
//     }

//     // Create the order
//     await orderController.addOrder(req, res, next);

//     // Clear the cart
//     if (req.session && req.session.cart) {
//       req.session.cart = { items: [], totalQuantity: 0, totalPrice: 0 };
//     }

//     // Redirect to orders page instead of rendering success
//     res.redirect('/orders');
//   } catch (error) {
//     console.error('Error in /cart/success route:', error);
//     next(error);
//   }
// });

module.exports = router;
