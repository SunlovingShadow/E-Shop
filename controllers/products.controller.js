const Product = require('../models/product.model');

async function getAllProducts(req, res, next) {
  try {
    let products;
    if (req.query.sort === 'price-desc') {
      products = await Product.findAllSortedByPriceDescending();
    } else if (req.query.sort === 'price-asc') {
      products = await Product.findAllSortedByPriceAscending();
    } else if (req.query.search) {
      products = await Product.searchProducts(req.query.search);
    } else {
      products = await Product.findAll();
    }
    res.render('customer/products/all-products', {
      products: products,
      user: req.user // assuming req.user contains user information
    });
  } catch (error) {
    next(error);
  }
}

async function getProductDetails(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render('customer/products/product-details', { product: product });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts: getAllProducts,
  getProductDetails: getProductDetails
};
