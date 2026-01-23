import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cpu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; // <--- 1. Import Link and useLocation
import Button from './Button';

const Navbar = ({ onOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Useful if you want to highlight active links later

  // 2. Updated links to include your new pages and handle scrolling vs routing
  const navLinks = [
    { name: 'Features', path: '/#features', type: 'scroll' }, // Points to home ID
    { name: 'Community', path: '/community', type: 'page' },
    { name: 'Blog', path: '/blog', type: 'page' },
    { name: 'Guidelines', path: '/guidelines', type: 'page' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* --- CHANGE 1: Wrapped Logo in Link to="/" --- */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all">
              <Cpu size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">AURA</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.type === 'scroll' ? (
                // Use standard <a> for scrolling to IDs on the home page
                <a 
                  key={link.name} 
                  href={link.path} 
                  className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                  {link.name}
                </a>
              ) : (
                // Use <Link> for routing to new pages
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
            
            <Button variant="secondary" className="!py-2 !px-4 text-sm" onClick={onOpenAuth}>
              Login / Signup
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-b border-white/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                link.type === 'scroll' ? (
                  <a 
                    key={link.name} 
                    href={link.path} 
                    onClick={() => setIsOpen(false)}
                    className="block text-gray-300 hover:text-white text-lg"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    className="block text-gray-300 hover:text-white text-lg"
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <div className="pt-4">
                <Button variant="primary" className="w-full" onClick={() => { setIsOpen(false); onOpenAuth(); }}>
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
