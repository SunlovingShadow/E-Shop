const Order = require('../models/order.model');
const User = require('../models/user.model');

async function getOrders(req, res, next) {
  try {
    const userId = res.locals.uid;
    console.log('Fetching orders for user:', userId);
    
    const orders = await Order.findAllForUser(userId);
    console.log('Orders fetched:', orders.length);

    res.render('customer/orders/all-orders', {
      orders: orders,
      pageTitle: 'Your Orders'
    });
  } catch (error) {
    console.error('Error in getOrders:', error);
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;
  const userId = res.locals.uid;

  try {
    console.log('Adding order for user:', userId);
    
    const userDocument = await User.findById(userId);
    if (!userDocument) {
      throw new Error('User not found');
    }

    const order = new Order(cart, userDocument);
    await order.save();

    console.log('Order added successfully:', order.id);

    req.session.cart = null;
    res.redirect('/orders');
  } catch (error) {
    console.error('Error in addOrder:', error);
    next(error);
  }
}

module.exports = {
  addOrder,
  getOrders,
};