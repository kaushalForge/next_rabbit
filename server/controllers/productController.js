const productModel = require("../models/product");
const { uploadMultipleToCloudinary } = require("../lib/cloudinary");

/**
 * Create Product Controller
 * Handles 0-6 images uploaded via multer
 */
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
        // multer.array() -> array of files
        for (const file of req.files) {
          if (file.buffer) imageBuffers.push(file.buffer);
        }
      } else if (typeof req.files === "object") {
        // multer.fields() -> object of arrays
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
      dimensions,
      isPublished,
      stock,
      isFeatured,
      weight,
      category,
      images,

      // ✅ META
      metaTitle,
      metaDescription,
      metaKeywords,
    } = req.body;

    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        /* ---------------- BASIC ---------------- */
        name: name ?? product.name,
        description: description ?? product.description,
        originalPrice: originalPrice ?? product.originalPrice,
        price: price ?? product.price,
        stock: stock ?? product.stock,

        /* ---------------- ARRAYS ---------------- */
        color: color ?? product.color,
        size: size ?? product.size,
        tags: tags ?? product.tags,
        material: material ?? product.material,
        brand: brand ?? product.brand,

        /* ---------------- SELECT ---------------- */
        gender: gender ?? product.gender,
        category: category ?? product.category,

        /* ---------------- META ---------------- */
        metaTitle: metaTitle ?? product.metaTitle,
        metaDescription: metaDescription ?? product.metaDescription,
        metaKeywords: metaKeywords ?? product.metaKeywords,

        /* ---------------- DIMENSIONS ---------------- */
        dimensions: dimensions ?? product.dimensions,

        /* ---------------- FLAGS ---------------- */
        isPublished:
          typeof isPublished === "boolean" ? isPublished : product.isPublished,

        isFeatured:
          typeof isFeatured === "boolean" ? isFeatured : product.isFeatured,

        /* ---------------- EXTRA ---------------- */
        weight: weight ?? product.weight,
        images: images ?? product.images,
      },
      { new: true },
    );

    return res.status(200).json({
      message: "Product successfully updated",
      updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteProduct = await productModel.deleteOne({ _id: id });
    if (deleteProduct) {
      res.status(201).json({ message: "Product Deleted", deleteProduct });
    } else {
      return res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error", error);
  }
};
