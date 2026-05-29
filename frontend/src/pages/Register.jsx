import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiCheck, FiArrowRight } from 'react-icons/fi';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Inputs state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register(name, email.toLowerCase(), password);
      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed. Please try again.');
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
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Join us and experience premium, frictionless shopping</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="e.g. Aditya Rana"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm transition-all"
                required
              />
            </div>
          </div>

          {/* Email input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">Email Address</label>
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
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="password"
                placeholder="Must be at least 6 chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm transition-all"
                required
              />
            </div>
          </div>

          {/* Confirm Password input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm transition-all"
                required
              />
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl border border-rose-100 dark:border-rose-900/50 flex items-center gap-1.5 font-medium">
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
                Create Account <FiArrowRight />
              </>
            )}
          </button>
        </form>

        {/* Footer text */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-550 pt-2 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-500 hover:underline font-bold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
