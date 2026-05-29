import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { mockProducts } from '../data/mockProducts';
import ProductCard from '../components/ProductCard';
import { FiSmartphone, FiArrowRight, FiShield, FiTruck, FiRotateCcw, FiAward } from 'react-icons/fi';
import { FaLaptop } from 'react-icons/fa';

const Home = () => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('gadgethub_products');
    return saved ? JSON.parse(saved) : mockProducts;
  });

  // Hybrid strategy: fetch products in the background on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        if (response.data && response.data.length > 0) {
          // Normalize backend products to be 100% compatible with frontend keys
          const normalized = response.data.map((p) => {
            const mappedCategory = p.category === 'mobile' ? 'Mobiles' : p.category === 'laptop' ? 'Laptops' : p.category;
            return {
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
          });

          setProducts(normalized);
          localStorage.setItem('gadgethub_products', JSON.stringify(normalized));
        }
      } catch (error) {
        console.error('Failed to background fetch products from server:', error.message);
        // Silently continue showing fallback products
      }
    };

    fetchProducts();
  }, []);

  // Get featured products (e.g., first 4 mobiles and first 4 laptops)
  const featuredMobiles = products
    .filter((product) => product.category === 'Mobiles')
    .slice(0, 4);
    
  const featuredLaptops = products
    .filter((product) => product.category === 'Laptops')
    .slice(0, 4);

  return (
    <div className="space-y-16 pb-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl py-20 px-8 md:px-12 lg:px-16 shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          {/* Tag */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-widest">
            Portfolio Project • Internship Grade
          </span>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Next-Gen Gear for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Digital Pioneers
            </span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Welcome to <strong className="font-semibold text-white">GadgetHub</strong>. Discover our handpicked elite selection of ultra-premium laptops and mobile phones engineered for high performance.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              to="/mobiles"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/20 transition-all hover:-translate-y-0.5"
            >
              <FiSmartphone className="w-5 h-5" />
              Shop Mobiles
            </Link>
            <Link
              to="/laptops"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl shadow-lg transition-all hover:-translate-y-0.5"
            >
              <FaLaptop className="w-5 h-5" />
              Shop Laptops
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {[
          { icon: <FiTruck className="w-6 h-6 text-sky-500" />, title: "Free Express Shipping", desc: "For all orders over $500" },
          { icon: <FiShield className="w-6 h-6 text-sky-500" />, title: "2-Year Official Warranty", desc: "Full brand coverage guaranteed" },
          { icon: <FiRotateCcw className="w-6 h-6 text-sky-500" />, title: "30-Day Easy Returns", desc: "Hassle-free direct refund" },
          { icon: <FiAward className="w-6 h-6 text-sky-500" />, title: "100% Certified Authentic", desc: "Straight from official hubs" }
        ].map((feature, i) => (
          <div key={i} className="flex flex-col items-center text-center p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="p-3 bg-sky-55/50 dark:bg-sky-95/40 rounded-xl mb-3">{feature.icon}</div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">{feature.title}</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Featured Mobiles Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FiSmartphone className="text-sky-500" />
              Featured Mobile Phones
            </h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Explore the absolute best in smartphone innovations</p>
          </div>
          <Link
            to="/mobiles"
            className="flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 group"
          >
            View All
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredMobiles.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promo Banner Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 md:p-12 shadow-lg border border-blue-500/20">
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-2xl"></div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white rounded-full">
              Supercharger Deal
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">Empower Your Workspace</h3>
            <p className="text-sm sm:text-base text-blue-100 font-light leading-relaxed">
              Equip yourself with elite M3 Max MacBook Pros or Intel i9 Dell XPS monsters. Designed for compile speeds, heavy machine learning, or premium gaming sessions.
            </p>
            <div className="pt-2">
              <Link
                to="/laptops"
                className="inline-flex items-center gap-1.5 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl transition-all shadow text-sm"
              >
                Configure Workstation <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Laptops Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FaLaptop className="text-sky-500" />
              Featured Laptops & Workstations
            </h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Unleash peak compute capabilities and luxury screen panels</p>
          </div>
          <Link
            to="/laptops"
            className="flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 group"
          >
            View All
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredLaptops.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
