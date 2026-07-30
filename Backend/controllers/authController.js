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
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    let existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered. Please login.",
        });
      }
      // If user exists but is unverified, update details & new OTP
      existingUser.name = name;
      existingUser.password = password;
      existingUser.phone = phone || mobile || existingUser.phone || "";
      existingUser.mobile = mobile || phone || existingUser.mobile || "";
      existingUser.address = address || existingUser.address || "";
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      await existingUser.save();
    } else {
      // Create new unverified user
      await User.create({
        name,
        email: userEmail,
        password,
        phone: phone || mobile || "",
        mobile: mobile || phone || "",
        address: address || "",
        otp,
        otpExpires,
        isVerified: false,
      });
    }

    // Update in-memory session cache for fast lookup
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

    console.log(`🔑 [OTP SYSTEM] Generated Registration OTP for ${userEmail}: ${otp}`);

    // Await OTP email sending so serverless/cloud environments finish email dispatch
    try {
      await sendOtpEmail(userEmail, otp, name);
    } catch (emailError) {
      console.error("❌ Registration OTP email failed to send:", emailError.message);
      return res.status(500).json({
        success: false,
        message: `Failed to send verification OTP email: ${emailError.message}. Please verify SMTP settings in your environment variables.`,
      });
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
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.findOne({ email: userEmail });
    if (user) {
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    }

    let pendingUser = pendingUsers.get(userEmail) || { email: userEmail, name: user?.name || "User" };
    pendingUser.otp = otp;
    pendingUser.otpExpires = Date.now() + 10 * 60 * 1000;
    pendingUsers.set(userEmail, pendingUser);

    console.log(`🔑 [OTP SYSTEM] Generated Standalone OTP for ${userEmail}: ${otp}`);

    // Await OTP email sending to ensure execution completes in cloud environments
    try {
      await sendOtpEmail(userEmail, otp, user?.name || pendingUser.name || "User");
    } catch (emailError) {
      console.error("❌ Standalone OTP email failed to send:", emailError.message);
      return res.status(500).json({
        success: false,
        message: `Failed to send OTP email: ${emailError.message}. Please verify SMTP configuration.`,
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email.",
      email: userEmail,
      otp,
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
// Verify OTP & Create / Activate User
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
    const submittedOtp = String(otp).trim();
    let pendingUser = pendingUsers.get(userEmail);
    let user = await User.findOne({ email: userEmail });

    const isPendingValid = pendingUser && pendingUser.otp === submittedOtp && pendingUser.otpExpires >= Date.now();
    const isDbValid = user && user.otp === submittedOtp && user.otpExpires && new Date(user.otpExpires).getTime() >= Date.now();

    if (!isPendingValid && !isDbValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code.",
      });
    }

    if (!user && pendingUser) {
      user = await User.create({
        name: pendingUser.name || "Customer",
        email: pendingUser.email,
        password: pendingUser.password || "User@123",
        phone: pendingUser.phone || "",
        mobile: pendingUser.mobile || "",
        address: pendingUser.address || "",
        isVerified: true,
      });
    } else if (user) {
      user.isVerified = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();
    }

    sendWelcomeEmail(user.email, user.name).catch((err) =>
      console.error("Welcome email error:", err.message)
    );

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
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.findOne({ email: userEmail });
    if (user) {
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    }

    let pendingUser = pendingUsers.get(userEmail) || { email: userEmail, name: user?.name || "User" };
    pendingUser.otp = otp;
    pendingUser.otpExpires = Date.now() + 10 * 60 * 1000;
    pendingUsers.set(userEmail, pendingUser);

    console.log(`🔑 [OTP SYSTEM] Resent OTP for ${userEmail}: ${otp}`);

    // Await OTP email sending
    try {
      await sendOtpEmail(userEmail, otp, user?.name || pendingUser.name || "User");
    } catch (emailError) {
      console.error("❌ Resend OTP email failed to send:", emailError.message);
      return res.status(500).json({
        success: false,
        message: `Failed to resend OTP email: ${emailError.message}. Please try again later.`,
      });
    }

    res.status(200).json({
      success: true,
      message: "New OTP sent successfully to your email.",
      otp,
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
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to MongoDB User record so it survives serverless restarts & multi-instance deploys
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    passwordResetSessions.set(userEmail, {
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    console.log(`🔑 [OTP SYSTEM] Generated Password Reset OTP for ${userEmail}: ${otp}`);

    try {
      await sendPasswordResetEmail(userEmail, otp, user.name);
    } catch (emailError) {
      console.error("❌ Password reset email failed to send:", emailError.message);
      return res.status(500).json({
        success: false,
        message: `Failed to send password reset email: ${emailError.message}. Please verify SMTP settings.`,
      });
    }

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
    const submittedOtp = String(otp).trim();

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const resetSession = passwordResetSessions.get(userEmail);
    const isDbOtpValid = user.otp && user.otp === submittedOtp && user.otpExpires && new Date(user.otpExpires).getTime() >= Date.now();
    const isSessionOtpValid = resetSession && resetSession.otp === submittedOtp && resetSession.otpExpires >= Date.now();

    if (!isDbOtpValid && !isSessionOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpires = null;
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
