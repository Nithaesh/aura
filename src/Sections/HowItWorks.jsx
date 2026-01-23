import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Settings, Video, TrendingUp } from 'lucide-react';

const steps = [
  { id: 1, title: "Upload Resume", icon: Upload, desc: "PDF/DOCX Parsing" },
  { id: 2, title: "Tech Check", icon: Settings, desc: "Cam/Mic/Persona" },
  { id: 3, title: "Live Session", icon: Video, desc: "30-Min AI Interview" },
  { id: 4, title: "Get Analytics", icon: TrendingUp, desc: "Score & Feedback" },
];

const HowItWorks = () => {
  return (
    <section id="howitworks" className="py-24 bg-gradient-to-b from-transparent to-violet-950/20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">The Journey</h2>
        
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-violet-500/0 via-violet-500/50 to-violet-500/0 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center mb-6 border border-violet-500/30 relative">
                  <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-md" />
                  <step.icon size={28} className="text-white relative z-10" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-black">
                    {step.id}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;