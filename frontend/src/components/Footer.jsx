import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiFacebook, FiInstagram, FiGithub } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
                GadgetHub
              </span>
              <div className="w-2.5 h-2.5 rounded-full bg-sky-400"></div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Your premium destination for industry-leading laptops and mobile phones. Elevate your digital life with GadgetHub's handpicked, elite gear.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-sky-400 transition-colors"><FiTwitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-sky-400 transition-colors"><FiFacebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-sky-400 transition-colors"><FiInstagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-sky-400 transition-colors"><FiGithub className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Shop Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/mobiles" className="hover:text-sky-400 transition-colors">Mobile Phones</Link>
              </li>
              <li>
                <Link to="/laptops" className="hover:text-sky-400 transition-colors">Laptops & Workstations</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-sky-400 transition-colors">Featured Selections</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-sky-400 transition-colors">Special Offers</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Support & Trust</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">Contact Support</a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">Shipping & Returns</a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Corporate Office</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                <span>100 Technology Drive, Suite 500, Silicon Valley, CA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>+1 (800) GADGETS</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>contact@gadgethub.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} GadgetHub Inc. All rights reserved.</p>
          <p>Designed for portfolio validation. Built with React and Tailwind.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
