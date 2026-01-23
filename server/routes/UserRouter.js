const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const userModel = require("../models/user");

const {
  userRegisterController,
  userLoginController,
  userProfileController,
} = require("../controllers/userController");

// router.get("/profile", protect, userProfileController);
// router.post("/register", userRegisterController);
// router.post("/login", userLoginController);

module.exports = router;
