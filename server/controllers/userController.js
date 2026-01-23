const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/GenerateToken");

module.exports.userRegisterController = async (req, res) => {
  let { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(404).json({ message: "All field are required" });
    }
    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this account" });
    }

    try {
      let saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const hashedPassword = await bcrypt.hash(password, salt);
      const createdUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
        role,
      });
      if (createdUser) {
        res
          .status(201)
          .json({ message: "Account Created!", user: createdUser });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error creating account" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports.userLoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    /* ---------------- Validation ---------------- */
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!email.endsWith("@gmail.com")) {
      return res
        .status(401)
        .json({ message: "Please use your Gmail account!" });
    }

    /* ---------------- User lookup ---------------- */
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Email or password do not match!" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res
        .status(401)
        .json({ message: "Email or password do not match!" });
    }

    /* ---------------- Role-based token expiry ---------------- */
    let tokenExpiry;
    switch (user.role) {
      case "admin":
        tokenExpiry = "12h";
        break;
      case "moderator":
        tokenExpiry = "24h";
        break;
      case "customer":
        tokenExpiry = "48h";
        break;
      default:
        tokenExpiry = "48h"; // fallback
    }

    const token = generateToken(user._id, tokenExpiry);

    /* ---------------- Privilege check ---------------- */
    const isPrivileged = user.role === "admin" || user.role === "moderator";

    /* ---------------- Cookie config ---------------- */
    const expiryMsMap = {
      "12h": 12 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "48h": 48 * 60 * 60 * 1000,
    };

    const cookieOptions = {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: isPrivileged ? "strict" : "lax",
      path: "/",
      maxAge: expiryMsMap[tokenExpiry] || 48 * 60 * 60 * 1000, // default to 48h
    };

    /* ---------------- Safe user object ---------------- */
    const { password: _, ...safeUser } = user.toObject();

    /* ---------------- Response ---------------- */
    res.status(200).cookie("cUser", token, cookieOptions).json({
      message: "Login successful",
      user: safeUser,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.userProfileController = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("Error occured");
    return res.status(500).json({ message: "Error fetching profile:" }, error);
  }
};
