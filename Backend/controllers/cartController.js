const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Helper function to recalculate cart totals
const recalculateCart = (cart) => {
  cart.subtotal = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  cart.items.forEach((item) => {
    item.totalPrice = item.price * item.quantity;
  });
  cart.gst = Math.round(cart.subtotal * 0.18);
  cart.deliveryCharge = cart.subtotal > 5000 || cart.subtotal === 0 ? 0 : 200;
  cart.totalAmount = cart.subtotal + cart.gst + cart.deliveryCharge;
  return cart;
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch cart.",
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/item
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, deliveryNote, orderMode } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        sku: product._id.toString(),
        brand: product.brand || "",
        category: product.category || "",
        image: product.image,
        price: product.price,
        warranty: product.warranty || "",
        quantity: Number(quantity),
        totalPrice: product.price * Number(quantity),
      });
    }

    if (deliveryNote) cart.deliveryNote = deliveryNote;
    if (orderMode) cart.orderMode = orderMode;

    recalculateCart(cart);
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart.",
      data: cart,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add item to cart.",
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/item
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required.",
      });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart.",
      });
    }

    if (Number(quantity) <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = Number(quantity);
    }

    recalculateCart(cart);
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully.",
      data: cart,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update cart item.",
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/item/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    recalculateCart(cart);
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      data: cart,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to remove item from cart.",
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      recalculateCart(cart);
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to clear cart.",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
