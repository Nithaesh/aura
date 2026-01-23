import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Mic, Eye, Users, Zap, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: <FileText className="text-violet-400" />,
    title: "Resume Intelligence",
    desc: "Drag & drop your PDF. AURA parses your tech stack and generates specific, probing questions about your actual projects."
  },
  {
    icon: <Mic className="text-cyan-400" />,
    title: "Immersive Voice",
    desc: "Hands-free conversation using WebSpeech API. AURA speaks with human-like intonation and waits for your full response."
  },
  {
    icon: <Eye className="text-pink-400" />,
    title: "Behavioral Analysis",
    desc: "Computer vision tracks your posture, lighting, and eye contact drift to ensure you look professional on camera."
  },
  {
    icon: <Users className="text-amber-400" />,
    title: "Adaptive Personas",
    desc: "Choose your interviewer: The Friendly Recruiter, The Strict Tech Lead, or The Behavioral Specialist."
  },
  {
    icon: <Zap className="text-emerald-400" />,
    title: "Real-Time Feedback",
    desc: "Instant toast notifications for speaking too fast, using filler words, or looking away from the camera."
  },
  {
    icon: <BarChart3 className="text-blue-400" />,
    title: "Post-Interview Analytics",
    desc: "Deep dive into your Communication Score, Technical Accuracy, and Sentiment Analysis with granular charts."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Full-Stack Assessment</h2>
          <p className="text-gray-400">Everything you need to crack the FAANG interview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {React.cloneElement(feature.icon, { size: 24 })}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;