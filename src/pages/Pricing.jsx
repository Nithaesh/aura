import React from 'react';
import { Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "/mo",
      description: "Perfect for hobby projects.",
      features: ["1 User", "5 Projects", "Community Support", "1GB Storage"],
      cta: "Start Free",
      highlight: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mo",
      description: "For growing teams and startups.",
      features: ["Up to 10 Users", "Unlimited Projects", "Priority Support", "100GB Storage", "Analytics Dashboard"],
      cta: "Get Started",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large scale organizations.",
      features: ["Unlimited Users", "SSO & Audit Logs", "Dedicated Account Manager", "Unlimited Storage", "SLA Guarantee"],
      cta: "Contact Sales",
      highlight: false
    }
  ];

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-green-500/30">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-32 px-6 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-400 text-lg">
            Choose the plan that fits your needs. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative p-8 rounded-3xl border flex flex-col ${
                plan.highlight 
                  ? 'bg-white/10 border-green-500/50 shadow-2xl shadow-green-900/20 transform scale-105 z-10' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-medium text-gray-300 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm mt-4">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <Check size={18} className="text-green-400" />
                    {feat}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                plan.highlight 
                  ? 'bg-green-500 hover:bg-green-400 text-black' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Pricing;