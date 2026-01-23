import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import {
    LayoutDashboard, Video, History, BarChart2, FileText,
    Zap, Settings, Bell, ChevronRight, TrendingUp,
    TrendingDown, Eye, Activity, Mic, Brain, Play,
    Upload, X, CheckCircle, Loader, AlertCircle, Sparkles,
    Target, Award, Search, User, CreditCard, Calendar, Filter,
    LogOut, Shield, Moon, Globe, HelpCircle, MicOff, PhoneMissed, 
    MessageSquare, AlertTriangle, Share, Download, Clock, Cpu, UserCheck
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as pdfjsLib from 'pdfjs-dist';
import { Link } from 'react-router-dom';

// PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// Configuration
const CLOUDINARY_CLOUD_NAME = "dnho9lqde";
const CLOUDINARY_UPLOAD_PRESET = "resume_upload";
const GEMINI_API_KEY = "AIzaSyB_1uIYtEiPF5LRWQMzjapM6dY3OLSLctY"; 

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// --- 1. UTILITIES & MOCK DATA ---

// Extract Text from PDF
const extractTextFromPDF = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(" ");
            fullText += pageText + "\n";
        }
        return fullText;
    } catch (error) {
        console.error("PDF Extraction Error:", error);
        throw new Error("Failed to parse PDF. Please ensure the file is not corrupted.");
    }
};

const NEW_USER_DATA = {
    joinedAt: new Date().toISOString(),
    overallScore: 0,
    performanceData: [
        { day: 'Mon', score: 0 }, { day: 'Tue', score: 0 }, { day: 'Wed', score: 0 },
        { day: 'Thu', score: 0 }, { day: 'Fri', score: 0 }, { day: 'Sat', score: 0 }, { day: 'Sun', score: 0 }
    ],
    skillData: [
        { subject: 'Communication', A: 0, fullMark: 150 }, { subject: 'Tech Clarity', A: 0, fullMark: 150 },
        { subject: 'Body Lang', A: 0, fullMark: 150 }, { subject: 'Eye Contact', A: 0, fullMark: 150 },
        { subject: 'Tone', A: 0, fullMark: 150 }, { subject: 'Confidence', A: 0, fullMark: 150 },
    ],
    history: [], 
    analysis: null 
};

// Mock History Data (for UI display)
const mockHistory = [
    { id: 1, type: 'Technical (React)', date: '2023-10-24', duration: '45m', score: 92, status: 'Completed' },
    { id: 2, type: 'Behavioral', date: '2023-10-22', duration: '30m', score: 78, status: 'Completed' },
];

const mockFeedback = [
    { category: 'Voice', title: 'Pacing Issue', desc: 'You tend to speak too fast (160wpm).', severity: 'medium' },
    { category: 'Visual', title: 'Low Eye Contact', desc: 'Eye contact dropped to 40%.', severity: 'high' },
    { category: 'Content', title: 'Strong Structure', desc: 'STAR method usage was excellent.', severity: 'positive' },
];

// Helper Functions
const getColorClasses = (color) => {
    const variants = {
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', hover: 'group-hover:bg-purple-500/20', stroke: '#a855f7' },
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', hover: 'group-hover:bg-blue-500/20', stroke: '#3b82f6' },
        cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', hover: 'group-hover:bg-cyan-500/20', stroke: '#22d3ee' },
        emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', hover: 'group-hover:bg-emerald-500/20', stroke: '#10b981' },
        red: { bg: 'bg-red-500/10', text: 'text-red-400', hover: 'group-hover:bg-red-500/20', stroke: '#ef4444' },
    };
    return variants[color] || variants.purple;
};

// Animations
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } } };

// --- 2. COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, id, active, onClick }) => (
    <div onClick={() => onClick(id)} className={`group flex items-center p-3 my-1 rounded-xl cursor-pointer transition-all duration-300 ${active ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-l-4 border-cyan-400 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
        <Icon size={20} className={`${active ? 'text-cyan-400' : 'group-hover:text-purple-400 transition-colors'}`} />
        <span className="ml-3 font-medium text-sm tracking-wide">{label}</span>
    </div>
);

const MetricCard = ({ icon: Icon, label, value, trend, trendValue, color }) => {
    const styles = getColorClasses(color);
    return (
        <motion.div whileHover={{ y: -5 }} className="relative overflow-hidden bg-gray-900/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${styles.bg} rounded-full blur-2xl -mr-10 -mt-10 transition-all ${styles.hover}`} />
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${styles.bg} ${styles.text}`}><Icon size={22} /></div>
                {trend && (
                    <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {trend === 'up' ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}{trendValue}
                    </div>
                )}
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
            <p className="text-gray-400 text-sm font-medium">{label}</p>
        </motion.div>
    );
};

const UploadModal = ({ isOpen, onClose, onUpload }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e) => { if (e.target.files[0]) setFile(e.target.files[0]); };

    const handleUploadClick = async () => {
        if (!file) return;
        setUploading(true);
        try {
            await onUpload(file);
            onClose();
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400"><Upload size={32} /></div>
                    <h2 className="text-2xl font-bold text-white">Upload Resume</h2>
                    <p className="text-gray-400 text-sm mt-2">Upload your PDF resume to unlock personalized analysis.</p>
                </div>
                <div className="border-2 border-dashed border-gray-700 hover:border-purple-500/50 rounded-xl p-8 mb-6 transition-colors text-center cursor-pointer relative">
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    {file ? <div className="flex items-center justify-center gap-2 text-green-400 font-medium"><CheckCircle size={20} />{file.name}</div> : <span className="text-gray-500 text-sm">Drag & drop or click to browse</span>}
                </div>
                <button onClick={handleUploadClick} disabled={!file || uploading} className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${!file || uploading ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-900/20'}`}>
                    {uploading ? <Loader className="animate-spin" /> : "Upload & Analyze"}
                </button>
            </motion.div>
        </div>
    );
};

