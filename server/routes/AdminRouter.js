const express = require("express");
const cartModel = require("../models/cart");
const userModel = require("../models/user");
const productModel = require("../models/product");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

router.put("/product/:id", protect, admin, async (req, res) => {
  const { id } = req.params;
  const productData = req.body;

  try {
    const updateProduct = await productModel.findOneAndUpdate(
      { _id: id },
      {
        name: productData.name,
        description: productData.description,
        originalPrice: productData.originalPrice,
        price: productData.price,
        images: productData.images,
        category: productData.category,
        stock: productData.stock,
        size: productData.size,
        color: productData.color,
        material: productData.material,
      }
    );
    await updateProduct.save();

    if (!updateProduct) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json({ message: "Product updated successfully!" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
