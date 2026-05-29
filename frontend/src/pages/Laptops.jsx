import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { mockProducts } from '../data/mockProducts';
import ProductCard from '../components/ProductCard';
import { FiSearch, FiSliders, FiRotateCcw } from 'react-icons/fi';

const Laptops = () => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('gadgethub_products');
    return saved ? JSON.parse(saved) : mockProducts;
  });

  // Hybrid strategy: background fetch laptop products
  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        const response = await api.get('/products/laptop');
        if (response.data && response.data.length > 0) {
          const normalizedLaptops = response.data.map((p) => {
            return {
              ...p,
              id: p._id || p.id,
              name: p.title || p.name,
              brand: p.brand || (p.title ? p.title.split(' ')[0] : 'Generic'),
              category: 'Laptops',
              specs: p.specs || {
                screen: "Premium display",
                processor: "Advanced CPU",
                ram: "16GB Unified Memory",
                storage: "512GB SSD",
                battery: "All-day Backup"
              }
            };
          });

          // Merge backend laptops with current mobile state to keep single cache clean
          setProducts((prevProducts) => {
            const mobiles = prevProducts.filter((p) => p.category === 'Mobiles');
            const merged = [...mobiles, ...normalizedLaptops];
            localStorage.setItem('gadgethub_products', JSON.stringify(merged));
            return merged;
          });
        }
      } catch (error) {
        console.error('Failed to background fetch laptops from server:', error.message);
      }
    };

    fetchLaptops();
  }, []);

  const allLaptops = products.filter((p) => p.category === 'Laptops');
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  
  // Extract unique brands for filtering dropdown
  const brands = ['All', ...new Set(allLaptops.map((p) => p.brand))];

  // Filtering & Sorting Logic
  const filteredLaptops = allLaptops
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    })
    .sort((a, b) => {
      if (sortBy === 'Price-LowToHigh') return a.price - b.price;
      if (sortBy === 'Price-HighToLow') return b.price - a.price;
      return 0; // Featured (Default mock order)
    });

  const handleReset = () => {
    setSearchTerm('');
    setSelectedBrand('All');
    setSortBy('Featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Laptops & Workstations</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Power your compilation tasks, visual projects, or game sessions with our high-end rigs</p>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        {/* Search input */}
        <div className="relative flex-grow max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search laptops, processors, RAM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm transition-all"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Brand Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Brand</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            >
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Price Sorting */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            >
              <option value="Featured">Featured</option>
              <option value="Price-LowToHigh">Price: Low to High</option>
              <option value="Price-HighToLow">Price: High to Low</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            title="Reset Filters"
          >
            <FiRotateCcw /> Reset
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredLaptops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredLaptops.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 bg-white dark:bg-slate-900">
          <FiSliders className="w-12 h-12 text-slate-350 dark:text-slate-650 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No laptops match your search</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
            Try adjusting your search keywords, resetting brand selections, or sorting methods.
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 bg-sky-500 text-white font-bold text-xs rounded-xl shadow hover:bg-sky-400 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Laptops;
