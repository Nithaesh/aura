import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

// Component Imports
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Features from './sections/Features';
import HowItWorks from './sections/HowItWorks';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AuraDashboard from './components/Dashboard'; // Ensure this matches your file 
import InterviewSelection from './pages/InterviewSelection';
import InterviewRoom from './pages/InterviewRoom';
import InterviewResults from './pages/InterviewResults';
import Blog from './pages/Blog'; 
import Guide from './pages/Guide';
import Community from './pages/Community';
// --- NEW IMPORTS ---
import FeaturesPage from './pages/FeaturesPage'; 
import Pricing from './pages/Pricing';
import Enterprise from './pages/Enterprise';

function App() {
  // State to manage the Auth Modal visibility on the landing page
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    // 1. BrowserRouter must wrap the entire application
    <BrowserRouter>
      <div className="bg-aura-black min-h-screen text-white selection:bg-cyan-500/30">
        
        <Routes>
          <Route path="/interview/select" element={<InterviewSelection />} />
          <Route path="/interview/room/:mode" element={<InterviewRoom />} />
          <Route path="/interview/results" element={<InterviewResults />} />
          {/* --- Route 1: The Landing Page (Public) --- */}
          <Route path="/" element={
            <>
              {/* Pass the function to open the modal to the Navbar */}
              <Navbar onOpenAuth={() => setIsAuthOpen(true)} />
              
              <main>
                <Hero />
                <Features />
                <HowItWorks />
              </main>
              
              <Footer />

              {/* The AuthModal lives here so it overlays the landing page */}
              <AuthModal 
                isOpen={isAuthOpen} 
                onClose={() => setIsAuthOpen(false)} 
              />
            </>
          } />

          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/enterprise" element={<Enterprise />} />

          {/* --- Existing Pages Routes --- */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/guidelines" element={<Guide />} />
          <Route path="/community" element={<Community />} />

          {/* --- Route 2: The Dashboard (Private) --- */}
          {/* When users log in via AuthModal, they are navigated here */}
          <Route path="/dashboard" element={<AuraDashboard />} />
          
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
