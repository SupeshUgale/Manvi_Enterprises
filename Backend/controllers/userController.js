const User = require("../models/User");

// @desc    Register new user (Admin or legacy endpoint)
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, mobile, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || mobile || "",
      mobile: mobile || phone || "",
      address: address || "",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create user.",
    });
  }
};

// @desc    Get All Users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users.",
    });
  }
};

// @desc    Get User By ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user.",
    });
  }
};

// @desc    Update User By ID
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
  try {
    const fieldsToUpdate = { ...req.body };
    delete fieldsToUpdate.password; // Prevent direct password overwrite here

    const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update user.",
    });
  }
};

// @desc    Delete User
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user.",
    });
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};