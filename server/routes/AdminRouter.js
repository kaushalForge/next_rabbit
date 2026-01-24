const express = require("express");
const cartModel = require("../models/cart");
const userModel = require("../models/user");
const productModel = require("../models/product");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  createProductController,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { upload } = require("../lib/multer");

// All Products
router.get("/products/all", async (req, res) => {
  try {
    const allProducts = await productModel.find();
    if (!allProducts || allProducts.length === 0) {
      // No products found → send message only
      return res.status(404).json({ message: "No products found" });
    }

    // Products found → send products array
    return res.status(200).json(allProducts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Add product
router.post(
  "/products/add",
  protect,
  admin,
  upload.array("images", 6),
  createProductController,
);

// Update Product
router.put(
  "/products/update/:id",
  protect,
  admin,
  upload.array("images", 6),
  updateProduct,
);

// Delete Product
router.delete("/products/delete/:id", protect, admin, deleteProduct);

// All Users
router.get("/users/all", protect, admin, async (req, res) => {
  try {
    const allUsers = await userModel.find();
    if (allUsers) {
      res.status(201).json(allUsers);
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update User
router.put("/users/update-role", protect, admin, async (req, res) => {
  const { userId, role } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role || "customer";
    await user.save();

    return res.status(201).json({
      message: "User role updated successfully",
      newRole: user.role,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// Delete User
router.delete("/users/delete/:id", protect, admin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findOneAndDelete({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(201).json({ message: "User removed successfully!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
