const mongodb = require('mongodb');
const db = require('../data/database');
const cloudinary = require('../util/cloudinary');

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image; // This will now be the Cloudinary URL
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findById(productId) {
    let prodId;
    try {
      prodId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const product = await db.getDb().collection('products').findOne({ _id: prodId });

    if (!product) {
      const error = new Error('Could not find product with provided id.');
      error.code = 404;
      throw error;
    }

    return new Product(product);
  }

  static async findAll() {
    const products = await db.getDb().collection('products').find().toArray();
    return products.map(productDocument => new Product(productDocument));
  }

  static async findAllSortedByPriceDescending() {
    const products = await db.getDb().collection('products').find().sort({ price: -1 }).toArray();
    return products.map(productDocument => new Product(productDocument));
  }

  static async findAllSortedByPriceAscending() {
    const products = await db.getDb().collection('products').find().sort({ price: 1 }).toArray();
    return products.map(product => new Product(product));
  }

  static async searchProducts(query) {
    const products = await db.getDb().collection('products').find({ title: { $regex: query, $options: 'i' } }).toArray();
    return products.map(productDocument => new Product(productDocument));
  }

  static async findMultiple(ids) {
    const productIds = ids.map(id => new mongodb.ObjectId(id));
    const products = await db.getDb().collection('products').find({ _id: { $in: productIds } }).toArray();
    return products.map(productDocument => new Product(productDocument));
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };

    if (this.id) {
      const productId = new mongodb.ObjectId(this.id);

      if (!this.image) {
        delete productData.image;
      }

      await db.getDb().collection('products').updateOne(
        { _id: productId },
        { $set: productData }
      );
    } else {
      await db.getDb().collection('products').insertOne(productData);
    }
  }

  async replaceImage(newImagePath) {
    // Delete old image from Cloudinary if it exists
    if (this.image) {
      await this.deleteImageFromCloudinary(this.image);
    }

    this.image = newImagePath;
  }

  async remove() {
    const productId = new mongodb.ObjectId(this.id);
    
    // Delete image from Cloudinary if it exists
    if (this.image) {
      await this.deleteImageFromCloudinary(this.image);
    }

    return db.getDb().collection('products').deleteOne({ _id: productId });
  }

  async deleteImageFromCloudinary(imageUrl) {
    try {
      // Extract public_id from Cloudinary URL
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }
  }
}

module.exports = Product;