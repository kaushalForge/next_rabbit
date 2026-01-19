const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

// Checks if the user have token or not for login info (The user may be customer or admin)
module.exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    try {
      token = req.headers.authorization.trim();
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
      const decoded = jwt.decode(token);
      // It is used to get the payload data only like the data assign with the token creation email and role in this case
      if (!decoded || !decoded.email) {
        return res.status(401).json({ message: "Invalid token structure" });
      }
      req.user = await userModel
        .findOne({ email: decoded.email })
        .select("-password");
      // Here the main purpose of .select("-password") is to exclude the password field which should not be come to output even though it is hashed i will basically get the user details from "user" variable but after -password i will get all the fields excluing the password

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Checks if the user is admin or not if not admin then throws warning message
module.exports.admin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "User not authorized as admin" });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error", error);
  }
};
