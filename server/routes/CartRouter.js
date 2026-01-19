const express = require("express");
const cartModel = require("../models/cart");
const userModel = require("../models/user");
const productModel = require("../models/product");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Helper function to get a cart created by either userId or guestId
const getCart = async (userId, guestId) => {
  if (userId) {
    return await cartModel.findOne({ user: userId });
  } else if (guestId) {
    return await cartModel.findOne({ guestId });
  } else {
    return null;
  }
};

router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Pull the cart data from database if the userId or guestId have already one to just push the new cartItems in the existing database instead of creating a new one
    let cart = await getCart(userId, guestId);

    // Checks if the cart exists for any user or guest already and if then update that instead of creating new
    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );
      //  Checks if the product exists already
      // -1 is only returned when the product is not found
      // But when the same items is found -1 is not returned (cause something is found) so its quantity only gets updated
      // If found it updates the quantity
      if (productIndex > -1) {
        // Here when the product with same data is found the findIndex js method will return the exact index of that item from cartItemSchema ultimately in the productIndex variable from which quantity can be easily updated
        cart.products[productIndex].quantity += quantity;
      }
      // If the different property item is added like different size or color then create another cartItem
      else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      const newCart = await cartModel.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error });
  }
});

router.put("/", async (req, res) => {
  const { productId, quantity, size, color, userId, guestId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      // update the quantity is its greater then 0
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      }
      // remove the cart product if the quantity is less than 0
      else {
        cart.products.splice(productIndex, 1); // Remove the the index productIndex and 1 indicated remove only one item ultimately the given index
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error });
  }
});

router.delete("/", async (req, res) => {
  const { productId, size, color, userId, guestId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
    }
    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const { userId, guestId } = req.query;
    let cart = await getCart(userId, guestId);
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ messagge: "Cart not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error });
  }
});

// @route POST /api/cart/merge cv
// @desc Merge guest cart into the user on login
// @access Private

router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;

  try {
    const guestCart = await cartModel.findOne({ guestId });
    // Yes I have the guest cart i.e guest cart contains some products inside it
    const userCart = await cartModel.findOne({ user: req.user._id });
    // Currently I dont have any userCart in database

    if (guestCart) {
      if (guestCart.products.length === 0) {
        res.status(400).json({ message: "Guest cart is empty!" });
      }

      if (userCart) {
        // Merge guest cart into user cart
        // This is the case if the user had already created a userCart but added the cart items from guest accound and logs in later
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );
          if (productIndex > -1) {
            userCart.products[productIndex].quantity = guestItem.quantity;
          } else {
            userCart.products.push(guestItem);
          }
        });
        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        await userCart.save();

        // Remove the guest cart after merging
        try {
          await cartModel.findOneAndDelete({ guestId });
        } catch (err) {
          console.log("Error deleting guest cart", err);
        }
        res.status(200).json(userCart);
      } else {
        // If the user dont have existing cart
        // This is the case where the user is attempting to merge the guest to user cart for while not having anything in usercart or logged in cart
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();
        res.status(200).json(guestCart);
      }
    } else {
      if (userCart) {
        return res.status(200).json(userCart);
      }
      res.status(404).json({ message: "Guest cart not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
