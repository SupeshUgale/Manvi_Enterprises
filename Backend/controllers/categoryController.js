const Category = require("../models/Category");

// Helper to slugify category names
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch categories.",
    });
  }
};

// @desc    Get single category by slug or ID
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let category = await Category.findOne({ slug });

    if (!category && slug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(slug);
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch category.",
    });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, img, image } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const slug = slugify(name);

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists.",
      });
    }

    const category = await Category.create({
      name,
      slug,
      description: description || "",
      img: img || image || "",
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create category.",
    });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:slug
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, description, img, image, isActive } = req.body;

    let category = await Category.findOne({ slug });
    if (!category && slug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(slug);
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name);
    }
    if (description !== undefined) category.description = description;
    if (img || image) category.img = img || image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update category.",
    });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:slug
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    let category = await Category.findOneAndDelete({ slug });
    if (!category && slug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findByIdAndDelete(slug);
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete category.",
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
