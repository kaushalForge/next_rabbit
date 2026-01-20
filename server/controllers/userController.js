const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/GenerateToken");

module.exports.userRegisterController = async (req, res) => {
  let { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(404).send("All field are required");
    }
    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists with this account");
    }

    // const validRoles = ["admin", "customer"];
    // if (!validRoles.includes(role)) {
    //   return res.status(400).send("Role must be valid");
    // }

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
        const authorization = generateToken({ email, role });
        res.status(201).json({ user: createdUser, token: authorization });
      }
    } catch (error) {
      return res.status(500).send("Error creating account");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports.userLoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "E-mail or Password do not match!",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "E-mail or Password do not match!",
      });
    }

    // 🔐 Generate token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // // 🍪 Set cookie
    // res.cookie("cUser", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   path: "/",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.cookie("cUser", token, {
      httpOnly: true,
      secure: true, // MUST be true on Vercel
      sameSite: "none", // REQUIRED for cross-site cookies
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = user.toObject();

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred",
      error: error.message,
    });
  }
};

module.exports.userProfileController = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("Error occured");
    return res.status(500).send("Error fetching profile:", error);
  }
};
