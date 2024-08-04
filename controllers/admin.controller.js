const Product = require('../models/product.model');
const Order = require('../models/order.model');
const cloudinary = require('../util/cloudinary');

async function getProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render('admin/products/all-products', { products: products, pageTitle: 'Manage Products' });
  } catch (error) {
    console.error('Error fetching products:', error);
    next(error);
  }
}

function getNewProduct(req, res) {
  res.render('admin/products/new-product', { pageTitle: 'Add New Product' });
}

async function createNewProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    image: req.file ? req.file.filename : null,
  });

  try {
    await product.save();
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error creating new product:', error);
    next(error);
  }
}

async function getUpdateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).render('shared/404');
    }
    res.render('admin/products/update-product', { product: product, pageTitle: 'Update Product' });
  } catch (error) {
    console.error('Error fetching product for update:', error);
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).render('shared/404');
    }

    product.title = req.body.title;
    product.summary = req.body.summary;
    product.price = req.body.price;
    product.description = req.body.description;

    if (req.file) {
      // If there's an existing image, you might want to delete it from Cloudinary
      if (product.image) {
        // You'll need to implement this function
        await deleteImageFromCloudinary(product.image);
      }
      product.image = req.file.path; // Update with new Cloudinary URL
    }

    await product.save();
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error updating product:', error);
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete image from Cloudinary if it exists
    if (product.image) {
      await deleteImageFromCloudinary(product.image);
    }
    
    await product.remove();
    res.json({ message: 'Deleted product successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
}

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    res.render('admin/orders/admin-orders', {
      orders: orders,
      pageTitle: 'Manage All Customer Orders'
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = newStatus;
    await order.save();

    res.json({ message: 'Order updated successfully', newStatus: newStatus, orderId: orderId });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
}

async function deleteImageFromCloudinary(imageUrl) {
  try {
    // Extract public_id from Cloudinary URL
    const publicId = imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
}

module.exports = {
  getProducts,
  getNewProduct,
  createNewProduct,
  getUpdateProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrder
};