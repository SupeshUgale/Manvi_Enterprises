const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");

// Temporary storage for unverified users
const pendingUsers = new Map();

// ======================================
// Register User - Generate & Send OTP
// POST /api/auth/register
// ======================================
const register = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const { name, email, password, phone, mobile, address } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const userEmail = email.toLowerCase();

    const existingUser = await User.findOne({
      email: userEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const otp = generateOTP();

    pendingUsers.set(userEmail, {
      name,

      email: userEmail,

      password,

      phone: phone || "",

      mobile: mobile || "",

      address: address || "",

      otp,

      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    await sendEmail({
      email: userEmail,

      subject: "Manvi Enterprises Registration OTP",

      message: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    res.status(200).json({
      success: true,

      message: "OTP sent successfully.",

      email: userEmail,
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,

      message: error.message,
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

    const userEmail = email.toLowerCase();

    const pendingUser = pendingUsers.get(userEmail);

    if (!pendingUser) {
      return res.status(400).json({
        success: false,

        message: "OTP session expired. Register again.",
      });
    }

    if (pendingUser.otp !== otp || pendingUser.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,

        message: "Invalid or expired OTP.",
      });
    }

    const hashedPassword = await bcrypt.hash(pendingUser.password, 10);

    const user = await User.create({
      name: pendingUser.name,

      email: pendingUser.email,

      password: hashedPassword,

      phone: pendingUser.phone,

      mobile: pendingUser.mobile,

      address: pendingUser.address,
    });

    pendingUsers.delete(userEmail);

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,

      message: "Registration successful.",

      token,

      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        phone: user.phone,

        mobile: user.mobile,

        address: user.address,

        role: user.role,
      },
    });
  } catch (error) {
    console.log("VERIFY OTP ERROR:", error);

    res.status(500).json({
      success: false,

      message: error.message,
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

        message: "Email is required.",
      });
    }

    const userEmail = email.toLowerCase();

    const pendingUser = pendingUsers.get(userEmail);

    if (!pendingUser) {
      return res.status(404).json({
        success: false,

        message: "Registration not found.",
      });
    }

    const otp = generateOTP();

    pendingUser.otp = otp;

    pendingUser.otpExpires = Date.now() + 10 * 60 * 1000;

    await sendEmail({
      email: userEmail,

      subject: "Manvi Enterprises New OTP",

      message: `Your new OTP is ${otp}. Valid for 10 minutes.`,
    });

    res.status(200).json({
      success: true,

      message: "OTP resent successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
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

        message: "Email and password required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,

        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.matchPassword(password);

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

        name: user.name,

        email: user.email,

        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
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
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================================
// Logout
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

  verifyOtp,

  resendOtp,

  login,

  getCurrentUser,

  logout,
};
