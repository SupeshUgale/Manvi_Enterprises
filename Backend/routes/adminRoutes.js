const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAdminUsers,
  updateUserRole,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/auth");

router.use(protect, admin); // Require admin authentication for all routes

router.get("/stats", getDashboardStats);
router.get("/users", getAdminUsers);
router.put("/user-role", updateUserRole);

module.exports = router;
