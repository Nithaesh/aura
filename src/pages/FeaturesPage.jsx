import React from 'react';
import { Cpu, Shield, Zap, Globe, Database, Layers } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FeaturesPage = () => {
  const featuresList = [
    {
      icon: <Zap className="text-yellow-400" />,
      title: "Lightning Fast",
      description: "Optimized for speed with edge caching and <50ms latency globally."
    },
    {
      icon: <Shield className="text-green-400" />,
      title: "Bank-Grade Security",
      description: "AES-256 encryption at rest and in transit. SOC2 Type II compliant."
    },
    {
      icon: <Cpu className="text-purple-400" />,
      title: "AI-Powered Analytics",
      description: "Predictive insights powered by our proprietary machine learning models."
    },
    {
      icon: <Globe className="text-blue-400" />,
      title: "Global Infrastructure",
      description: "Deployed across 35+ regions worldwide for maximum availability."
    },
    {
      icon: <Database className="text-red-400" />,
      title: "Real-time Sync",
      description: "Data syncs across all client devices instantly via WebSockets."
    },
    {
      icon: <Layers className="text-cyan-400" />,
      title: "Infinite Scalability",
      description: "Auto-scaling infrastructure that grows with your user base."
    }
  ];

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-purple-500/30">
      <Navbar />
      
      <div className="max-w-6xl mx-auto pt-32 px-6 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Power Under the Hood
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to build world-class applications, packaged in a beautiful interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <div key={index} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.08] transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FeaturesPage;