require("dotenv").config();
const cloudinary = require("cloudinary").v2;

const createImageUpload = async () => {
  const timestamp = new Date().getTime();
  const params = {
    timestamp: timestamp,
  };
  const signature = await cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET
  );
  const key = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_NAME;
  return { timestamp, signature, key, cloudName };
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = { cloudinary, createImageUpload };
