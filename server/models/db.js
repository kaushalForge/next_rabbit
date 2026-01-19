const mongoose = require("mongoose");

const URI = process.env.URI;

const databaseConnection = async () => {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB Connection successful for user-model");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = databaseConnection;
