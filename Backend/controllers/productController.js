const Product = require("../models/Product");

// @desc    Get all products with filtering, search, and pagination
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const { category, brand, search, minPrice, maxPrice, sort, page = 1, limit = 100 } = req.query;

    const query = {};

    if (category) {
      query.category = { $regex: new RegExp(category, "i") };
    }

    if (brand) {
      query.brand = { $regex: new RegExp(brand, "i") };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions = { createdAt: -1 };
    if (sort === "price-low") sortOptions = { price: 1 };
    if (sort === "price-high") sortOptions = { price: -1 };
    if (sort === "name") sortOptions = { name: 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
      data: products,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products.",
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product.",
    });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      stock,
      capacity,
      warranty,
      price,
      actualPrice,
      discount,
      description,
      image,
    } = req.body;

    let imageUrl = image;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!name || !category || !brand || !price || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product details (name, category, brand, price, image).",
      });
    }

    const calculatedDiscount = discount
      ? Number(discount)
      : actualPrice && price
      ? Math.round(((actualPrice - price) / actualPrice) * 100)
      : 0;

    const product = await Product.create({
      name,
      category,
      brand,
      stock: stock ? Number(stock) : 10,
      capacity: capacity || "N/A",
      warranty: warranty || "12 Months",
      price: Number(price),
      actualPrice: actualPrice ? Number(actualPrice) : Number(price),
      discount: calculatedDiscount,
      description: description || "",
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create product.",
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update product.",
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product.",
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
