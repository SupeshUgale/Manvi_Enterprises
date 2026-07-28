const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/auth");

router
  .route("/")
  .get(getAllCategories)
  .post(protect, admin, createCategory);

router
  .route("/:slug")
  .get(getCategoryBySlug)
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

module.exports = router;
