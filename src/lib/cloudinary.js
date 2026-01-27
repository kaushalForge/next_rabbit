import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadToCloudinary = async (oldPublicId, newFileUri, folder) => {
  try {
    // Delete old image if publicId provided
    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (err) {
        console.error("Failed to delete old image:", err);
      }
    }
    const uploadResult = await cloudinary.uploader.upload(newFileUri, {
      folder,
    });
    return uploadResult;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};
