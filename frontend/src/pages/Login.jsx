import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiAlertCircle, FiCheck, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Inputs state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect path after successful login
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const loggedUser = await login(email.toLowerCase(), password);
      setLoading(false);
      if (loggedUser && loggedUser.role === 'admin') {
        navigate('/admin/orders', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-16 px-4 flex-grow animate-fade-in bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 to-indigo-600"></div>

        {/* Branding header */}
        <div className="text-center space-y-2">
          <Link to="/" className="text-2xl font-black bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
            GadgetHub
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500">Sign in to manage orders and checkout custom gear</p>
        </div>

        {/* Info Notification with admin credentials for portfolio review */}
        <div className="p-3 bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400 rounded-2xl border border-sky-150 dark:border-sky-900/50 text-xs flex items-start gap-2 leading-relaxed">
          <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold">Portfolio Reviewer Tip:</span>
            <p className="mt-0.5">Use <strong className="font-bold underline">admin@gadgethub.com</strong> (password: <strong className="font-bold underline">admin123</strong>) to log in as an <strong>Administrator</strong> and test management portals!</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email"
                placeholder="e.g. aditya@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm transition-all"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs font-semibold text-sky-500 hover:underline">Forgot?</a>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm transition-all"
                required
              />
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl border border-rose-100 dark:border-rose-900/50 flex items-center gap-1.5 font-medium animate-pulse">
              <FiAlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In <FiArrowRight />
              </>
            )}
          </button>
        </form>

        {/* Footer text */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-550 pt-2 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-sky-500 hover:underline font-bold">
            Sign Up Free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
