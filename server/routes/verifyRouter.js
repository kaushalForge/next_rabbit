const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

// sends user data from cookie
router.get("/get-user", async (req, res) => {
  try {
    const token = req.cookies?.cUser;
    if (!token) {
      return res.status(401).json({
        isLoggedIn: false,
        message: "Login required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const email = decoded?.id?.email;
    const roleFromToken = decoded?.id?.role;

    if (!email) {
      return res.status(401).json({
        isLoggedIn: false,
        message: "Invalid token",
      });
    }

    // ✅ Optional DB check (recommended)
    const user = await userModel
      .findOne({ email })
      .select("_id name email role avatar");

    if (!user) {
      return res.status(404).json({
        isLoggedIn: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      isLoggedIn: true,
      message: "User authenticated!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      tokenRole: roleFromToken,
    });
  } catch (err) {
    console.error("JWT auth error:", err.message);
    return res.status(401).json({
      isLoggedIn: false,
      message: "Authentication failed",
    });
  }
});

// logout
router.post("/logout", (req, res) => {
  console.log("⚡ /logout route called");

  try {
    // Log cookies received in the request
    // console.log("Cookies received from frontend:", req.cookies);
    console.log(req.cookies.cUser);

    // Clear the cookie
    res.clearCookie("cUser", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    console.log("✅ cUser cookie cleared successfully");

    // Respond to frontend
    return res.status(200).json({
      message: "Logged out successfully",
      isLoggedIn: false, 
    });
  } catch (error) {
    console.error("❌ Error in logout route:", error);

    return res.status(400).json({
      message: "Error Logging out!",
      isLoggedIn: true,
    });
  }
});

module.exports = router;
