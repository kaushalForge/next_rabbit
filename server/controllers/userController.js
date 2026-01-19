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
  let { email, password, role } = req.body;
  try {
    if (!email || !password) {
      return res.status(404).send("All fields are required");
    }
    const isUserExists = await userModel.findOne({ email });
    if (isUserExists) {
      const isPasswordMatched = await bcrypt.compare(
        password,
        isUserExists.password
      );
      if (isPasswordMatched) {
        const token = generateToken({ email, role });
        res.status(200).json({ user: isUserExists, token: token });
      } else {
        return res.status(404).send("E-mail or Password do not matched!");
      }
    } else {
      return res.status(404).send("E-mail or Password do not matched!");
    }
  } catch (error) {
    return res.status(500).json({ message: "Error occurred", error });
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
