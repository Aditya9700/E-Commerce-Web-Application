require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Import models for admin stats endpoint
const Product = require('./models/Product');
const Order = require('./models/Order');

// ─── App Initialization ──────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB().then(() => {
  const seedAdmin = async () => {
    try {
      const User = require('./models/User');
      const adminExists = await User.findOne({ email: 'admin@gadgethub.com' });
      if (!adminExists) {
        await User.create({
          name: 'Admin User',
          email: 'admin@gadgethub.com',
          password: 'admin123', // Will be hashed automatically by userSchema pre-save hook
          role: 'admin',
        });
        console.log('👑 Admin user auto-seeded (admin@gadgethub.com / admin123)');
      }
    } catch (err) {
      console.error('❌ Failed to auto-seed admin user:', err.message);
    }
  };
  seedAdmin();
});

// ─── Global Middleware ────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      
      // Allow matches in configured origins or wildcard vercel subdomain formats
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      
      // Non-production fallback to avoid developer friction locally
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json()); // Parse incoming JSON request bodies

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🚀 GadgetHub API is running' });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ─── Admin Dashboard Stats ────────────────────────────────────────────────────
// Protected: only admins should call this from the frontend, but we keep
// the middleware import here to avoid circular dependency with a separate route file.
const { protect } = require('./middleware/authMiddleware');
const { adminOnly } = require('./middleware/adminMiddleware');

app.get('/api/admin/stats', protect, adminOnly, async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: 'Pending' });
  const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });

  return res.status(200).json({
    totalProducts,
    totalOrders,
    pendingOrders,
    deliveredOrders,
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Catches any error passed via next(error) from controllers/middleware
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({ message });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 GadgetHub Backend running on http://localhost:${PORT}`);
});
