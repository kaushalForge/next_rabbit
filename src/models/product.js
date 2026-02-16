const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    name: {
      type: String,
      trim: true,
      index: true,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    bulletKeyValueDescription: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],

    bulletDescription: [
      {
        type: String,
      },
    ],

    brand: {
      type: String,
    },

    mainCategory: {
      type: String,
      enum: ["Food", "Fashion"],
      required: true,
      index: true,
    },

    category: {
      type: String,
      index: true,
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

    dimensions: {
      length: String,
      breadth: String,
      height: String,
    },

    material: {
      type: String,
    },

    countryOfOrigin: {
      type: String,
    },

    fashion: [
      {
        color: [
          {
            type: String,
            required: true,
          },
        ],

        size: [
          {
            type: String,
            required: true,
          },
        ],

        price: {
          type: Number,
          required: true,
        },

        offerPrice: {
          type: Number,
        },

        stock: {
          type: Number,
        },

        sku: {
          type: String,
        },

        gender: {
          type: String,
        },
      },
    ],

    food: [
      {
        sku: {
          type: String,
        },

        foodType: {
          type: String,
        },

        weight: [
          {
            type: String,
          },
        ],

        taste: {
          type: String,
        },

        price: {
          type: Number,
          required: true,
        },

        offerPrice: {
          type: Number,
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
