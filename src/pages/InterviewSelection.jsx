import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, UserCheck, ArrowRight, Zap, Shield } from 'lucide-react'; // Assuming lucide-react or similar icons

const InterviewSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 animate-fade-in">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
          Select Interview Experience
        </h1>
        <p className="text-gray-400">Choose your environment. Practice with guidance or face the real challenge.</p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* Option 1: Practice Mode */}
        <div 
          onClick={() => navigate('/interview/room/practice')}
          className="group relative bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-blue-500 hover:bg-gray-800 transition-all cursor-pointer duration-300 shadow-lg hover:shadow-blue-500/20"
        >
          <div className="absolute top-4 right-4 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
            RECOMMENDED FOR BEGINNERS
          </div>
          <div className="h-14 w-14 bg-blue-900/50 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
            <UserCheck size={32} />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
            Practice Interview
          </h2>
          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            A guided environment with real-time feedback. The AI acts as a coach, correcting your posture, speaking pace, and eye contact as you go.
          </p>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-sm text-gray-300">
              <Shield className="w-4 h-4 mr-2 text-green-400" /> Real-time posture correction
            </li>
            <li className="flex items-center text-sm text-gray-300">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" /> Instant confidence hints
            </li>
            <li className="flex items-center text-sm text-gray-300">
              <UserCheck className="w-4 h-4 mr-2 text-blue-400" /> Friendly AI persona
            </li>
          </ul>

          <button className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center justify-center">
            Start Practice Session <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>

        {/* Option 2: Realistic Mock Mode */}
        <div 
          onClick={() => navigate('/interview/room/mock')}
          className="group relative bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-purple-500 hover:bg-gray-800 transition-all cursor-pointer duration-300 shadow-lg hover:shadow-purple-500/20"
        >
           <div className="absolute top-4 right-4 bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-semibold">
            PROFESSIONAL MODE
          </div>
          <div className="h-14 w-14 bg-purple-900/50 rounded-xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
            <Briefcase size={32} />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-white group-hover:text-purple-400 transition-colors">
            Realistic Mock Interview
          </h2>
          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            Simulate a high-pressure corporate interview. No hints, no pauses. Pure performance evaluation to test your readiness for the real thing.
          </p>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-sm text-gray-300">
              <Shield className="w-4 h-4 mr-2 text-gray-500" /> No interruptions
            </li>
            <li className="flex items-center text-sm text-gray-300">
              <Zap className="w-4 h-4 mr-2 text-gray-500" /> Post-session analysis only
            </li>
            <li className="flex items-center text-sm text-gray-300">
              <Briefcase className="w-4 h-4 mr-2 text-purple-400" /> Strict professional persona
            </li>
          </ul>

          <button className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors flex items-center justify-center">
            Enter Interview Room <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default InterviewSelection;