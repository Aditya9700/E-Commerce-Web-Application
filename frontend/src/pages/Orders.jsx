import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiShoppingBag, FiTruck, FiBox, FiCheckCircle, FiClock, FiMapPin, FiCalendar, FiAlertCircle } from 'react-icons/fi';

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/orders/my-orders');
        
        // Map the backend DB order schema into the exact keys needed by the frontend UI
        const mapped = (response.data || []).map((order) => ({
          id: order._id,
          date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          totalAmount: order.totalAmount,
          status: order.status || 'Pending',
          shippingDetails: {
            name: order.user?.name || user?.name || "Recipient",
            address: "123 Premium Tech Way, Silicon Valley, CA",
            phone: "555-0199",
          },
          items: (order.products || []).map((pItem) => {
            const prod = pItem.product || {};
            return {
              id: prod._id || Math.random(),
              name: prod.title || "Gadget Device",
              price: prod.price || 0,
              image: prod.image || "https://placehold.co/100x100?text=Product",
              quantity: pItem.quantity || 1,
            };
          }),
        }));
        setOrdersList(mapped);
      } catch (err) {
        console.error('Failed to load user orders:', err.message);
        setError('Could not retrieve orders from the server. Please try refreshing.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [isAuthenticated, user]);

  // Guard: Must be authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-650 rounded-full flex items-center justify-center mx-auto">
          <FiShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Access Denied</h2>
          <p className="text-sm text-slate-400 dark:text-slate-505 mt-2 max-w-xs mx-auto">
            Please log in to view your order history and track deliveries.
          </p>
        </div>
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-all shadow text-sm"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  // Loading Indicator State
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center flex flex-col justify-center items-center space-y-4">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Syncing with corporate transaction logs...</p>
      </div>
    );
  }

  // Error State Indicator
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-100 dark:border-rose-900/50">
          <FiAlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{error}</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-sky-500 text-white font-bold text-xs rounded-xl shadow hover:bg-sky-400 transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Helper for status styling and icons
  const getStatusMeta = (status) => {
    switch (status) {
      case 'Pending':
        return {
          colorClass: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50',
          icon: <FiClock className="w-3.5 h-3.5" />,
          progress: 1
        };
      case 'Shipped':
        return {
          colorClass: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50',
          icon: <FiTruck className="w-3.5 h-3.5" />,
          progress: 2
        };
      case 'Delivered':
        return {
          colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50',
          icon: <FiCheckCircle className="w-3.5 h-3.5" />,
          progress: 3
        };
      default:
        return {
          colorClass: 'bg-slate-50 text-slate-650 border-slate-100 dark:bg-slate-900 dark:text-slate-400',
          icon: <FiBox className="w-3.5 h-3.5" />,
          progress: 1
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Order History</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track and review details of all your premium tech purchases</p>
      </div>

      {/* Orders List */}
      {ordersList.length > 0 ? (
        <div className="space-y-6">
          {ordersList.map((order) => {
            const statusMeta = getStatusMeta(order.status);
            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Top Bar */}
                <div className="px-5 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800 flex flex-wrap gap-4 justify-between items-center text-sm">
                  <div className="flex items-center gap-6 flex-wrap">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</p>
                      <p className="font-extrabold text-slate-850 dark:text-white mt-0.5">{order.id}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiCalendar className="text-slate-400 w-4 h-4" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placed On</p>
                        <p className="font-semibold text-slate-700 dark:text-slate-350 mt-0.5">{order.date}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Paid</p>
                      <p className="font-black text-sky-655 dark:text-sky-400 mt-0.5">${order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${statusMeta.colorClass}`}>
                    {statusMeta.icon}
                    {order.status}
                  </span>
                </div>

                {/* Items & Shipping Details */}
                <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Items list */}
                  <div className="md:col-span-7 space-y-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Items</p>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-150 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-grow">
                          <h4 className="font-bold text-sm text-slate-850 dark:text-white truncate">
                            <Link to={`/product/${item.id}`}>{item.name}</Link>
                          </h4>
                          <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                            <span>Qty: {item.quantity}</span>
                            <span>${item.price.toLocaleString()} each</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Box */}
                  <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-855 pt-5 md:pt-0 md:pl-6 space-y-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <FiMapPin className="text-sky-500" /> Shipping Details
                    </p>
                    
                    <div className="text-sm space-y-2 text-slate-655 dark:text-slate-400 font-medium">
                      <p className="text-slate-850 dark:text-white font-bold">{order.shippingDetails?.name}</p>
                      <p className="text-xs leading-relaxed">{order.shippingDetails?.address}</p>
                      <p className="text-xs">Phone: {order.shippingDetails?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 bg-white dark:bg-slate-900">
          <FiShoppingBag className="w-12 h-12 text-slate-350 dark:text-slate-650 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Orders Found</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
            You haven't placed any orders yet. Visit our homepage and grab some cutting-edge gadgets!
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="px-5 py-2.5 bg-sky-500 text-white font-bold text-xs rounded-xl shadow hover:bg-sky-400 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
