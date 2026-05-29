import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiPlus, FiMinus, FiInfo } from 'react-icons/fi';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => {
    if (item.quantity < item.stock) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const isMaxStockReached = item.quantity >= item.stock;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl gap-4 sm:gap-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Product Information */}
      <div className="flex items-center gap-4 w-full sm:w-auto flex-grow">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-grow">
          <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md mb-1">
            {item.brand}
          </span>
          <h4 className="text-base font-bold text-slate-800 dark:text-white truncate hover:text-sky-600 transition-colors">
            <Link to={`/product/${item.id}`}>{item.name}</Link>
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">{item.category}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              ${item.price.toLocaleString()} each
            </span>
            <span className="text-xs text-slate-300 dark:text-slate-700">|</span>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
              {item.stock} in stock
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls (Quantity, Subtotal, Delete) */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
        {/* Quantity Controls */}
        <div className="flex flex-col gap-1 items-center">
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 overflow-hidden p-0.5">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-150 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
              title="Decrease quantity"
            >
              <FiMinus className="w-3.5 h-3.5" />
            </button>
            
            <span className="w-10 text-center font-bold text-sm text-slate-800 dark:text-white">
              {item.quantity}
            </span>
            
            <button
              onClick={handleIncrement}
              disabled={isMaxStockReached}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-150 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
              title={isMaxStockReached ? "Max stock reached" : "Increase quantity"}
            >
              <FiPlus className="w-3.5 h-3.5" />
            </button>
          </div>
          {isMaxStockReached && (
            <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5">
              <FiInfo className="w-3 h-3" /> Max Stock Reached
            </span>
          )}
        </div>

        {/* Item Subtotal */}
        <div className="text-right min-w-[80px]">
          <p className="text-xs text-slate-400 dark:text-slate-500">Subtotal</p>
          <p className="text-base font-extrabold text-slate-900 dark:text-sky-400">
            ${(item.price * item.quantity).toLocaleString()}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="p-2.5 text-rose-500 hover:text-white hover:bg-rose-500 border border-rose-100 hover:border-rose-500 dark:border-rose-950/40 rounded-xl transition-all"
          title="Remove from cart"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
