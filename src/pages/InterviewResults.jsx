import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, RefreshCw, Home, Download } from 'lucide-react';

// Reusable Score Card Component
const ScoreCard = ({ title, score, color, feedback }) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-gray-400 font-medium">{title}</h3>
      <span className={`text-2xl font-bold ${color}`}>{score}/100</span>
    </div>
    <div className="w-full bg-gray-700 h-2 rounded-full mb-4">
      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${score}%`, backgroundColor: color.replace('text-', 'bg-') }}></div>
    </div>
    <p className="text-sm text-gray-300">{feedback}</p>
  </div>
);

const InterviewResults = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Interview Analysis</h1>
            <p className="text-gray-400">Session ID: #AURA-8829 • Duration: 14:20</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition flex items-center gap-2">
              <Download size={16} /> Report
            </button>
            <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-500 transition flex items-center gap-2">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>

        {/* Top Level Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <ScoreCard 
            title="Technical Accuracy" 
            score={82} 
            color="text-blue-400" 
            feedback="Strong knowledge of React concepts. Defined 'State vs Props' perfectly."
          />
          <ScoreCard 
            title="Communication" 
            score={65} 
            color="text-yellow-400" 
            feedback="Pace was good, but filler words ('umm', 'like') were frequent."
          />
          <ScoreCard 
            title="AURA Score (Presence)" 
            score={90} 
            color="text-purple-400" 
            feedback="Excellent eye contact and posture throughout the session."
          />
        </div>

        {/* Detailed Feedback Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Feedback Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Key Observations</h3>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start">
                  <div className="h-6 w-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-xs shrink-0">✓</div>
                  <div>
                    <h4 className="font-medium text-gray-200">Great situational example</h4>
                    <p className="text-sm text-gray-400 mt-1">Your answer regarding API error handling was practical and demonstrated seniority.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="h-6 w-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-xs shrink-0">!</div>
                  <div>
                    <h4 className="font-medium text-gray-200">Missed Technical Nuance</h4>
                    <p className="text-sm text-gray-400 mt-1">When asked about `useEffect` dependencies, you forgot to mention cleanup functions.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Transcript Highlights</h3>
              <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-400">
                <span className="text-blue-400">AI:</span> How do you optimize a React app?<br/>
                <span className="text-green-400">You:</span> I would use useMemo and React.memo... <span className="text-red-400 italic">[Hesitation detected]</span>... basically to prevent re-renders.
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
             <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                <h3 className="font-semibold mb-4 text-gray-200">Recommended Actions</h3>
                <div className="space-y-3">
                   <button className="w-full text-left p-3 rounded bg-gray-700/50 hover:bg-gray-700 transition text-sm text-gray-300">
                      📖 Review: React Lifecycle Methods
                   </button>
                   <button className="w-full text-left p-3 rounded bg-gray-700/50 hover:bg-gray-700 transition text-sm text-gray-300">
                      🗣️ Practice: Eliminating Filler Words
                   </button>
                </div>
             </div>

             <div className="flex flex-col gap-3">
                <button 
                  onClick={() => navigate('/interview/select')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} /> Retry Interview
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <Home size={18} /> Back to Dashboard
                </button>
             </div>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default InterviewResults;