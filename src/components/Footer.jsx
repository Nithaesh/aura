import React from 'react';
import { Github, Linkedin, Twitter, Cpu } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-md mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
               <Cpu className="text-violet-500" />
               <span className="font-bold text-xl tracking-tight">AURA</span>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering engineers to master technical interviews through AI-driven simulation.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-cyan-400 cursor-pointer">Features</li>
              <li className="hover:text-cyan-400 cursor-pointer">Pricing</li>
              <li className="hover:text-cyan-400 cursor-pointer">Enterprise</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-cyan-400 cursor-pointer">Blog</li>
              <li className="hover:text-cyan-400 cursor-pointer">Interview Guide</li>
              <li className="hover:text-cyan-400 cursor-pointer">Community</li>
            </ul>
          </div>

          <div>
             <h4 className="font-bold mb-4">Connect</h4>
             <div className="flex gap-4">
                <Github className="text-gray-400 hover:text-white cursor-pointer" size={20} />
                <Linkedin className="text-gray-400 hover:text-white cursor-pointer" size={20} />
                <Twitter className="text-gray-400 hover:text-white cursor-pointer" size={20} />
             </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-12 pt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} AURA Intelligence Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;