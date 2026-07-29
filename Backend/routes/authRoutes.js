const express = require("express");
const router = express.Router();

const {
  register,
  sendOtp,
  verifyOtp,
  resendOtp,
  login,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logout,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");

// Register user and send OTP
router.post("/register", register);

// Standalone Send OTP
router.post("/send-otp", sendOtp);

// Verify OTP and create/authenticate user
router.post("/verify-otp", verifyOtp);

// Resend OTP
router.post("/resend-otp", resendOtp);

// Login user
router.post("/login", login);

// Password Reset Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Get logged in user profile
router.get("/me", protect, getCurrentUser);

// Logout
router.post("/logout", logout);

module.exports = router;
