const Order = require('../models/Order');
const Product = require('../models/Product');

// -------------------------------------------------------
// @desc    Create a new order
// @route   POST /api/orders
// @access  Authenticated users only
// -------------------------------------------------------
const createOrder = async (req, res) => {
  const { products, totalAmount } = req.body;

  // Validate required fields
  if (!products || products.length === 0) {
    return res.status(400).json({ message: 'No products in order' });
  }

  if (!totalAmount || totalAmount <= 0) {
    return res.status(400).json({ message: 'Invalid total amount' });
  }

  // Create order and attach the logged-in user automatically
  const order = await Order.create({
    user: req.user._id,
    products,
    totalAmount,
  });

  // Populate product details in the response
  const populatedOrder = await Order.findById(order._id)
    .populate('products.product', 'title price image category')
    .populate('user', 'name email');

  return res.status(201).json(populatedOrder);
};

// -------------------------------------------------------
// @desc    Get orders for the logged-in user
// @route   GET /api/orders/my-orders
// @access  Authenticated users only
// -------------------------------------------------------
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('products.product', 'title price image category')
    .sort({ createdAt: -1 }); // Newest first

  return res.status(200).json(orders);
};

// -------------------------------------------------------
// @desc    Get all orders (Admin view)
// @route   GET /api/orders
// @access  Admin only
// -------------------------------------------------------
const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate('products.product', 'title price image category')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  return res.status(200).json(orders);
};

// -------------------------------------------------------
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin only
// -------------------------------------------------------
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  // Validate allowed status values
  const allowedStatuses = ['Pending', 'Shipped', 'Delivered'];
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
    });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.status = status;
  const updatedOrder = await order.save();

  return res.status(200).json(updatedOrder);
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