// --- 3. INTERVIEW COMPONENTS ---

const InterviewSelection = ({ onSelectMode }) => (
  <div className="h-full flex flex-col justify-center items-center max-w-5xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-white mb-4">Select Interview Experience</h2>
      <p className="text-gray-400">Choose how you want to practice today.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      <div className="bg-gray-900/40 border border-white/10 p-8 rounded-3xl cursor-pointer hover:border-purple-500 transition-all" onClick={() => onSelectMode('mock')}>
        <div className="mb-6 text-purple-400"><Cpu size={32} /></div>
        <h3 className="text-2xl font-bold text-white mb-2">AI Mock Interview</h3>
        <p className="text-gray-400 text-sm">Realistic simulation. No hints.</p>
      </div>
      <div className="bg-gray-900/40 border border-white/10 p-8 rounded-3xl cursor-pointer hover:border-cyan-500 transition-all" onClick={() => onSelectMode('practice')}>
        <div className="mb-6 text-cyan-400"><UserCheck size={32} /></div>
        <h3 className="text-2xl font-bold text-white mb-2">Practice & Coach</h3>
        <p className="text-gray-400 text-sm">Guided session with feedback.</p>
      </div>
    </div>
  </div>
);

const InterviewSession = ({ mode, onEndSession, onReportGenerated }) => {
  const [status, setStatus] = useState("connecting");
  const [messages, setMessages] = useState([]);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const socketRef = useRef(null);
  const recognitionRef = useRef(null);
  const transcriptBuffer = useRef("");
  const audioRef = useRef(new Audio());
  const webcamRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8000/ws/interview");
    socketRef.current.onopen = () => setStatus("intro");
    socketRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "audio_response") {
        setStatus("ai_speaking");
        transcriptBuffer.current = "";
        setLiveTranscript("");
        setMessages((p) => [...p, { sender: "ai", text: data.text }]);
        if (data.audio) {
          audioRef.current.src = `data:audio/wav;base64,${data.audio}`;
          await audioRef.current.play();
          audioRef.current.onended = () => { setStatus("user_speaking"); startListening(); };
        } else { setTimeout(() => { setStatus("user_speaking"); startListening(); }, 3000); }
      } else if (data.type === "feedback" && mode === 'practice') {
        setFeedback(data.message); setTimeout(() => setFeedback(null), 3000);
      } else if (data.type === "report") {
          onReportGenerated(data.data); onEndSession();
      }
    };
    let interval;
    if (mode === 'practice') {
        interval = setInterval(() => {
            if (webcamRef.current && socketRef.current?.readyState === WebSocket.OPEN) {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) socketRef.current.send(JSON.stringify({ type: "video_frame", image: imageSrc }));
            }
        }, 1000);
    }
    return () => { socketRef.current?.close(); recognitionRef.current?.stop(); if(interval) clearInterval(interval); };
  }, [mode]);

  const startListening = () => {
    if (status === 'ai_speaking') return;
    if (recognitionRef.current) recognitionRef.current.stop();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = true; rec.interimResults = true; rec.lang = "en-US";
    rec.onresult = (e) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) { text += e.results[i][0].transcript; }
      transcriptBuffer.current = text; setLiveTranscript(text);
    };
    rec.start(); recognitionRef.current = rec; setStatus("user_speaking");
  };

  const sendResponse = () => {
    recognitionRef.current?.stop();
    const textToSend = transcriptBuffer.current || liveTranscript || "...";
    if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: "user_stopped_speaking", text: textToSend }));
        setMessages((p) => [...p, { sender: "user", text: textToSend }]);
        transcriptBuffer.current = ""; setLiveTranscript(""); setStatus("thinking");
    }
  };

  const handleEndClick = () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
          setIsGenerating(true);
          socketRef.current.send(JSON.stringify({ type: "end_session" }));
      } else { onEndSession(); }
  };

  if (isGenerating) return <div className="h-full flex items-center justify-center"><Loader className="animate-spin text-purple-500" size={48}/><p className="ml-4 text-white">Generating Report...</p></div>;

  // Inside InterviewSession component...
  
  // REPLACE the return statement with this:
  // Inside InterviewSession... replace the return statement with this:
  return (
    <div className="h-full w-full bg-black flex flex-col relative">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex justify-between bg-gray-900/50 shrink-0">
        <h2 className="text-lg font-semibold flex items-center gap-2">
            Live Interview {mode === 'practice' && <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">PRACTICE MODE</span>}
        </h2>
        <span className="text-sm text-gray-400 capitalize">{status.replace('_', ' ')}</span>
      </div>

      {/* Video Area - Force Full Height & Width */}
      <div className="flex-1 p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        {/* AI Container */}
        <div className="bg-gray-900 border border-white/10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden h-full w-full">
          <div className={`absolute inset-0 bg-purple-600/10 ${status === 'ai_speaking' ? 'animate-pulse' : ''}`} />
          <img src="/avatar/interviewer.png" alt="AI Interviewer" className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover mb-4 relative z-10 border-4 border-white/10 shadow-2xl" onError={(e) => e.target.style.display = 'none'} />
          <span className="text-gray-300 text-sm relative z-10 font-medium tracking-wide">Aura • Interviewer</span>
        </div>

        {/* User Container */}
        <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden relative h-full w-full">
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" mirrored className="w-full h-full object-cover" />
          
          <AnimatePresence>
            {feedback && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-2xl z-50">
                    <AlertTriangle size={20} />
                    <span className="whitespace-nowrap">{feedback}</span>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Transcript & Controls Bar */}
      <div className="bg-[#050505] border-t border-white/10 p-4 shrink-0">
          <div className="text-center mb-4 h-8">
            <p className="text-lg font-medium animate-fade-in line-clamp-1">
                {status === "ai_speaking" ? <span className="text-white">“{messages.filter((m) => m.sender === "ai").slice(-1)[0]?.text}”</span> : <span className="text-cyan-400">{liveTranscript || (status === 'thinking' ? "Thinking..." : "Listening...")}</span>}
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={sendResponse} className="px-8 py-3 bg-green-600 rounded-xl font-bold hover:bg-green-500 transition-all shadow-lg shadow-green-900/20">Done Speaking</button>
            <button onClick={handleEndClick} className="px-6 py-3 bg-red-600/10 border border-red-600/50 text-red-500 rounded-xl hover:bg-red-600/20 transition-all">End Interview</button>
          </div>
      </div>
    </div>
  );
};

