// lib/cloudinary.js
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a single buffer to Cloudinary
 * @param {Buffer} buffer
 * @param {string} folder
 * @returns {Promise<string>} - secure URL
 */
const uploadToCloudinary = (buffer, folder = "Rabbit") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err) return reject(err);
        resolve(result?.secure_url || "");
      })
      .end(buffer);
  });
};

/**
 * Upload multiple buffers to Cloudinary (max 6 images)
 * @param {Buffer[]} buffers
 * @param {string} folder
 * @returns {Promise<string[]>} - array of secure URLs
 */
const uploadMultipleToCloudinary = async (buffers = [], folder = "Rabbit") => {
  const urls = [];
  for (const buffer of buffers.slice(0, 6)) {
    try {
      const url = await uploadToCloudinary(buffer, folder);
      if (url) urls.push(url);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
    }
  }
  return urls;
};

/**
 * Get Cloudinary public ID from image URL
 * @param {string} url
 * @returns {string|null} - public ID
 */
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const folderParts = parts.slice(parts.indexOf("Rabbit"));
  return folderParts.join("/").split(".")[0];
};

/**
 * Delete single image from Cloudinary by URL
 * @param {string} url
 */
const deleteFromCloudinary = async (url) => {
  const publicId = getPublicIdFromUrl(url);
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

/**
 * Delete multiple images from Cloudinary by URLs
 * @param {string[]} urls
 */
const deleteMultipleFromCloudinary = async (urls = []) => {
  for (const url of urls) {
    await deleteFromCloudinary(url);
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  getPublicIdFromUrl,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
};
