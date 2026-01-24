const productModel = require("../models/product");
const {
  uploadMultipleToCloudinary,
  deleteMultipleFromCloudinary,
} = require("../lib/cloudinary");
const cloudinary = require("../lib/cloudinary");

module.exports.createProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      originalPrice,
      price,
      color,
      size,
      material,
      brand,
      gender,
      tags,
      dimension,
      isPublished,
      isFeatured,
      weight,
      category,
    } = req.body;

    console.log(
      name,
      description,
      originalPrice,
      price,
      color,
      size,
      material,
      brand,
      gender,
      tags,
      dimension,
      isPublished,
      isFeatured,
      weight,
      category,
      "description",
    );
    // ---------------- MANDATORY FIELDS ----------------
    if (
      !name ||
      !description ||
      !originalPrice ||
      !price ||
      isFeatured === undefined ||
      isPublished === undefined
    ) {
      return res.status(400).json({
        message: "Missing * Fields!",
      });
    }

    // ---------------- DUPLICATE CHECK ----------------
    const isProductExist = await productModel.findOne({ name });
    if (isProductExist) {
      return res.status(400).json({
        message: "Product with this name already exists",
      });
    }

    // ---------------- HANDLE IMAGES ----------------
    let imageBuffers = [];

    if (req.files) {
      if (Array.isArray(req.files)) {
        for (const file of req.files) {
          if (file.buffer) imageBuffers.push(file.buffer);
        }
      } else if (typeof req.files === "object") {
        for (const key in req.files) {
          if (req.files[key][0]?.buffer)
            imageBuffers.push(req.files[key][0].buffer);
        }
      }
    }

    // ---------------- UPLOAD IMAGES ----------------
    let uploadedUrls = [];
    if (imageBuffers.length > 0) {
      uploadedUrls = await uploadMultipleToCloudinary(imageBuffers, "Rabbit");
    }

    // Convert to objects with url + altText
    const images = uploadedUrls.map((url) => ({
      url,
      altText: name || "Product Image",
    }));

    // ---------------- CREATE PRODUCT ----------------
    const createdProduct = await productModel.create({
      name,
      description,
      originalPrice,
      price,
      color: color || [],
      size: size || [],
      material: material || [],
      brand: brand || "",
      gender: gender || "",
      tags: tags || [],
      dimension: dimension || {},
      isPublished,
      isFeatured,
      weight: weight || "",
      category: category || "",
      images, // Array of {url, altText}
      user: req.user._id,
    });

    return res.status(201).json({
      message: `Product successfully created by admin ${req.user.name}`,
      createdProduct,
    });
  } catch (error) {
    console.error("Error in createProductController:", error);

    // Generic failure response
    return res.status(500).json({
      message: "An error occurred while creating the product",
      error: error.message,
    });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const {
      existingImages = [], // URLs frontend wants to keep
      ...restFields // other fields from body
    } = req.body;

    const product = await productModel.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found!" });

    // ---------------- HANDLE IMAGE REMOVAL ----------------
    const imagesToDelete = product.images
      .filter((img) => !existingImages.includes(img.url))
      .map((img) => img.url);

    if (imagesToDelete.length > 0) {
      await deleteMultipleFromCloudinary(imagesToDelete); // parallel deletion
    }

    // ---------------- HANDLE NEW IMAGES ----------------
    let imageBuffers = [];
    if (req.files) {
      if (Array.isArray(req.files)) {
        req.files.forEach(
          (file) => file.buffer && imageBuffers.push(file.buffer),
        );
      } else {
        Object.values(req.files).forEach((arr) => {
          if (arr[0]?.buffer) imageBuffers.push(arr[0].buffer);
        });
      }
    }

    let uploadedUrls = [];
    if (imageBuffers.length > 0) {
      uploadedUrls = await Promise.all(
        imageBuffers.map((buffer) =>
          uploadMultipleToCloudinary([buffer], "Rabbit"),
        ),
      );
      uploadedUrls = uploadedUrls.flat();
    }

    // ---------------- FINAL IMAGES ----------------
    const finalImages = [
      ...product.images.filter((img) => existingImages.includes(img.url)),
      ...uploadedUrls.map((url) => ({
        url,
        altText: restFields.name || "Product Image",
      })),
    ].slice(0, 6);

    // ---------------- BUILD UPDATE OBJECT ----------------
    const updateData = {};

    // Add only changed fields from request body
    Object.keys(restFields).forEach((key) => {
      if (restFields[key] !== undefined) {
        updateData[key] = restFields[key];
      }
    });

    // Always update images
    updateData.images = finalImages;

    // ---------------- UPDATE PRODUCT ----------------
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    return res.status(200).json({
      message: "Product successfully updated",
      updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    // Find the product first
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    // Delete images from Cloudinary if any
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          // make sure we have public_id stored
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    // Delete the product from DB
    const deleteProduct = await productModel.deleteOne({ _id: id });

    return res.status(201).json({ message: "Product Deleted", deleteProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error });
  }
};
