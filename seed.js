require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./src/models/product"); // adjust path

const MONGO_URI = process.env.URI; // your MongoDB URI
const ADMIN_USER_ID = "69788218a867edc7dfbacc60";

const products = [
  {
    name: "Classic Black T-Shirt",
    description: "Premium cotton black t-shirt with breathable fabric.",
    brand: "UrbanWear",
    mainCategory: "Fashion",
    category: "T-Shirts",
    price: 799,
    offerPrice: 599,
    stock: 120,
    tags: ["tshirt", "men", "cotton"],
    isPublished: true,
    bulletDescription: ["100% Cotton", "Soft & breathable", "Perfect for daily wear"],
    bulletKeyValueDescription: [
      { key: "Fabric", value: "Cotton" },
      { key: "Fit", value: "Regular" },
    ],
    fashion: {
      color: ["Black"],
      size: ["S", "M", "L", "XL"],
      material: ["Cotton"],
      gender: "Men",
      dimensions: { length: "70cm", width: "50cm", height: "2cm" },
    },
    images: [
      {
        url: "https://source.unsplash.com/800x800/?black,tshirt",
        altText: "Classic Black T-Shirt",
      },
    ],
    user: ADMIN_USER_ID,
  },
  // Add more products here...
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    await Product.deleteMany({});
    console.log("Existing products cleared");

    await Product.insertMany(products);
    console.log("✅ Products seeded successfully");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seed();
