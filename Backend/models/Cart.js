const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    sku: {
      type: String,
      default: "",
    },

    brand: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    warranty: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [cartItemSchema],

    orderMode: {
      type: String,
      enum: ["Direct Purchase", "Request Quote"],
      default: "Direct Purchase",
    },

    deliveryNote: {
      type: String,
      default: "",
      trim: true,
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    gst: {
      type: Number,
      default: 0,
    },

    deliveryCharge: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "ordered", "abandoned"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);