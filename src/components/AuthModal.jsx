import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Mail } from 'lucide-react';
import Button from './Button';
// Add these imports at the top
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust path if your config is in a different folder
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Logged in user:", result.user);

      // Close the modal upon successful login
      onClose();
navigate('/dashboard');
      // Optional: Redirect user or save to context here
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };
  // ------------------------

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden"
        >
          {/* Decor element */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/30 rounded-full blur-3xl" />

          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Join AURA'}</h2>
          <p className="text-gray-400 text-sm mb-6">Access your AI interview dashboard.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={16} />
                <input type="email" placeholder="you@example.com" className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 text-sm focus:outline-none focus:border-violet-500 transition-colors text-white" />
              </div>
            </div>

            <Button variant="primary" className="w-full !py-2.5">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-xs"><span className="bg-[#15151a] px-2 text-gray-500">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors border border-white/5">
                <Github size={16} /> GitHub
              </button>
              <button
                onClick={handleGoogleLogin} // 1. Attach the function here
                className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors border border-white/5"
              >
                {/* 2. Added Google Icon SVG for better UI */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-cyan-400 hover:underline">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
