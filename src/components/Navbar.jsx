import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cpu } from 'lucide-react';
import Button from './Button';

const Navbar = ({ onOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);

  const links = ['Features', 'How It Works', 'Dashboard'];

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center">
              <Cpu size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">AURA</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(/\s/g, '')}`} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                {link}
              </a>
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
              {links.map((link) => (
                <a key={link} href="#" className="block text-gray-300 hover:text-white text-lg">
                  {link}
                </a>
              ))}
              <div className="pt-4">
                <Button variant="primary" className="w-full" onClick={onOpenAuth}>Get Started</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;