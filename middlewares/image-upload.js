const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../util/cloudinary');
const uuid = require('uuid').v4;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'product-images',
    format: async (req, file) => 'png', // You can adjust this based on your needs
    public_id: (req, file) => uuid() + '-' + file.originalname,
  },
});

const upload = multer({ storage: storage });

const configuredMulterMiddleware = upload.single('image');

module.exports = configuredMulterMiddleware;