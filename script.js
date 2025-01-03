const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name:'dxqrih3zq',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
  secure: true
})

cloudinary.uploader.upload