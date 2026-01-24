const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

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
 * Extract public ID from Cloudinary URL reliably
 */
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const folderIndex = parts.indexOf("Rabbit");
  if (folderIndex === -1) return null;
  const publicIdWithExt = parts.slice(folderIndex).join("/");
  return publicIdWithExt.split(".")[0];
};

/**
 * Delete a single image by URL
 */
const deleteFromCloudinary = async (url) => {
  const publicId = getPublicIdFromUrl(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err);
  }
};

/**
 * Delete multiple images by URLs
 */
const deleteMultipleFromCloudinary = async (urls = []) => {
  await Promise.all(urls.map((url) => deleteFromCloudinary(url)));
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  getPublicIdFromUrl,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
};
