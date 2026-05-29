const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// NOTE: /my-orders MUST come before /:id to avoid routing conflicts.

// POST /api/orders                  - Place new order (authenticated)
router.post('/', protect, createOrder);

// GET /api/orders/my-orders         - Get logged-in user's orders (authenticated)
router.get('/my-orders', protect, getMyOrders);

// GET /api/orders                   - Get all orders (admin only)
router.get('/', protect, adminOnly, getAllOrders);

// PUT /api/orders/:id/status        - Update order status (admin only)
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
