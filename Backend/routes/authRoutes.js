const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyOtp,
  resendOtp,
  getCurrentUser,
  logout,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");

// Register user and send OTP
router.post("/register", register);

// Verify OTP and create user
router.post("/verify-otp", verifyOtp);

// Resend OTP
router.post("/resend-otp", resendOtp);

// Login user
router.post("/login", login);

// Get logged in user
router.get("/me", protect, getCurrentUser);

// Logout
router.post("/logout", logout);

module.exports = router;
