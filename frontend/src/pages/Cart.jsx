import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import { FiShoppingCart, FiArrowRight, FiLock, FiInfo, FiTruck } from 'react-icons/fi';

const Cart = () => {
  const { cartItems, cartTotal, placeOrder } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Shipping details state
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Financial summaries
  const shippingFee = cartTotal > 500 ? 0 : 25;
  const estimatedTax = cartTotal * 0.08; // 8% sales tax
  const orderTotal = cartTotal + shippingFee + estimatedTax;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');

    // Authentication Guard
    if (!isAuthenticated) {
      setError('You must sign in to place an order.');
      setTimeout(() => {
        navigate('/login', { state: { from: '/cart' } });
      }, 1500);
      return;
    }

    // Validation Guard
    if (!name.trim() || !address.trim() || !phone.trim()) {
      setError('Please fill in all shipping details.');
      return;
    }

    if (phone.length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }

    try {
      setLoading(true);
      const shippingDetails = { name, address, phone };
      
      // Submit order to API
      await placeOrder(shippingDetails);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please check your items.');
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STAGE
  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6 animate-fade-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl mt-10 shadow">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <FiTruck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Order Confirmed!</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Your purchase has been recorded successfully. Our team is preparing your package. Redirecting to your Orders panel...
        </p>
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  // EMPTY CART STAGE
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-655 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <FiShoppingCart className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 max-w-sm mx-auto">
            You haven't added any mobiles or laptops yet. Discover premium gear and customize your workspace today.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/mobiles"
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-all shadow text-sm"
          >
            Browse Mobile Phones
          </Link>
          <Link
            to="/laptops"
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold rounded-xl transition-all shadow text-sm"
          >
            Browse Laptops
          </Link>
        </div>
      </div>
    );
  }

  // STANDARD VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Shopping Cart</h1>
        <p className="text-sm text-slate-550 dark:text-slate-400">Review your handpicked selection and proceed to checkout</p>
      </div>

      {/* Main Grid Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Items list */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Right Side: Checkout and summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Financial Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-3">
              Order Summary
            </h3>
            
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-500 dark:text-slate-450">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">
                  ${cartTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-450">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">
                  ${estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-450">
                <span>Shipping Fee</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee}`}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5">
                  <FiInfo className="w-3.5 h-3.5" /> Free shipping on orders over $500!
                </p>
              )}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex justify-between items-baseline">
              <span className="font-extrabold text-base text-slate-800 dark:text-white">Order Total</span>
              <span className="text-2xl font-black text-slate-900 dark:text-sky-400">
                ${orderTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Checkout shipping details form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-1.5">
              <FiLock className="w-4 h-4 text-sky-500" />
              Secure Checkout
            </h3>

            <form onSubmit={handleCheckout} className="space-y-4">
              {/* Receiver Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Receiver Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aditya Rana"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Delivery Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery Address</label>
                <input
                  type="text"
                  placeholder="e.g. 456 Oak St, Seattle, WA"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Contact Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 123-456-7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Error block */}
              {error && (
                <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl border border-rose-100 dark:border-rose-900/50">
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Place Order <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
