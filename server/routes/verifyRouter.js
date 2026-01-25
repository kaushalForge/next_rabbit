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

    // ✅ Verify token
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
  try {
    const token = req.cookies?.cUser;

    if (!token) {
      return res.status(401).json({
        message: "User not logged in",
        isLoggedIn: false,
      });
    }

    return res
      .status(200)
      .clearCookie("cUser", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      })
      .json({
        message: "Logged out!",
        isLoggedIn: false,
      });
  } catch (err) {
    console.error("Logout error:", err.message);
    return res.status(500).json({
      message: "Logout failed",
      isLoggedIn: false,
    });
  }
});

module.exports = router;
