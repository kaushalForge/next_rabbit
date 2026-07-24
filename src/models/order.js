const mongoose = require("mongoose");

// ================= PRODUCT SNAPSHOT =================
const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    name: String,
    image: String,
    price: Number,
    offerPrice: Number,
    size: String,
    color: String,
    mainCategory: String,
    sku: String,
    gender: String,
    foodType: String,
    weight: String,
    taste: String,
    quantity: { type: Number, required: true },
  },
  { _id: false },
);

// ================= CUSTOMER SNAPSHOT =================
const customerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
  },
  { _id: false },
);

// ================= DELIVERY SNAPSHOT =================
const deliverySchema = new mongoose.Schema(
  {
    province: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    ward: String,
    landmark: String,
    notes: String,
  },
  { _id: false },
);

// ================= SHIPMENT =================
const shipmentSchema = new mongoose.Schema(
  {
    customer: customerSchema,
    delivery: deliverySchema,
    products: [orderItemSchema],
    shipmentTotal: { type: Number },
    payment: {
      method: {
        type: String,
        enum: ["COD", "Online", "Card", "eSewa", "Khalti"],
      },
      status: {
        type: String,
        enum: ["Pending", "Paid", "Failed", "Returned"],
        default: "Pending",
      },
      transactionId: String,
      screenshot: String,
      notes: String,
      verified: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    estimatedDelivery: Date,
  },
  { timestamps: true },
);

// ================= MAIN ORDER =================
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    shipments: [shipmentSchema],
    totalPrice: { type: Number, default: 0 },
    cancelledProducts: [],
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
module.exports = Order;
