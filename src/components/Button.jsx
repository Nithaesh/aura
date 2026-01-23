import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', onClick, className = '' }) => {
  const baseStyle = "px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 justify-center";
  
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] border border-transparent",
    secondary: "bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-cyan-400/50",
    glow: "bg-aura-glass border border-violet-500/30 text-violet-200 hover:bg-violet-500/10"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default Button;