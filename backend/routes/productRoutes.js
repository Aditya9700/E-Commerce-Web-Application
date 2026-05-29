const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getMobileProducts,
  getLaptopProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// NOTE: Specific routes (/mobile, /laptop) MUST be defined before the
// parameterized route (/:id) to avoid Express treating "mobile"/"laptop"
// as an ID value.

// GET /api/products           - All products (public)
router.get('/', getAllProducts);

// GET /api/products/mobile    - Only mobiles (public)
router.get('/mobile', getMobileProducts);

// GET /api/products/laptop    - Only laptops (public)
router.get('/laptop', getLaptopProducts);

// GET /api/products/:id       - Single product (public)
router.get('/:id', getProductById);

// POST /api/products          - Create product (admin only)
router.post('/', protect, adminOnly, createProduct);

// PUT /api/products/:id       - Update product (admin only)
router.put('/:id', protect, adminOnly, updateProduct);

// DELETE /api/products/:id    - Delete product (admin only)
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
