import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiSliders, FiImage, FiSettings, FiX, FiAlertCircle, FiCheck } from 'react-icons/fi';

const AdminProducts = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Role Guard
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Load products from backend
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/products');
      
      // Normalize backend product database schema for frontend views
      const normalized = (response.data || []).map((p) => {
        const mappedCategory = p.category === 'mobile' ? 'Mobiles' : p.category === 'laptop' ? 'Laptops' : p.category;
        return {
          ...p,
          id: p._id || p.id,
          name: p.title || p.name,
          brand: p.brand || (p.title ? p.title.split(' ')[0] : 'Generic'),
          category: mappedCategory,
        };
      });
      setProducts(normalized);
    } catch (err) {
      console.error('Failed to load inventory:', err.message);
      setError('Could not retrieve catalog inventory. Ensure the backend is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchProducts();
    }
  }, [isAuthenticated, isAdmin]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Mobiles');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [screen, setScreen] = useState('');
  const [processor, setProcessor] = useState('');
  const [camera, setCamera] = useState('');
  const [battery, setBattery] = useState('');
  const [storage, setStorage] = useState('');

  const [formError, setFormError] = useState('');

  // Toast auto-clear helper
  const triggerToast = (msg, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setError(msg);
      setTimeout(() => setError(''), 5000);
    }
  };

  // Open modal for adding product
  const handleOpenAdd = () => {
    setModalMode('add');
    setSelectedProductId(null);
    setFormError('');
    // Clear form
    setName('');
    setBrand('');
    setCategory('Mobiles');
    setPrice('');
    setStock('');
    setImage('');
    setDescription('');
    setScreen('');
    setProcessor('');
    setCamera('');
    setBattery('');
    setStorage('');
    setIsModalOpen(true);
  };

  // Open modal for editing product
  const handleOpenEdit = (product) => {
    setModalMode('edit');
    setSelectedProductId(product.id);
    setFormError('');
    // Prefill form
    setName(product.name);
    setBrand(product.brand);
    setCategory(product.category);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setImage(product.image);
    setDescription(product.description);
    setScreen(product.specs?.screen || '');
    setProcessor(product.specs?.processor || '');
    setCamera(product.specs?.camera || '');
    setBattery(product.specs?.battery || '');
    setStorage(product.specs?.storage || '');
    setIsModalOpen(true);
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product from stock?')) {
      try {
        await api.delete(`/products/${productId}`);
        triggerToast('Product deleted from inventory successfully!');
        fetchProducts(); // Refresh live catalog
      } catch (err) {
        triggerToast(err.message || 'Deletion failed. Please try again.', false);
      }
    }
  };

  // Submit Modal Form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!name.trim() || !price || !stock || !image.trim() || !description.trim()) {
      setFormError('Please fill in all required fields marked with *');
      return;
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock);

    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Price must be a positive number.');
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      setFormError('Stock must be a non-negative integer.');
      return;
    }

    // Map Category to backend schema singular-lowercase enum ('mobile' or 'laptop')
    const mappedCategory = category === 'Mobiles' ? 'mobile' : 'laptop';

    const productPayload = {
      title: name,
      description,
      price: priceNum,
      image,
      category: mappedCategory,
      stock: stockNum,
      // Pass specs down if user wants to set them (will be ignored or nested depending on model)
      specs: {
        screen: screen || 'Standard display',
        processor: processor || 'Multi-core architecture',
        camera: camera || 'N/A',
        battery: battery || 'Standard daily backup',
        storage: storage || '128GB'
      }
    };

    try {
      setSubmitLoading(true);
      if (modalMode === 'add') {
        await api.post('/products', productPayload);
        triggerToast('New tech product added to stock successfully!');
      } else {
        await api.put(`/products/${selectedProductId}`, productPayload);
        triggerToast('Technical specifications updated successfully!');
      }
      setIsModalOpen(false);
      fetchProducts(); // Refresh list
    } catch (err) {
      setFormError(err.message || 'Submission failed. Please check inputs.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Filters logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isAuthenticated || !isAdmin) {
    return null; // Let the guard handle redirection
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in relative">
      {/* Dynamic Feedback Banner */}
      {successMsg && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-emerald-500 text-white font-bold py-3 px-5 rounded-2xl shadow-xl shadow-emerald-500/10 border border-emerald-400 animate-slide-in">
          <FiCheck className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-2xl border border-rose-100 dark:border-rose-900/50 flex items-center gap-2 text-sm font-semibold">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FiSettings className="text-sky-500" />
            Inventory Control Panel
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Add, edit, or delete items from the global store catalogue</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/10 transition-all hover:-translate-y-0.5 text-sm"
        >
          <FiPlus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Control panel bars */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search catalog by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm transition-all"
          />
        </div>

        {/* Category selectors */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter Category</span>
          <div className="flex bg-slate-100 dark:bg-slate-950 rounded-xl p-1 border border-slate-200 dark:border-slate-850">
            {['All', 'Mobiles', 'Laptops'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-400">Loading catalog assets...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-955/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800/80 text-sm font-semibold text-slate-700 dark:text-slate-350">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                      {/* Image & Title details */}
                      <td className="px-6 py-4 flex items-center gap-3 min-w-[280px]">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200 flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-900 dark:text-white truncate">{product.name}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{product.brand}</p>
                        </div>
                      </td>
                      
                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-850 text-slate-505">
                          {product.category}
                        </span>
                      </td>
                      
                      {/* Price */}
                      <td className="px-6 py-4 text-slate-900 dark:text-sky-400 font-extrabold">
                        ${product.price.toLocaleString()}
                      </td>
                      
                      {/* Stock level */}
                      <td className="px-6 py-4">
                        {product.stock === 0 ? (
                          <span className="px-2 py-0.5 rounded text-xs bg-rose-50 dark:bg-rose-950/20 text-rose-600 font-bold border border-rose-100 dark:border-rose-900/50">
                            Sold Out
                          </span>
                        ) : product.stock <= 5 ? (
                          <span className="px-2 py-0.5 rounded text-xs bg-amber-50 dark:bg-amber-950/20 text-amber-600 font-bold border border-amber-100 dark:border-amber-900/50 animate-pulse">
                            Low Stock ({product.stock})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 font-bold border border-emerald-100 dark:border-emerald-900/50">
                            {product.stock} In Stock
                          </span>
                        )}
                      </td>
                      
                      {/* Actions buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:text-slate-400 dark:hover:text-sky-400 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-400 dark:text-slate-500">
                      No matching catalog products found. Try modifying your queries.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE & EDIT MODAL VIEW */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-white transition-colors"
              disabled={submitLoading}
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {modalMode === 'add' ? 'Add New Tech Asset' : 'Edit Technical Asset'}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Fill in details below. Syncs automatically to portfolio display grids.</p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. iPhone 15 Pro Max"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                    disabled={submitLoading}
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Brand Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Apple or Samsung"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    disabled={submitLoading}
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    disabled={submitLoading}
                  >
                    <option value="Mobiles">Mobiles</option>
                    <option value="Laptops">Laptops</option>
                  </select>
                </div>

                {/* Image URL */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">High-Res Image URL *</label>
                  <input
                    type="url"
                    placeholder="e.g. https://images.unsplash.com/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                    disabled={submitLoading}
                  />
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price (USD) *</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="e.g. 999"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                    disabled={submitLoading}
                  />
                </div>

                {/* Stock Level */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Available *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 15"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                    disabled={submitLoading}
                  />
                </div>
              </div>

              {/* Description Box */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detailed Description *</label>
                <textarea
                  rows="3"
                  placeholder="Enter detailed e-commerce description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                  disabled={submitLoading}
                ></textarea>
              </div>

              {/* Specs Box */}
              <div className="border-t border-slate-100 dark:border-slate-850 pt-5 space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Technical Specs (Optional)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Screen */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500">Screen Specs</label>
                    <input
                      type="text"
                      placeholder="e.g. 6.7-inch OLED 120Hz"
                      value={screen}
                      onChange={(e) => setScreen(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      disabled={submitLoading}
                    />
                  </div>

                  {/* Processor */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500">Processor Specs</label>
                    <input
                      type="text"
                      placeholder="e.g. A17 Pro Chip"
                      value={processor}
                      onChange={(e) => setProcessor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      disabled={submitLoading}
                    />
                  </div>

                  {/* Camera */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500">Camera (Mobiles Only)</label>
                    <input
                      type="text"
                      placeholder="e.g. 48MP Triple Rear Camera"
                      value={camera}
                      onChange={(e) => setCamera(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      disabled={submitLoading}
                    />
                  </div>

                  {/* Battery */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500">Battery Specs</label>
                    <input
                      type="text"
                      placeholder="e.g. 5000 mAh (90W Fast)"
                      value={battery}
                      onChange={(e) => setBattery(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      disabled={submitLoading}
                    />
                  </div>

                  {/* Storage */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500">Storage / RAM</label>
                    <input
                      type="text"
                      placeholder="e.g. 256GB / 12GB RAM"
                      value={storage}
                      onChange={(e) => setStorage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-855 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      disabled={submitLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Form level error */}
              {formError && (
                <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl border border-rose-100 dark:border-rose-900/50">
                  {formError}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-850 pt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-850"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl text-sm shadow-md flex items-center gap-1.5"
                >
                  {submitLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Save Asset'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
