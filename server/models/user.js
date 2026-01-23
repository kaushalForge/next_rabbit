const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: function () {
        // Password is required only for manual registration
        return !this.googleId && !this.facebookId;
      },
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "moderator", "customer"],
      default: "customer",
    },
    avatar: {
      type: String, // URL of profile picture
      default: "",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows null values
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ["manual", "google", "facebook"],
      default: "manual",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
