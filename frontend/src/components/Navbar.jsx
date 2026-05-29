import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const navLinkStyles = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950/40'
        : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-sky-400 dark:hover:bg-slate-900/60'
    }`;

  const mobileNavLinkStyles = ({ isActive }) =>
    `block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
      isActive
        ? 'text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950/40'
        : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-sky-400 dark:hover:bg-slate-900/60'
    }`;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                Gadget<span className="text-slate-800 dark:text-white">Hub</span>
              </span>
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500 glow-badge"></div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" className={navLinkStyles}>Home</NavLink>
            <NavLink to="/mobiles" className={navLinkStyles}>Mobiles</NavLink>
            <NavLink to="/laptops" className={navLinkStyles}>Laptops</NavLink>

            {isAuthenticated && (
              <>
                {isAdmin ? (
                  <>
                    <NavLink to="/admin/products" className={navLinkStyles}>
                      <span className="flex items-center gap-1"><FiSettings className="w-3.5 h-3.5" /> Admin Products</span>
                    </NavLink>
                    <NavLink to="/admin/orders" className={navLinkStyles}>Admin Orders</NavLink>
                  </>
                ) : (
                  <NavLink to="/orders" className={navLinkStyles}>My Orders</NavLink>
                )}
              </>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400 transition-colors">
              <FiShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-sky-500 rounded-full shadow">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <FiUser className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                    {user?.name}
                  </span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 rounded">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-rose-600 hover:text-white border border-rose-200 hover:bg-rose-600 hover:border-rose-600 rounded-lg transition-all duration-200"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 shadow-md rounded-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-sky-600 dark:text-slate-300 transition-colors">
              <FiShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-sky-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden glass border-b border-slate-200/80 dark:border-slate-800/80 animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <NavLink to="/" onClick={() => setIsOpen(false)} className={mobileNavLinkStyles}>Home</NavLink>
            <NavLink to="/mobiles" onClick={() => setIsOpen(false)} className={mobileNavLinkStyles}>Mobiles</NavLink>
            <NavLink to="/laptops" onClick={() => setIsOpen(false)} className={mobileNavLinkStyles}>Laptops</NavLink>

            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <>
                    <NavLink to="/admin/products" onClick={() => setIsOpen(false)} className={mobileNavLinkStyles}>Admin Products</NavLink>
                    <NavLink to="/admin/orders" onClick={() => setIsOpen(false)} className={mobileNavLinkStyles}>Admin Orders</NavLink>
                  </>
                ) : (
                  <NavLink to="/orders" onClick={() => setIsOpen(false)} className={mobileNavLinkStyles}>My Orders</NavLink>
                )}
                
                <div className="border-t border-slate-200 dark:border-slate-800 mt-4 pt-4 px-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 py-1.5">
                    <FiUser className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
                      {user?.name}
                    </span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-800 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold transition-all text-sm"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-slate-200 dark:border-slate-800 mt-4 pt-4 px-4 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold hover:opacity-95 text-sm shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
