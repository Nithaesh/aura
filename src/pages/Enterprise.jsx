import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Enterprise = () => {
  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-blue-500/30">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-32 px-6 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Scale with <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Confidence
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            Aura Enterprise offers dedicated infrastructure, advanced security controls, and 24/7 priority support for mission-critical applications.
          </p>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-1 h-full min-h-[50px] bg-blue-500 rounded-full"></div>
              <div>
                <h3 className="text-lg font-bold text-white">SSO & Advanced Security</h3>
                <p className="text-gray-500 text-sm">SAML, LDAP, and custom retention policies.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 h-full min-h-[50px] bg-indigo-500 rounded-full"></div>
              <div>
                <h3 className="text-lg font-bold text-white">Dedicated Infrastructure</h3>
                <p className="text-gray-500 text-sm">Isolated VPCs and custom deployment regions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-6">Contact Sales</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider">First Name</label>
                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Last Name</label>
                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider">Work Email</label>
              <input type="email" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider">Message</label>
              <textarea rows="4" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors"></textarea>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity mt-2">
              Request Demo
            </button>
          </form>
        </div>

      </div>
      
      <Footer />
    </div>
  );
};

export default Enterprise;