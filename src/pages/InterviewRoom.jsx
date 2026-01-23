import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, Video, VideoOff, PhoneOff, AlertCircle } from 'lucide-react';

const InterviewRoom = () => {
  const { mode } = useParams(); // 'mock' or 'practice'
  const navigate = useNavigate();
  const [status, setStatus] = useState('listening'); // listening, thinking, speaking
  const [timer, setTimer] = useState(0);

  // Simulation: Increment timer
  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const endSession = () => {
    navigate('/interview/results');
  };

  return (
    <div className="h-screen bg-black flex flex-col relative overflow-hidden">
      
      {/* 1. TOP BAR */}
      <div className="absolute top-0 w-full z-10 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className={`h-3 w-3 rounded-full animate-pulse ${mode === 'practice' ? 'bg-blue-500' : 'bg-red-500'}`} />
          <span className="text-gray-200 font-mono text-sm tracking-wider uppercase">
            {mode} SESSION • {formatTime(timer)}
          </span>
        </div>
        
        {/* Practice Mode Only: Live Stats */}
        {mode === 'practice' && (
           <div className="hidden md:flex gap-4">
             <span className="px-3 py-1 bg-gray-800/60 rounded-full text-xs text-green-400 border border-green-500/30">
               Posture: Good
             </span>
             <span className="px-3 py-1 bg-gray-800/60 rounded-full text-xs text-yellow-400 border border-yellow-500/30">
               Voice: Clear
             </span>
           </div>
        )}
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex items-center justify-center relative">
        
        {/* AI AVATAR (Center Stage) */}
        <div className="relative z-0 flex flex-col items-center justify-center">
           {/* Placeholder for WebGL Avatar */}
           <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-pulse-slow blur-sm absolute opacity-20"></div>
           <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-gray-700 bg-gray-900 flex items-center justify-center relative shadow-2xl shadow-purple-900/50">
             <div className="text-center space-y-2">
                <div className="flex gap-1 justify-center items-center h-8">
                    {/* Audio Wave Animation */}
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className={`w-1 bg-purple-400 rounded-full animate-wave h-${status === 'speaking' ? '8' : '2'} transition-all duration-300`} style={{animationDelay: `${i * 0.1}s`}}></div>
                    ))}
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-widest">{status}</span>
             </div>
           </div>
        </div>

        {/* PRACTICE MODE OVERLAYS (The "HUD") */}
        {mode === 'practice' && (
          <div className="absolute right-10 top-1/4 space-y-4 w-64 hidden lg:block">
            <div className="bg-gray-900/80 backdrop-blur-md border-l-4 border-yellow-500 p-4 rounded-r-lg animate-slide-in-right">
              <div className="flex items-start gap-3">
                 <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                 <div>
                   <h4 className="text-sm font-bold text-gray-200">Eye Contact</h4>
                   <p className="text-xs text-gray-400 mt-1">You are looking down too often. Try to focus on the camera.</p>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. USER PREVIEW (PIP) */}
      <div className="absolute bottom-24 right-6 w-48 h-32 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
         <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <span className="text-xs text-gray-500">Camera Feed</span>
            {/* Real <Webcam /> would go here */}
         </div>
         {mode === 'practice' && (
           <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-[10px] text-white rounded">
             Detecting...
           </div>
         )}
      </div>

      {/* 4. CONTROLS FOOTER */}
      <div className="h-24 bg-gray-900 border-t border-gray-800 flex items-center justify-center gap-6">
         <button className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors">
            <Mic size={24} />
         </button>
         <button 
           onClick={endSession}
           className="px-8 py-3 rounded-full bg-red-600/90 hover:bg-red-600 text-white font-medium flex items-center gap-2 transition-all hover:scale-105"
         >
            <PhoneOff size={20} /> End Interview
         </button>
         <button className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors">
            <Video size={24} />
         </button>
      </div>

    </div>
  );
};

export default InterviewRoom;