const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const userModel = require("../models/user");

const {
  userRegisterController,
  userLoginController,
  userProfileController,
} = require("../controllers/userController");
  
// @/users/api
// @desc fetch all the userAccounts
router.get("/api", protect, admin, async (req, res) => {
  try {
    const allUsers = await userModel.find().select("-password");
    if (allUsers) {
      res.status(200).json(allUsers);
    } else {
      re.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// @users/update-role/:id
// @update the user role
router.put("/update-role", protect, admin, async (req, res) => {
  const { userId, role } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    user.role = role || "customer";
    res.status(201).json(user);
    await user.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/delete", protect, admin, async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await userModel.findOneAndDelete({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/profile", protect, admin, userProfileController);
router.post("/register", userRegisterController);
router.post("/login", userLoginController);

module.exports = router;
