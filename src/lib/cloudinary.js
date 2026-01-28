// src/lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ---------------- UPLOAD ----------------
export const uploadToCloudinary = async (oldPublicId, buffer, folder) => {
  try {
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }
    const dataUri = `data:image/jpeg;base64,${buffer.toString("base64")}`;
    const uploadResult = await cloudinary.uploader.upload(dataUri, { folder });
    return uploadResult;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};

export const uploadMultipleToCloudinary = async (buffers, folder) => {
  try {
    const uploaded = await Promise.all(
      buffers.map((buffer) => {
        const dataUri = `data:image/jpeg;base64,${buffer.toString("base64")}`;
        return cloudinary.uploader.upload(dataUri, { folder });
      }),
    );

    // Return only the URLs
    return uploaded.map((item) => item.secure_url);
  } catch (err) {
    console.error("Cloudinary multiple upload error:", err);
    throw err;
  }
};

// ---------------- DELETE HELPER  ----------------
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const folderIndex = parts.indexOf("Rabbit");
  if (folderIndex === -1) return null;
  const publicIdWithExt = parts.slice(folderIndex).join("/");
  return publicIdWithExt.split(".")[0];
};

// ---------------- DELETE  ----------------
export const deleteFromCloudinary = async (url) => {
  const publicId = getPublicIdFromUrl(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err);
  }
};

export const deleteMultipleFromCloudinary = async (urls = []) => {
  await Promise.all(urls.map((url) => deleteFromCloudinary(url)));
};
