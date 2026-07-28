const express = require("express");
const router = express.Router();
const {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/auth");

router.route("/").get(protect, admin, getAllUsers).post(registerUser);
router
  .route("/:id")
  .get(protect, getUserById)
  .put(protect, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
