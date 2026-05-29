import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiEye, FiShoppingCart, FiCheck, FiXCircle } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover-lift flex flex-col h-full shadow-sm">
      {/* Product Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        {/* Category & Brand Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-slate-900/80 backdrop-blur-md text-white rounded-full">
            {product.brand}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-rose-500 text-white rounded-full shadow-sm">
              <FiXCircle /> Out Of Stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-amber-500 text-white rounded-full shadow-sm animate-pulse">
              Only {product.stock} Left
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-emerald-500 text-white rounded-full shadow-sm">
              <FiCheck /> In Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Brand Subheader */}
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
            {product.category}
          </p>
          {/* Title */}
          <h3 className="font-bold text-base text-slate-800 dark:text-white line-clamp-1 mb-2 hover:text-sky-600 transition-colors">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          {/* Description */}
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div>
          {/* Price Tag */}
          <div className="flex items-center justify-between mb-4 border-t border-slate-100 dark:border-slate-800/80 pt-4">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Retail Price</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-sky-400">
              ${product.price.toLocaleString()}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/product/${product.id}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-white border border-slate-200 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-800 hover:border-slate-800 rounded-xl transition-all"
            >
              <FiEye className="w-3.5 h-3.5" />
              Details
            </Link>
            <button
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white rounded-xl transition-all shadow-sm ${
                isOutOfStock
                  ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 active:scale-[0.98]'
              }`}
            >
              <FiShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
