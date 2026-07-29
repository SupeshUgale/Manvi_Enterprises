const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 10,
    },
    capacity: {
      type: String,
      required: true,
      default: "N/A",
    },
    warranty: {
      type: String,
      required: true,
      default: "12 Months",
    },
    price: {
      type: Number,
      required: true,
    },
    actualPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    badge: {
      type: String,
      default: "",
    },
    sku: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    features: [
      {
        type: String,
      },
    ],
    image: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);