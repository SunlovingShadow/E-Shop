const Product = require('../models/product.model');

async function updateCartPrices(req, res, next) {
  if (!req.session.cart) {
    return next();
  }

  const cart = req.session.cart;

  try {
    console.log('Cart items before update:', cart.items);

    if (!Array.isArray(cart.items) || cart.items.length === 0) {
      console.log('Cart is empty or not an array');
      return next();
    }

    const productIds = cart.items.map(item => item.productId).filter(id => id);
    console.log('Product IDs to fetch:', productIds);

    if (productIds.length === 0) {
      console.log('No valid product IDs in cart');
      return next();
    }

    const products = await Product.findMultiple(productIds);
    console.log('Fetched products:', products);

    if (!Array.isArray(products) || products.length === 0) {
      console.log('No products found or products is not an array');
      return next();
    }

    const productMap = new Map(products.filter(p => p && p.id).map(p => [p.id, p]));
    console.log('Product map created:', Array.from(productMap.entries()));

    cart.items = cart.items.filter(item => {
      const product = productMap.get(item.productId);
      if (!product) {
        console.log(`Product not found for ID: ${item.productId}`);
        return false;
      }
      
      item.price = product.price;
      item.totalPrice = item.quantity * product.price;
      return true;
    });

    cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

    console.log('Updated cart:', cart);

    req.session.cart = cart;
    next();
  } catch (error) {
    console.error('Error in updateCartPrices middleware:', error);
    next(error);
  }
}

module.exports = updateCartPrices;