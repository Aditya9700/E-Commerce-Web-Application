import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FiTrendingUp, FiShoppingBag, FiTruck, FiCheckCircle, FiClock, FiSliders, FiAlertCircle, FiCheck } from 'react-icons/fi';

const AdminOrders = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Role Guard
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // States
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Toast trigger
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchOrdersAndStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch dynamic stats and orders in parallel
      const [ordersRes, statsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/admin/stats')
      ]);

      // Normalize orders list (nested schema properties mapping to flat UI components)
      const normalizedOrders = (ordersRes.data || []).map((order) => ({
        id: order._id,
        date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        totalAmount: order.totalAmount,
        status: order.status || 'Pending',
        shippingDetails: {
          name: order.user?.name || "Recipient",
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

      setOrders(normalizedOrders);
      
      if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Failed to load admin logs:', err.message);
      setError('Could not retrieve transactional registry. Verify API connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchOrdersAndStats();
    }
  }, [isAuthenticated, isAdmin]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      triggerToast(`Order status updated to "${newStatus}"!`);
      fetchOrdersAndStats(); // Re-sync logs & metrics
    } catch (err) {
      triggerToast(err.message || 'Failed to update order status.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50';
      default:
        return 'bg-slate-50 text-slate-650 dark:bg-slate-900 dark:text-slate-400';
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null; // Let the guard handle redirection
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in relative">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-emerald-500 text-white font-bold py-3 px-5 rounded-2xl shadow-xl shadow-emerald-500/10 border border-emerald-400 animate-slide-in">
          <FiCheck className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-2xl border border-rose-100 dark:border-rose-900/50 flex items-center gap-2 text-sm font-semibold">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FiSliders className="text-sky-500" />
          Master Orders Control
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">View corporate transactions and dispatch shipments in real-time</p>
      </div>

      {/* Corporate Dashboard Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: stats.totalProducts, icon: <FiTrendingUp className="w-5 h-5 text-emerald-500" />, bg: "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/40" },
          { label: "Total Orders Placed", value: stats.totalOrders, icon: <FiShoppingBag className="w-5 h-5 text-sky-500" />, bg: "bg-sky-50/50 dark:bg-sky-950/10 border-sky-100 dark:border-sky-900/40" },
          { label: "Pending Shipments", value: stats.pendingOrders, icon: <FiClock className="w-5 h-5 text-amber-500" />, bg: "bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/40" },
          { label: "Completed Deliveries", value: stats.deliveredOrders, icon: <FiCheckCircle className="w-5 h-5 text-indigo-500" />, bg: "bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-100 dark:border-indigo-900/40" }
        ].map((stat, i) => (
          <div key={i} className={`p-5 bg-white dark:bg-slate-900 border rounded-2xl flex items-center justify-between shadow-sm ${stat.bg}`}>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</h3>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Orders Table Container */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-400">Loading shipment registries...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Placed Date</th>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Order Summary</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="px-6 py-4">Status & Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800/80 text-sm font-semibold text-slate-700 dark:text-slate-350">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                      {/* Order ID */}
                      <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white truncate max-w-[120px]" title={order.id}>
                        {order.id}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {order.date}
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4 min-w-[200px]">
                        <p className="font-extrabold text-slate-900 dark:text-white">{order.shippingDetails?.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[220px]" title={order.shippingDetails?.address}>
                          {order.shippingDetails?.address}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium font-mono">Tel: {order.shippingDetails?.phone}</p>
                      </td>

                      {/* Order Items Summary */}
                      <td className="px-6 py-4 min-w-[240px]">
                        <div className="space-y-1 max-h-[80px] overflow-y-auto pr-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="text-xs flex justify-between gap-3 text-slate-500 dark:text-slate-400 font-medium">
                              <span className="truncate max-w-[150px] font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                              <span className="flex-shrink-0 text-[10px]">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="px-6 py-4 text-slate-900 dark:text-sky-400 font-extrabold text-base">
                        ${order.totalAmount.toLocaleString()}
                      </td>

                      {/* Dispatch Dropdown selector */}
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`px-3 py-2 border rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${getStatusColor(order.status)}`}
                        >
                          <option value="Pending">🕒 Pending</option>
                          <option value="Shipped">🚚 Shipped</option>
                          <option value="Delivered">✅ Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400 dark:text-slate-500">
                      No transactions are currently recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
