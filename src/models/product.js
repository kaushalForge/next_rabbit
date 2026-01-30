const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    bulletKeyValueDescription: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
        _id: false,
      },
    ],

    bulletDescription: [
      {
        type: String,
      },
    ],

    brand: {
      type: String,
      trim: true,
    },

    mainCategory: {
      type: String,
      enum: ["Food", "Fashion"],
      required: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
    },

    offerPrice: {
      type: Number,
    },

    stock: {
      type: Number,
      default: 0,
    },

    weight: {
      type: String,
    },

    images: {
      type: Array,
      required: true,
    },

    tags: [String],

    metaTitle: String,
    metaDescription: String,

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    countryOfOrigin: {
      type: String,
    },

    fashion: [
      {
        color: {
          type: String,
          required: true,
          trim: true,
        },

        size: {
          type: String,
          required: true,
          trim: true,
        },

        stock: {
          type: Number,
          required: true,
          min: 0,
        },

        sku: {
          type: String,
          // unique: true,
        },
      },
    ],

    food: [
      {
        sku: {
          type: String,
          // unique: true,
        },

        foodType: {
          type: String, // Veg, Non-veg, Vegan
        },

        taste: {
          type: String,
        },

        batchNumber: String,

        stock: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true },
);

const Product =
  mongoose.models.product || mongoose.model("product", productSchema);

module.exports = Product;
