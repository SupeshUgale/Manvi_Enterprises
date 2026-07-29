const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const generateOTP = require("../utils/generateOTP");
const {
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} = require("../services/emailService");
const bcrypt = require("bcryptjs");

// Temporary storage for unverified registration sessions & password resets
const pendingUsers = new Map();
const passwordResetSessions = new Map();

// ======================================
// Register User - Generate & Send OTP
// POST /api/auth/register
// ======================================
const register = async (req, res) => {
  try {
    const { name, email, password, phone, mobile, address } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const userEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered. Please login.",
      });
    }

    const otp = generateOTP();

    pendingUsers.set(userEmail, {
      name,
      email: userEmail,
      password,
      phone: phone || mobile || "",
      mobile: mobile || phone || "",
      address: address || "",
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    try {
      await User.create({
        name,
        email: userEmail,
        password,
        phone: phone || mobile || "",
        mobile: mobile || phone || "",
        address: address || "",
      });
    } catch (dbError) {
      if (dbError?.code !== 11000) {
        throw dbError;
      }
    }

    try {
      await sendOtpEmail(userEmail, otp, name);
    } catch (emailError) {
      console.warn("OTP email failed, continuing with registration flow:", emailError.message);
    }

    res.status(200).json({
      success: true,
      message: "Verification OTP sent to your email.",
      email: userEmail,
      otp,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Registration failed.",
    });
  }
};

// ======================================
// Send OTP (Direct / Standalone)
// POST /api/auth/send-otp
// ======================================
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const userEmail = email.toLowerCase().trim();
    const otp = generateOTP();

    let pendingUser = pendingUsers.get(userEmail);
    if (!pendingUser) {
      pendingUser = {
        email: userEmail,
        name: "User",
      };
    }

    pendingUser.otp = otp;
    pendingUser.otpExpires = Date.now() + 10 * 60 * 1000;
    pendingUsers.set(userEmail, pendingUser);

    await sendOtpEmail(userEmail, otp, pendingUser.name || "User");

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email.",
      email: userEmail,
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send OTP.",
    });
  }
};

// ======================================
// Verify OTP & Create User
// POST /api/auth/verify-otp
// ======================================
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const userEmail = email.toLowerCase().trim();
    const pendingUser = pendingUsers.get(userEmail);

    if (!pendingUser) {
      return res.status(400).json({
        success: false,
        message: "OTP session expired or not found. Please register again.",
      });
    }

    if (pendingUser.otp !== String(otp).trim() || pendingUser.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code.",
      });
    }

    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = await User.create({
        name: pendingUser.name || "Customer",
        email: pendingUser.email,
        password: pendingUser.password || "User@123",
        phone: pendingUser.phone || "",
        mobile: pendingUser.mobile || "",
        address: pendingUser.address || "",
      });

      sendWelcomeEmail(user.email, user.name).catch((err) =>
        console.error("Welcome email error:", err.message)
      );
    }

    pendingUsers.delete(userEmail);

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Authentication successful.",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        mobile: user.mobile,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "OTP verification failed.",
    });
  }
};

// ======================================
// Resend OTP
// POST /api/auth/resend-otp
// ======================================
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const userEmail = email.toLowerCase().trim();
    const pendingUser = pendingUsers.get(userEmail);

    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: "Registration session not found. Please register again.",
      });
    }

    const otp = generateOTP();
    pendingUser.otp = otp;
    pendingUser.otpExpires = Date.now() + 10 * 60 * 1000;
    pendingUsers.set(userEmail, pendingUser);

    await sendOtpEmail(userEmail, otp, pendingUser.name || "User");

    res.status(200).json({
      success: true,
      message: "New OTP sent successfully to your email.",
    });
  } catch (error) {
    console.error("RESEND OTP ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to resend OTP.",
    });
  }
};

// ======================================
// Login User
// POST /api/auth/login
// ======================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    let isMatch = false;
    try {
      isMatch = await user.matchPassword(password);
    } catch (passwordError) {
      console.error("PASSWORD COMPARISON ERROR:", passwordError);
      isMatch = false;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        mobile: user.mobile,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Login failed.",
    });
  }
};

// ======================================
// Forgot Password - Send Reset OTP
// POST /api/auth/forgot-password
// ======================================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const userEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist.",
      });
    }

    const otp = generateOTP();
    passwordResetSessions.set(userEmail, {
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    await sendPasswordResetEmail(userEmail, otp, user.name);

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process forgot password request.",
    });
  }
};

// ======================================
// Reset Password with OTP
// POST /api/auth/reset-password
// ======================================
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body || {};

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required.",
      });
    }

    const userEmail = email.toLowerCase().trim();
    const resetSession = passwordResetSessions.get(userEmail);

    if (!resetSession) {
      return res.status(400).json({
        success: false,
        message: "Password reset session expired. Please try again.",
      });
    }

    if (resetSession.otp !== String(otp).trim() || resetSession.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code.",
      });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    passwordResetSessions.delete(userEmail);

    res.status(200).json({
      success: true,
      message: "Password reset successful. Please login with your new password.",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reset password.",
    });
  }
};

// ======================================
// Current User
// GET /api/auth/me
// ======================================
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      user,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user context.",
    });
  }
};

// ======================================
// Logout
// POST /api/auth/logout
// ======================================
const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};

module.exports = {
  register,
  sendOtp,
  verifyOtp,
  resendOtp,
  login,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logout,
};
