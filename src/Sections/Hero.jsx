import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';


const Hero = () => {
  const navigate = useNavigate(); // 2. Initialize the hook

  const handleDashboardClick = () => {
    // 3. Navigate to the path you defined in App.jsx
    navigate('/dashboard'); 
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),rgba(0,0,0,0)_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px]" />

      <div className="max-w-7xl mx-auto px-4 text-center z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-semibold tracking-wide mb-6">
            ✨ V2.0 Now Live: Posture & Eye-Tracking
          </span>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Master Your Interview <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 animate-pulse-slow">
              With Artificial Intelligence
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            AURA reads your resume, sees your body language, and hears your voice. 
            Experience the first multi-modal interview simulation engine.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={handleDashboardClick}>
              Start Interview <ArrowRight size={18} />
            </Button>
            <Button variant="secondary">
              <PlayCircle size={18} /> Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Abstract UI Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 mx-auto max-w-5xl glass-panel rounded-xl p-2 md:p-4 shadow-2xl shadow-violet-900/20"
        >
          <div className="rounded-lg bg-black/50 aspect-video flex items-center justify-center relative overflow-hidden">
             {/* Mock Interface */}
             <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500" />
                   <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="bg-white/10 px-3 py-1 rounded text-xs text-white/70">REC ● 00:14:23</div>
             </div>
             <div className="text-center">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-cyan-500/50 mx-auto flex items-center justify-center mb-4 relative">
                    <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
                    <div className="w-full h-1 bg-cyan-400 absolute top-1/2" />
                </div>
                <p className="text-cyan-300 font-mono text-sm">AURA IS LISTENING...</p>
             </div>
             
             {/* Analytics Floating Cards */}
             <div className="absolute bottom-4 right-4 w-48 glass-panel p-3 rounded border-l-4 border-green-400">
                <p className="text-xs text-gray-400">Eye Contact</p>
                <div className="w-full bg-gray-700 h-1 mt-1 rounded"><div className="bg-green-400 h-1 w-[85%] rounded"></div></div>
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;