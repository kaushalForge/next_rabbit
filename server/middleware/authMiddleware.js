const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

// Protect routes (user must be logged in)
// module.exports.protect = async (req, res, next) => {
//   try {
//     const token = req.headers?.authorization;
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized. Please login first.",
//       });
//     }

//     // ✅ Verify token (NOT decode)
//     const decoded = await jwt.verify(token, process.env.JWT_KEY);

//     if (!decoded?.email) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid authentication token.",
//       });
//     }

//     // 🔍 Find user
//     const user = await userModel
//       .findOne({ email: decoded.email })
//       .select("-password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User no longer exists.",
//       });
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     console.log(error);
//     return res.status(401).json({
//       success: false,
//       message: "Session expired or token invalid.",
//     });
//   }
// };

// const jwt = require("jsonwebtoken");
// const userModel = require("../models/user");

module.exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.cUser;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login first.",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (!decoded?.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // 🔍 Find user in database
    const user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    // ✅ Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Session expired or token invalid.",
    });
  }
};

// Admin-only access
module.exports.admin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization error.",
    });
  }
};
