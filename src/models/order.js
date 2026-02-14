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

// ================= SHIPMENT (MOST IMPORTANT PART) =================
const shipmentSchema = new mongoose.Schema(
  {
    customer: customerSchema,
    delivery: deliverySchema,
    products: [orderItemSchema],
    shipmentTotal: { type: Number },
    payment: {
      method: { type: String, required: true },
      status: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered", "Canceled"],
        default: "Pending",
      },
      transactionId: String,
    },
    status: {
      type: String,
      default: "Pending", // Pending, Confirmed, Shipped, Delivered
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

    totalPrice: { type: Number, default: 0 }, // sum of all shipment totals

    orderStatus: {
      type: String,
      default: "Pending", // overall order status
    },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
module.exports = Order;
