const Review = require("../models/Review");
const Product = require("../models/Product");

// @desc    Get all reviews for a specific product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reviews.",
    });
  }
};

// @desc    Create product review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide product ID, rating, and review comment.",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      userId: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    const review = await Review.create({
      productId,
      userId: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      data: review,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create review.",
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    // Allow user to delete their own review or admin to delete any review
    if (
      review.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review.",
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete review.",
    });
  }
};

module.exports = {
  getProductReviews,
  createReview,
  deleteReview,
};
