// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'homehave',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});
