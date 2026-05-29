import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { mockProducts } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiArrowLeft, FiCheck, FiXCircle, FiPlus, FiMinus, FiInfo } from 'react-icons/fi';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Initialize from cache
  const [products] = useState(() => {
    const saved = localStorage.getItem('gadgethub_products');
    return saved ? JSON.parse(saved) : mockProducts;
  });

  const initialProduct = products.find((p) => p.id?.toString() === id?.toString());
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);

  // Attempt backend fetch in background
  useEffect(() => {
    const fetchProductDetails = async () => {
      // Only query backend if id looks like a valid MongoDB ObjectId (24 chars hex)
      if (id && id.length === 24) {
        setLoading(true);
        try {
          const response = await api.get(`/products/${id}`);
          if (response.data) {
            const p = response.data;
            const mappedCategory = p.category === 'mobile' ? 'Mobiles' : p.category === 'laptop' ? 'Laptops' : p.category;
            const normalized = {
              ...p,
              id: p._id || p.id,
              name: p.title || p.name,
              brand: p.brand || (p.title ? p.title.split(' ')[0] : 'Generic'),
              category: mappedCategory,
              specs: p.specs || {
                screen: "Premium display",
                processor: "Advanced CPU",
                camera: mappedCategory === 'Mobiles' ? "High-res Camera" : "N/A",
                battery: "All-day Backup",
                storage: "256GB"
              }
            };
            setProduct(normalized);
          }
        } catch (error) {
          console.error('Failed to background fetch product details:', error.message);
          // Gracefully keep initial cached product
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductDetails();
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Product Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-all shadow"
        >
          <FiArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Back navigation */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          <FiArrowLeft /> Back
        </button>
      </div>

      {/* Main product structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm relative">
        {loading && (
          <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold text-sky-500 bg-sky-50 dark:bg-sky-950/40 px-3 py-1 rounded-full border border-sky-100 dark:border-sky-900/50">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping"></span>
            Syncing live specs...
          </div>
        )}

        {/* Left Side: Product Image */}
        <div className="lg:col-span-6 flex flex-col justify-center bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 overflow-hidden border border-slate-100 dark:border-slate-800/80">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto max-h-[420px] object-contain rounded-xl hover:scale-[1.02] transition-transform duration-300"
          />
        </div>

        {/* Right Side: Product Details */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category / Brand Badges */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md">
                {product.brand}
              </span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                {product.category}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Price Tag */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-sky-400">
                ${product.price.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">USD (VAT incl.)</span>
            </div>

            {/* Stock Indicator */}
            <div>
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl border border-rose-100 dark:border-rose-900/50">
                  <FiXCircle className="w-4 h-4" /> Out Of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-xl border border-amber-100 dark:border-amber-900/50 animate-pulse">
                  Only {product.stock} left in stock - order soon!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                  <FiCheck className="w-4 h-4" /> In Stock & Ready to Ship
                </span>
              )}
            </div>

            {/* Product Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-450 leading-relaxed font-normal pt-2">
              {product.description}
            </p>
          </div>

          {/* Cart Quantity Action Box */}
          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Quantity</span>
              
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 p-0.5">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-450 dark:hover:text-white dark:hover:bg-slate-850 rounded-lg disabled:opacity-40"
                  title="Decrease"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-extrabold text-sm text-slate-800 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-450 dark:hover:text-white dark:hover:bg-slate-850 rounded-lg disabled:opacity-40"
                  title="Increase"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-3.5 px-6 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] ${
                addedFeedback
                  ? 'bg-emerald-500 shadow-emerald-500/10'
                  : isOutOfStock
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95'
              }`}
            >
              {addedFeedback ? (
                <>
                  <FiCheck className="w-5 h-5 animate-bounce" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <FiShoppingCart className="w-5 h-5" />
                  Add To Shopping Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Specifications Details Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-2">
          <FiInfo className="text-sky-500" />
          Technical Specifications
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(product.specs).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between items-center py-3.5 px-4 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors"
            >
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-right pl-4">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
