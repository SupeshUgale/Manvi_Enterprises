const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/auth");

router
  .route("/")
  .post(createOrder)
  .get(protect, admin, getAllOrders);

router.get("/my-orders", protect, getUserOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