// --- INTERVIEW RESULTS (PRO UI) ---
// --- INTERVIEW RESULTS (CRASH PROOF VERSION) ---
const InterviewResults = ({ onBack, data }) => {
    // 1. Safe Destructuring with Defaults (Prevents "Undefined" crashes)
    const {
        overallScore = 0,
        summary = "No data available.",
        ratings = [],
        strengths = [],
        improvements = [],
        behavioral = { eyeContact: "N/A", posture: "N/A", note: "No data" }
    } = data || {};

    const sessionDuration = "14:25"; 

    // 2. Use the safe 'ratings' array for the Chart
    const radarData = ratings.length > 0 ? ratings.map(r => ({
        subject: r.category || "Skill", 
        A: r.score || 0, 
        fullMark: 100
    })) : [
        { subject: 'Technical', A: 0, fullMark: 100 }, 
        { subject: 'Communication', A: 0, fullMark: 100 }, 
        { subject: 'Confidence', A: 0, fullMark: 100 }
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center border-b border-white/10 pb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Sparkles className="text-yellow-400" /> Interview Analysis
                    </h2>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span>Detailed AI breakdown</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <span className="flex items-center gap-1.5 text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                            <Clock size={14} /> Duration: {sessionDuration}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm text-gray-300"><Share size={16}/> Share</button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm text-gray-300"><Download size={16}/> PDF</button>
                    <button onClick={onBack} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/20">Back to Dashboard</button>
                </div>
            </div>

            {/* Top Row: Score & Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Score Card */}
                <div className="bg-gradient-to-br from-gray-900 via-[#0a0a0a] to-black border border-white/10 p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xl group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700" />
                    <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                        <svg className="transform -rotate-90 w-48 h-48">
                            <circle cx="96" cy="96" r="88" stroke="#1f2937" strokeWidth="12" fill="transparent" />
                            <motion.circle 
                                initial={{ strokeDashoffset: 552 }} 
                                animate={{ strokeDashoffset: 552 - (overallScore / 100) * 552 }} 
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                cx="96" cy="96" r="88" 
                                stroke="url(#gradientScore)" 
                                strokeWidth="12" 
                                fill="transparent" 
                                strokeDasharray={552} 
                                strokeLinecap="round" 
                                className="drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
                            />
                            <defs>
                                <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute text-center">
                            <span className="text-6xl font-bold text-white block tracking-tighter">{overallScore}</span>
                            <span className="text-xs text-gray-400 uppercase tracking-[0.2em]">Score</span>
                        </div>
                    </div>
                    <p className="text-gray-400 text-center text-sm leading-relaxed px-2 border-t border-white/5 pt-4 w-full">
                        "{summary}"
                    </p>
                </div>

                {/* Radar Chart */}
                <div className="lg:col-span-2 bg-gray-900/60 border border-white/10 p-6 rounded-3xl flex flex-col justify-center relative backdrop-blur-md">
                    <h3 className="text-lg font-bold text-gray-200 mb-4 pl-2 border-l-4 border-blue-500">Skill Distribution</h3>
                    <div className="flex-1 w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#333" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="User" dataKey="A" stroke="#22d3ee" strokeWidth={3} fill="#22d3ee" fillOpacity={0.15} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#22d3ee' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Metrics & Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Detailed Metrics */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Target className="text-cyan-400"/> Metric Breakdown</h3>
                    </div>
                    
                    <div className="space-y-4">
                        {ratings.length > 0 ? ratings.map((item, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 border border-white/5 p-5 rounded-2xl hover:bg-white/10 transition-colors hover:border-white/10 group"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-semibold text-gray-200 group-hover:text-white transition-colors">{item.category}</span>
                                    <span className={`font-bold px-2 py-1 rounded text-xs ${item.score > 80 ? 'bg-green-500/20 text-green-400' : item.score > 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {item.score}/100
                                    </span>
                                </div>
                                <div className="w-full bg-gray-800 h-2 rounded-full mb-3 overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: `${item.score}%` }} 
                                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                        className={`h-full rounded-full shadow-[0_0_10px_currentColor] ${item.score > 80 ? 'bg-green-500 text-green-500' : item.score > 60 ? 'bg-yellow-500 text-yellow-500' : 'bg-red-500 text-red-500'}`} 
                                    />
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">{item.feedback}</p>
                            </motion.div>
                        )) : (
                            <p className="text-gray-500 italic">No detailed metrics available yet.</p>
                        )}
                    </div>
                </div>

                {/* Behavioral & Qualitative */}
                <div className="space-y-6">
                    {/* Behavioral Card */}
                    <div className="bg-gradient-to-br from-blue-900/10 to-transparent border border-blue-500/20 p-6 rounded-3xl">
                       <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Eye className="text-blue-400"/> AI Behavioral Analysis</h3>
                       <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center backdrop-blur-md">
                               <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Eye Contact</span>
                               <div className={`text-xl font-bold mt-1 ${(behavioral?.eyeContact || "").includes('Good') ? 'text-green-400' : 'text-yellow-400'}`}>
                                   {behavioral?.eyeContact || "N/A"}
                               </div>
                           </div>
                           <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center backdrop-blur-md">
                               <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Posture</span>
                               <div className={`text-xl font-bold mt-1 ${(behavioral?.posture || "").includes('Good') ? 'text-green-400' : 'text-yellow-400'}`}>
                                   {behavioral?.posture || "N/A"}
                               </div>
                           </div>
                       </div>
                       <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                            <p className="text-sm text-blue-200 italic text-center">"{behavioral?.note || "No video data detected."}"</p>
                       </div>
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="bg-gray-900/40 border border-white/10 p-6 rounded-3xl">
                       <div className="mb-6">
                           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Award size={16} className="text-green-400"/> Top Strengths</h3>
                           <ul className="space-y-2">
                               {strengths.length > 0 ? strengths.map((s, i) => (
                                   <li key={i} className="flex gap-3 text-sm text-white/80 bg-white/5 p-3 rounded-xl border border-white/5">
                                       <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5"/> {s}
                                   </li>
                               )) : <li className="text-gray-500 text-sm">No specific strengths detected.</li>}
                           </ul>
                       </div>
                       
                       <div>
                           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-red-400"/> Areas to Improve</h3>
                           <ul className="space-y-2">
                               {improvements.length > 0 ? improvements.map((s, i) => (
                                   <li key={i} className="flex gap-3 text-sm text-white/80 bg-white/5 p-3 rounded-xl border border-white/5">
                                       <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5"/> {s}
                                   </li>
                               )) : <li className="text-gray-500 text-sm">No specific improvements detected.</li>}
                           </ul>
                       </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ScanningLoader = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] relative overflow-hidden">
        <div className="w-64 h-80 border-2 border-cyan-500/30 rounded-lg relative bg-black/40 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.1)]">
            <motion.div animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] z-10" />
            <FileText size={48} className="text-gray-600 opacity-50" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
        </div>
        <div className="mt-8 text-center space-y-2">
            <h3 className="text-xl font-bold text-white tracking-widest uppercase">AURA Analyzing</h3>
            <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-cyan-400 text-sm font-mono">Extracting insights from your resume...</motion.p>
        </div>
    </div>
);

// History View
const HistoryView = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Interview History</h2>
            <div className="flex gap-2">
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm flex items-center gap-2 hover:bg-white/10 transition-colors"><Filter size={14} /> Filter</button>
            </div>
        </div>
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                        <th className="p-4 font-medium">Type</th>
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Score</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Action</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {mockHistory.map((item) => (
                        <motion.tr key={item.id} variants={itemVariants} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-4 flex items-center gap-3"><span className="font-semibold text-white">{item.type}</span></td>
                            <td className="p-4 text-gray-400"><div className="flex items-center gap-2"><Calendar size={14} /> {item.date}</div></td>
                            <td className="p-4"><span className={`font-bold ${item.score > 80 ? 'text-green-400' : 'text-yellow-400'}`}>{item.score > 0 ? `${item.score}%` : '--'}</span></td>
                            <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium border ${item.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>{item.status}</span></td>
                            <td className="p-4"><button className="text-gray-500 hover:text-white transition-colors"><ChevronRight size={18} /></button></td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    </motion.div>
);

// Feedback View
const FeedbackView = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 p-8 rounded-3xl relative overflow-hidden">
                <Sparkles className="absolute top-6 right-6 text-yellow-400 animate-pulse" />
                <h2 className="text-2xl font-bold text-white mb-4">AI Analysis Summary</h2>
                <p className="text-gray-300 text-lg leading-relaxed">Based on your last sessions, your technical accuracy is high. However, focus on <span className="text-white font-bold">pacing</span> and <span className="text-purple-400">eye contact</span>.</p>
            </div>
            <div className="bg-gray-900/60 border border-white/10 p-6 rounded-3xl flex flex-col justify-center items-center text-center">
                <div className="w-20 h-20 rounded-full border-4 border-green-500/30 flex items-center justify-center mb-4 text-3xl font-bold text-green-400 relative">A-</div>
                <div className="text-sm text-gray-400 font-medium">Communication Grade</div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFeedback.map((item, idx) => (
                <motion.div key={idx} variants={itemVariants} className={`p-6 rounded-2xl border ${item.severity === 'positive' ? 'bg-green-500/5 border-green-500/20' : item.severity === 'high' ? 'bg-red-500/5 border-red-500/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
                    <div className="flex justify-between items-start mb-4"><span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${item.severity === 'positive' ? 'bg-green-500/20 text-green-400' : item.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{item.category}</span></div>
                    <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                </motion.div>
            ))}
        </div>
    </motion.div>
);

// Settings View
const SettingsView = ({ userEmail, userName, userPhoto, onLogout }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [emailUpdates, setEmailUpdates] = useState(false);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'security', label: 'Security', icon: Shield }
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-2">
                {tabs.map(tab => (
                    <motion.button
                        key={tab.id}
                        whileHover={{ x: 5 }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-white/10' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <tab.icon size={18} /> {tab.label}
                    </motion.button>
                ))}
            </div>

            <div className="lg:col-span-3 bg-gray-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl min-h-[500px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'profile' && (
                        <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                            <h3 className="text-2xl font-bold mb-6">Profile Settings</h3>

                            <div className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl border border-white/10">
                                {userPhoto ? (
                                    <img src={userPhoto} alt="Profile" className="w-20 h-20 rounded-full border-2 border-purple-500" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold">
                                        {userName?.charAt(0) || 'U'}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h4 className="text-xl font-bold text-white">{userName || 'User'}</h4>
                                    <p className="text-gray-400">{userEmail || 'user@example.com'}</p>
                                    <p className="text-xs text-cyan-400 mt-1">Verified Account</p>
                                </div>
                                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                                    Change Photo
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Full Name</label>
                                    <input
                                        type="text"
                                        value={userName || ''}
                                        readOnly
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Email</label>
                                    <input
                                        type="email"
                                        value={userEmail || ''}
                                        readOnly
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Job Title</label>
                                    <input
                                        type="text"
                                        placeholder="Software Engineer"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Location</label>
                                    <input
                                        type="text"
                                        placeholder="San Francisco, CA"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg">
                                    Save Changes
                                </button>
                                <button onClick={onLogout} className="px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 font-bold rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-2">
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'notifications' && (
                        <motion.div key="notifications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                            <h3 className="text-2xl font-bold mb-6">Notification Preferences</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-white">Push Notifications</h4>
                                        <p className="text-sm text-gray-400">Receive notifications about interviews</p>
                                    </div>
                                    <button
                                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                        className={`relative w-14 h-7 rounded-full transition-colors ${notificationsEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
                                    >
                                        <motion.div
                                            animate={{ x: notificationsEnabled ? 28 : 2 }}
                                            className="absolute top-1 w-5 h-5 bg-white rounded-full"
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-white">Email Updates</h4>
                                        <p className="text-sm text-gray-400">Get weekly performance summaries</p>
                                    </div>
                                    <button
                                        onClick={() => setEmailUpdates(!emailUpdates)}
                                        className={`relative w-14 h-7 rounded-full transition-colors ${emailUpdates ? 'bg-green-500' : 'bg-gray-600'}`}
                                    >
                                        <motion.div
                                            animate={{ x: emailUpdates ? 28 : 2 }}
                                            className="absolute top-1 w-5 h-5 bg-white rounded-full"
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-white">Interview Reminders</h4>
                                        <p className="text-sm text-gray-400">Get reminded before scheduled interviews</p>
                                    </div>
                                    <button
                                        className="relative w-14 h-7 rounded-full bg-green-500"
                                    >
                                        <motion.div
                                            animate={{ x: 28 }}
                                            className="absolute top-1 w-5 h-5 bg-white rounded-full"
                                        />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'billing' && (
                        <motion.div key="billing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center py-10 space-y-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto">
                                <Zap size={40} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold mb-2">Free Plan</h3>
                                <p className="text-gray-400 mb-8">Upgrade to unlock unlimited interviews and premium features</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-left">
                                    <h4 className="font-bold text-lg mb-2">Current Plan</h4>
                                    <p className="text-gray-400 text-sm mb-4">5 interviews per month</p>
                                    <div className="text-3xl font-bold text-white">$0<span className="text-sm text-gray-400">/month</span></div>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl border border-purple-500/30 text-left relative overflow-hidden">
                                    <div className="absolute top-2 right-2 bg-cyan-400 text-black text-xs font-bold px-2 py-1 rounded">POPULAR</div>
                                    <h4 className="font-bold text-lg mb-2">Pro Plan</h4>
                                    <p className="text-gray-400 text-sm mb-4">Unlimited interviews + AI insights</p>
                                    <div className="text-3xl font-bold text-white">$29<span className="text-sm text-gray-400">/month</span></div>
                                </div>
                            </div>

                            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-lg hover:from-purple-500 hover:to-blue-500 transition-all shadow-2xl">
                                Upgrade to Pro
                            </button>
                        </motion.div>
                    )}

                    {activeTab === 'security' && (
                        <motion.div key="security" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                            <h3 className="text-2xl font-bold mb-6">Security Settings</h3>

                            <div className="space-y-4">
                                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Shield className="text-green-400" size={24} />
                                        <div>
                                            <h4 className="font-bold">Account Security</h4>
                                            <p className="text-sm text-gray-400">Your account is secured with Google authentication</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                                            Change Password
                                        </button>
                                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                                            Enable 2FA
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                                    <h4 className="font-bold mb-4">Login History</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <Globe size={16} className="text-gray-400" />
                                                <span className="text-gray-300">Chrome on Windows</span>
                                            </div>
                                            <span className="text-gray-500">2 hours ago</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <Globe size={16} className="text-gray-400" />
                                                <span className="text-gray-300">Safari on iPhone</span>
                                            </div>
                                            <span className="text-gray-500">Yesterday</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// Main Dashboard Component
export default function AuraDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [resumeUrl, setResumeUrl] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);
    const [userName, setUserName] = useState("User");
    const [userEmail, setUserEmail] = useState("");
    const [userPhoto, setUserPhoto] = useState(null);
    const [sessionMode, setSessionMode] = useState('mock'); // For interview logic
    const [reportData, setReportData] = useState(null); // For report logic

    // Fetch User Data
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserName(user.displayName?.split(" ")[0] || "User");
                setUserEmail(user.email || "");
                setUserPhoto(user.photoURL || null);
                setCurrentUser(user); // Make sure this state exists

                const ref = doc(db, "users", user.uid);
                
                // CHECK IF USER EXISTS -> IF NOT, RESET TO 0
                getDoc(ref).then(async (snap) => {
                    if (!snap.exists()) {
                        await setDoc(ref, { 
                            ...NEW_USER_DATA, 
                            email: user.email, 
                            displayName: user.displayName || "User" 
                        });
                    }
                });

                // REALTIME LISTENER (Keeps UI synced)
                onSnapshot(ref, (d) => {
                    if(d.exists()) {
                        // This updates the whole dashboard when points change
                        setAnalysisData(d.data().analysis); // Update Analysis View
                        // You can also add a state like setUserData(d.data()) to store everything
                    }
                });
            }
        });
        return () => unsubscribe();
    }, []);
    // File Upload & Gemini Analysis
    const handleFileUpload = async (file) => {
        if (!file) return;

        try {
            setActiveTab('resume');
            setAnalyzing(true);

            // Upload to Cloudinary
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
                { method: "POST", body: formData }
            );
            const uploadResult = await response.json();

            // Extract Text for Gemini
            const extractedText = await extractTextFromPDF(file);

            setResumeUrl(uploadResult.secure_url);
            console.log("Uploaded to Cloudinary:", uploadResult.secure_url);

            // Analyze with Gemini
            await generateGeminiAnalysis(extractedText);
            const userRef = doc(db, "users", auth.currentUser.uid);
            
            await updateDoc(userRef, { 
                analysis: analysis,
                overallScore: analysis.overallScore, // <--- UPDATES DASHBOARD SCORE
                history: arrayUnion({ 
                    id: Date.now(), 
                    type: 'Resume Scan', 
                    date: new Date().toLocaleDateString(), 
                    score: analysis.overallScore, 
                    status: 'Completed' 
                }) 
            });
        } catch (error) {
            console.error("Error processing file:", error);
            alert("Upload/Analysis failed. Please try again.");
            setAnalyzing(false);
        }
    };
    // Add this function inside AuraDashboard
    const handleInterviewComplete = async (report) => {
        setReportData(report); // Show report in UI
        
        if (auth.currentUser) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            
            // UPDATE FIREBASE: Save Interview Score
            await updateDoc(userRef, {
                overallScore: report.overallScore, // Update Main Score
                history: arrayUnion({
                    id: Date.now(),
                    type: sessionMode === 'mock' ? 'Mock Interview' : 'Practice Session',
                    date: new Date().toLocaleDateString(),
                    score: report.overallScore,
                    status: 'Completed'
                })
            });
        }
        setActiveTab('interview-results');
    };

    // Gemini Analysis
    const generateGeminiAnalysis = async (resumeText) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

            const prompt = `You are an expert technical recruiter. Analyze this resume text:
      "${resumeText.substring(0, 10000)}"
      
      Output ONLY a valid JSON object. Do not include markdown formatting like \`\`\`json.
      
      Strict JSON Schema required:
      {
        "overallScore": Number (0-100),
        "description": "String (2-3 sentences summary)",
        "ratings": [
          { "name": "String (Category, e.g., 'ATS keywords')", "score": Number (0-100), "desc": "String (Short feedback)" },
          { "name": "String (e.g., 'Impact')", "score": Number (0-100), "desc": "String" },
          { "name": "String (e.g., 'Tech Stack')", "score": Number (0-100), "desc": "String" }
        ],
        "feedback": [
          { 
            "type": "String (Must be exactly one of: 'critical', 'strength', or 'neutral')", 
            "title": "String (Short title)", 
            "text": "String (Detailed advice)" 
          },
          { "type": "critical", "title": "...", "text": "..." },
          { "type": "strength", "title": "...", "text": "..." }
        ]
      }`;

            const result = await model.generateContent(prompt);
            const response = await result.response;

            // Clean markdown if Gemini adds it
            let text = response.text()
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            if (!text.startsWith("{")) {
                throw new Error("Gemini did not return valid JSON");
            }

            const jsonData = JSON.parse(text);

            setAnalysisData(jsonData);
            setAnalyzing(false);

        } catch (error) {
            console.error("Gemini Analysis Error:", error);
            alert("Analysis failed. Please try again.");
            setAnalyzing(false);
        }
    };

    const handleStartInterview = () => {
        // UNRESTRICTED ACCESS
        setActiveTab('interview-select');
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            window.location.href = '/';
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleModeSelection = (mode) => {
        setSessionMode(mode);
        setActiveTab('interview-session');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-hidden flex">
            <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUpload={handleFileUpload} />

            {/* Sidebar */}
            {/* Sidebar */}
            <aside className="w-64 bg-[#0a0a0a]/80 backdrop-blur-xl border-r border-white/5 flex flex-col h-screen sticky top-0 z-50">

                {/* Wrapped the Logo section in a Link to "/" */}
                <div className="p-6 flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-3 group hover:opacity-80 transition-opacity cursor-pointer">
                       <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all">
                          <Brain size={18} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            AURA
                       </span>
                    </Link>
                </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
                <SidebarItem icon={LayoutDashboard} label="Dashboard" id="dashboard" active={activeTab === 'dashboard'} onClick={setActiveTab} />
                <div onClick={() => setIsUploadModalOpen(true)} className="group flex items-center p-3 my-1 rounded-xl cursor-pointer text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                    <Upload size={20} className="group-hover:text-green-400 transition-colors" />
                    <span className="ml-3 font-medium text-sm tracking-wide">Upload Resume</span>
                </div>
                <SidebarItem icon={Video} label="Start Interview" id="interview" active={activeTab === 'interview'} onClick={handleStartInterview} />
                <SidebarItem icon={History} label="History" id="history" active={activeTab === 'history'} onClick={setActiveTab} />
                <SidebarItem icon={Zap} label="AI Feedback" id="feedback" active={activeTab === 'feedback'} onClick={setActiveTab} />
                <SidebarItem icon={FileText} label="Resume Analysis" id="resume" active={activeTab === 'resume'} onClick={setActiveTab} />
            </nav>

            <div className="p-4 border-t border-white/5">
                <SidebarItem icon={Settings} label="Settings" id="settings" active={activeTab === 'settings'} onClick={setActiveTab} />
                <motion.div whileHover={{ scale: 1.02 }} className="mt-4 flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:border-purple-500/50 transition-colors">
                    {userPhoto ? (
                        <img src={userPhoto} alt="Profile" className="w-8 h-8 rounded-full" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                            {userName.charAt(0)}
                        </div>
                    )}
                    <div className="flex-1">
                        <p className="text-sm font-medium truncate">{userName}</p>
                        <p className="text-xs text-gray-400">Free Plan</p>
                    </div>
                </motion.div>
            </div>
        </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/10 via-blue-900/5 to-transparent pointer-events-none" />

                {activeTab !== 'interview-session' && (
                    <header className="sticky top-0 z-40 px-8 py-5 bg-[#050505]/70 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-semibold text-white capitalize">
                                {activeTab === 'resume' ? 'Resume Intelligence' :
                                    activeTab.startsWith('interview') ? 'Live Session' :
                                        activeTab === 'interview-results' ? 'Results' :
                                            activeTab}
                            </h1>
                            <p className="text-xs text-gray-400">
                                {activeTab.startsWith('interview') ? 'AI Interview Module' : 'Overview of your performance'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
                                <Bell size={20} className="text-gray-300" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                            </button>
                            <button onClick={handleStartInterview} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-900/20 text-sm font-semibold transition-all">
                                <Play size={16} fill="currentColor" /> Start New Interview
                            </button>
                        </div>
                    </header>
                )}

                <div className={`w-full ${activeTab === 'interview-session' ? 'h-full p-0' : 'p-8 space-y-8 max-w-7xl mx-auto h-[calc(100vh-100px)] overflow-y-auto'}`}>
                    <AnimatePresence mode="wait">
                        
                        {/* INTERVIEW FLOW */}
                          {activeTab === 'interview-select' && (
                            <InterviewSelection onSelectMode={(m) => { setSessionMode(m); setActiveTab('interview-session'); }} />
                          )}

                          {activeTab === 'interview-session' && (
                            <motion.div key="session" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full w-full">
                            <InterviewSession 
                              mode={sessionMode} 
                              onEndSession={() => {}} // Handled by report generation
                              onReportGenerated={handleInterviewComplete} // <--- Links to Step 6
                            />
                            </motion.div>
                          )}

                          {activeTab === 'interview-results' && (
                            <InterviewResults data={reportData} onBack={() => setActiveTab('dashboard')} />
                          )}

                        {/* DASHBOARD */}
                        {activeTab === 'dashboard' && (
                            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h2 className="text-3xl font-bold mb-2">Welcome back, {userName} 👋</h2>
                                        <p className="text-gray-400">Your AI communication score has improved by <span className="text-green-400">+12%</span> this week.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <MetricCard icon={Activity} label="Avg. AI Score" value="86/100" trend="up" trendValue="4.2%" color="purple" />
                                    <MetricCard icon={Mic} label="Communication" value="Excellent" trend="up" trendValue="High" color="blue" />
                                    <MetricCard icon={Eye} label="Eye Contact" value="92%" trend="down" trendValue="2.1%" color="cyan" />
                                    <MetricCard icon={Brain} label="Confidence" value="High" trend="up" trendValue="Steady" color="emerald" />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 bg-gray-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-bold">Performance Trend</h3>
                                        </div>
                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={NEW_USER_DATA.performanceData}>
                                                    <defs>
                                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                                    <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center">
                                        <h3 className="text-lg font-bold w-full text-left mb-2">Skill Breakdown</h3>
                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={NEW_USER_DATA.skillData}>
                                                    <PolarGrid stroke="#333" />
                                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                                    <Radar name={userName} dataKey="A" stroke="#22d3ee" strokeWidth={2} fill="#22d3ee" fillOpacity={0.3} />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* RESUME */}
                        {activeTab === 'resume' && (
                            <div className="space-y-8 font-sans">
                                {!resumeUrl ? (
                                    /* EMPTY STATE - NO RESUME */
                                    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-8">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="relative group"
                                        >
                                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                                            <div className="w-24 h-24 bg-gray-900 rounded-2xl border border-white/10 flex items-center justify-center relative shadow-2xl">
                                                <FileText size={40} className="text-gray-300 group-hover:text-white transition-colors duration-300" />
                                            </div>
                                        </motion.div>

                                        <div className="space-y-3">
                                            <h2 className="text-4xl font-extrabold tracking-tight text-white">
                                                Resume Analysis
                                            </h2>
                                            <p className="text-gray-400 max-w-md mx-auto text-lg leading-relaxed">
                                                Upload your resume to unlock a <span className="text-purple-400">detailed AI analysis</span> powered by AURA.
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setIsUploadModalOpen(true)}
                                            className="group relative px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                                        >
                                            <span className="flex items-center gap-2">
                                                Upload Document <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            </span>
                                        </button>
                                    </div>

                                ) : analyzing ? (
                                    /* LOADING STATE */
                                    <ScanningLoader />

                                ) : analysisData ? (
                                    /* RESULTS DASHBOARD */
                                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">

                                        {/* Top Section: Score & Description */}
                                        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                            {/* Score Card */}
                                            <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
                                                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-[80px] rounded-full" />

                                                <div className="relative z-10 flex flex-col items-center">
                                                    <h3 className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">AURA Score</h3>

                                                    <div className="relative w-40 h-40 flex items-center justify-center">
                                                        <svg className="transform -rotate-90 w-40 h-40">
                                                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-800" />
                                                            <motion.circle
                                                                initial={{ strokeDashoffset: 440 }}
                                                                animate={{ strokeDashoffset: 440 - (analysisData.overallScore / 100) * 440 }}
                                                                transition={{ duration: 2, ease: "easeOut" }}
                                                                cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={440} strokeLinecap="round"
                                                                className="text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                                                            />
                                                        </svg>
                                                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                            <span className="text-5xl font-mono font-bold text-white tracking-tighter">
                                                                {analysisData.overallScore}
                                                            </span>
                                                            <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider">/ 100</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20">
                                                        <Sparkles size={14} className="text-purple-400" />
                                                        <span className="text-xs font-medium text-purple-200">AI Optimized</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description Card */}
                                            <div className="lg:col-span-2 bg-gray-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-center">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50" />
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                                                        <Sparkles className="text-yellow-400" size={20} />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white tracking-tight">Executive Summary</h3>
                                                </div>
                                                <p className="text-gray-300 leading-relaxed text-lg font-light">
                                                    {analysisData.description}
                                                </p>
                                            </div>
                                        </motion.div>

                                        {/* Metrics Grid */}
                                        <motion.div variants={itemVariants}>
                                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white tracking-tight">
                                                <Target size={24} className="text-cyan-400" />
                                                Performance Metrics
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                                {analysisData.ratings.map((item, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.03)" }}
                                                        className="bg-gray-900/40 p-5 rounded-2xl border border-white/5 transition-all group"
                                                    >
                                                        <div className="flex justify-between items-end mb-3">
                                                            <span className="text-gray-400 font-medium text-sm uppercase tracking-wider">{item.name}</span>
                                                            <span className={`text-2xl font-mono font-bold ${item.score >= 80 ? 'text-green-400' : item.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                                                                }`}>
                                                                {item.score}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-800 h-2 rounded-full mb-4 overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${item.score}%` }}
                                                                transition={{ duration: 1, delay: 0.5 }}
                                                                className={`h-full rounded-full shadow-[0_0_10px_currentColor] ${item.score >= 80 ? 'bg-green-500 text-green-500' : item.score >= 60 ? 'bg-yellow-500 text-yellow-500' : 'bg-red-500 text-red-500'
                                                                    }`}
                                                            />
                                                        </div>
                                                        <p className="text-sm text-gray-500 leading-snug">{item.desc}</p>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>

                                        {/* Feedback Section */}
                                        <motion.div variants={itemVariants} className="space-y-6">
                                            <h3 className="text-xl font-bold flex items-center gap-3 text-white tracking-tight">
                                                <Award size={24} className="text-purple-400" />
                                                Strategic Feedback
                                            </h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                {analysisData.feedback.map((tip, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`p-6 rounded-2xl border backdrop-blur-sm transition-all hover:border-opacity-50 ${tip.type === 'critical' ? 'bg-red-900/10 border-red-500/20 hover:border-red-500/40' :
                                                                tip.type === 'strength' ? 'bg-green-900/10 border-green-500/20 hover:border-green-500/40' :
                                                                    'bg-blue-900/10 border-blue-500/20 hover:border-blue-500/40'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-5">
                                                            <div className={`mt-1 p-3 rounded-xl shrink-0 ${tip.type === 'critical' ? 'bg-red-500/10 text-red-400' :
                                                                    tip.type === 'strength' ? 'bg-green-500/10 text-green-400' :
                                                                        'bg-blue-500/10 text-blue-400'
                                                                }`}>
                                                                {tip.type === 'critical' ? <AlertCircle size={20} /> :
                                                                    tip.type === 'strength' ? <CheckCircle size={20} /> :
                                                                        <Zap size={20} />}
                                                            </div>
                                                            <div>
                                                                <h4 className={`text-lg font-bold mb-2 tracking-tight ${tip.type === 'critical' ? 'text-red-200' :
                                                                        tip.type === 'strength' ? 'text-green-200' :
                                                                            'text-blue-200'
                                                                    }`}>
                                                                    {tip.title}
                                                                </h4>
                                                                <p className="text-gray-400 leading-relaxed font-light">{tip.text}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                ) : null}
                            </div>
                        )}

                        {activeTab === 'history' && <HistoryView />}
                        {activeTab === 'feedback' && <FeedbackView />}
                        {activeTab === 'settings' && (
                            <SettingsView
                                userEmail={userEmail}
                                userName={userName}
                                userPhoto={userPhoto}
                                onLogout={handleLogout}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
