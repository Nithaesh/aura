import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  ShieldCheck, 
  Zap, 
  ScanFace, 
  Activity, 
  Globe 
} from 'lucide-react';

const specs = [
  {
    icon: <Cpu className="text-cyan-400" size={32} />,
    title: "LLM Engine",
    value: "GPT-4 Turbo",
    desc: "Context-aware responses tailored to your resume."
  },
  {
    icon: <Zap className="text-yellow-400" size={32} />,
    title: "Latency",
    value: "< 500ms",
    desc: "Real-time voice processing with zero lag."
  },
  {
    icon: <ScanFace className="text-violet-400" size={32} />,
    title: "Computer Vision",
    value: "60FPS Tracking",
    desc: "Analyzes micro-expressions and posture stability."
  },
  {
    icon: <ShieldCheck className="text-green-400" size={32} />,
    title: "Security",
    value: "AES-256",
    desc: "End-to-end encryption for all video & audio data."
  },
  {
    icon: <Activity className="text-pink-400" size={32} />,
    title: "Audio Analysis",
    value: "Biometric Voice",
    desc: "Detects tone confidence, stuttering, and pace."
  },
  {
    icon: <Globe className="text-blue-400" size={32} />,
    title: "Accessibility",
    value: "WebAssembly",
    desc: "Runs locally in browser. No downloads required."
  }
];

const TechSpecs = () => {
  return (
    <section className="py-24 relative bg-black overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(139,92,246,0.1),rgba(0,0,0,0)_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Performance</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our multi-modal engine processes audio, video, and text simultaneously to give you the most accurate interview feedback loop in the industry.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specs.map((spec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-white/5 group-hover:scale-110 transition-transform duration-300">
                  {spec.icon}
                </div>
                <span className="text-xl font-bold font-mono text-white/90">{spec.value}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">{spec.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {spec.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TechSpecs;