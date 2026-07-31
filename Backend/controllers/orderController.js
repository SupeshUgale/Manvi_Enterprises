const Order = require("../models/Order");
const {
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
} = require("../services/emailService");

// Helper to generate a unique order ID e.g. ORD-20260729-1234
const generateOrderId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${dateStr}-${randomNum}`;
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public / Private
const createOrder = async (req, res) => {
  try {
    const {
      customer,
      products,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    } = req.body;

    const orderProducts = products || items;

    if (!orderProducts || orderProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided.",
      });
    }

    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete customer contact details.",
      });
    }

    if (!shippingAddress || !shippingAddress.address) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete shipping address details.",
      });
    }

    const rawEmail = customer.email || (req.user ? req.user.email : null);
    if (!rawEmail) {
      return res.status(400).json({
        success: false,
        message: "Customer email address is required to place an order.",
      });
    }
    const recipientEmail = rawEmail.toLowerCase().trim();

    const orderId = generateOrderId();

    const order = await Order.create({
      orderId,
      customer: {
        name: customer.name,
        email: recipientEmail,
        phone: customer.phone,
      },
      products: orderProducts.map((item) => ({
        productId: item.productId || item.id || item._id,
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price,
        image: item.image || "",
      })),
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city || "",
        state: shippingAddress.state || "",
        pincode: shippingAddress.pincode || shippingAddress.zip || "",
      },
      paymentMethod: paymentMethod || "COD",
      totalAmount:
        totalAmount ||
        orderProducts.reduce(
          (acc, i) => acc + i.price * (i.quantity || 1),
          0
        ),
      orderStatus: "Placed",
      paymentStatus:
        paymentMethod === "Online" || paymentMethod === "Card"
          ? "Paid"
          : "Pending",
    });

    // Send Order Confirmation Email asynchronously
    sendOrderConfirmationEmail(recipientEmail, order).catch((err) => {
      console.error("❌ Failed to send Order Confirmation Email:", err.message);
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully. Confirmation email sent.",
      data: order,
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order.",
    });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const userEmail = (req.user ? req.user.email : "").toLowerCase().trim();

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "User context not found.",
      });
    }

    const orders = await Order.find({
      "customer.email": { $regex: new RegExp(`^${userEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") }
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders.",
    });
  }
};

// @desc    Get order by ID or orderId
// @route   GET /api/orders/:id
// @access  Public / Private
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    let order;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order details.",
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch all orders.",
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, orderStatus, paymentStatus } = req.body;
    const { id } = req.params;

    let order;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const newStatus = status || orderStatus;
    let statusChanged = false;

    if (newStatus && order.orderStatus !== newStatus) {
      order.orderStatus = newStatus;
      statusChanged = true;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    // Send status notification email to customer if status changed
    if (statusChanged && order.customer && order.customer.email) {
      sendOrderStatusUpdateEmail(order.customer.email, order).catch((err) => {
        console.error("❌ Failed to send Order Status Update Email:", err.message);
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: order,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status.",
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
