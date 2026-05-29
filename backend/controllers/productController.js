const Product = require('../models/Product');

// -------------------------------------------------------
// @desc    Get all products
// @route   GET /api/products
// @access  Public
// -------------------------------------------------------
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  return res.status(200).json(products);
};

// -------------------------------------------------------
// @desc    Get all mobile products
// @route   GET /api/products/mobile
// @access  Public
// -------------------------------------------------------
const getMobileProducts = async (req, res) => {
  const products = await Product.find({ category: 'mobile' });
  return res.status(200).json(products);
};

// -------------------------------------------------------
// @desc    Get all laptop products
// @route   GET /api/products/laptop
// @access  Public
// -------------------------------------------------------
const getLaptopProducts = async (req, res) => {
  const products = await Product.find({ category: 'laptop' });
  return res.status(200).json(products);
};

// -------------------------------------------------------
// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
// -------------------------------------------------------
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  return res.status(200).json(product);
};

// -------------------------------------------------------
// @desc    Create a new product
// @route   POST /api/products
// @access  Admin only
// -------------------------------------------------------
const createProduct = async (req, res) => {
  const { title, description, price, image, category, stock } = req.body;

  // Validate required fields
  if (!title || !description || !price || !image || !category) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  const product = await Product.create({
    title,
    description,
    price,
    image,
    category,
    stock: stock || 0,
  });

  return res.status(201).json(product);
};

// -------------------------------------------------------
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin only
// -------------------------------------------------------
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { title, description, price, image, category, stock } = req.body;

  // Update only provided fields
  product.title = title ?? product.title;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.image = image ?? product.image;
  product.category = category ?? product.category;
  product.stock = stock ?? product.stock;

  const updatedProduct = await product.save();
  return res.status(200).json(updatedProduct);
};

// -------------------------------------------------------
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin only
// -------------------------------------------------------
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  await product.deleteOne();
  return res.status(200).json({ message: 'Product deleted successfully' });
};

module.exports = {
  getAllProducts,
  getMobileProducts,
  getLaptopProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
