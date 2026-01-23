import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Guide = () => {
  // Data Structure for the Guidelines
  const guidelines = [
    {
      title: "1. User Eligibility",
      points: [
        "Users must provide accurate and truthful information during registration.",
        "AURA is intended for interview preparation, skill assessment, and professional development purposes only.",
        "Users are responsible for maintaining the confidentiality of their login credentials."
      ]
    },
    {
      title: "2. Resume & Data Usage",
      points: [
        "Uploaded resumes are used strictly for interview analysis and performance evaluation.",
        "AURA does not modify, sell, or distribute user resumes to third parties.",
        "Users retain full ownership of their uploaded documents and data."
      ]
    },
    {
      title: "3. Camera, Audio & Permissions",
      points: [
        "Camera and microphone access are required for posture, eye-tracking, and voice analysis features.",
        "Users must ensure proper lighting and a distraction-free environment for accurate results.",
        "AURA does not record video or audio without explicit user consent."
      ]
    },
    {
      title: "4. Interview Conduct",
      points: [
        "Users should maintain professional behavior throughout the interview session.",
        "Any attempt to manipulate, bypass, or misuse the AI evaluation system is strictly prohibited.",
        "Abusive, offensive, or inappropriate language may result in account suspension."
      ]
    },
    {
      title: "5. AI Feedback & Accuracy",
      points: [
        "Feedback provided by AURA is AI-generated and intended for guidance and improvement purposes.",
        "Results should not be considered as final hiring decisions or professional certification.",
        "Users are encouraged to combine AI insights with human judgment and real-world practice."
      ]
    },
    {
      title: "6. Privacy & Security",
      points: [
        "All user data is protected using industry-standard encryption and security measures.",
        "Personal data is processed in accordance with applicable data protection laws.",
        "Users may request data deletion at any time through account settings."
      ]
    },
    {
      title: "7. Platform Integrity",
      points: [
        "Reverse engineering, scraping, or unauthorized access to platform services is prohibited.",
        "Users may not use AURA for unlawful, deceptive, or harmful activities.",
        "Violation of guidelines may lead to temporary or permanent account termination."
      ]
    },
    {
      title: "8. Feature Availability",
      points: [
        "Certain features may be updated, modified, or discontinued as the platform evolves.",
        "New features may be released as part of beta or limited access programs."
      ]
    },
    {
      title: "9. Limitation of Liability",
      points: [
        "AURA is not responsible for job outcomes, hiring decisions, or employment results.",
        "The platform provides simulated interview experiences for educational purposes only."
      ]
    },
    {
      title: "10. Updates to Guidelines",
      points: [
        "These guidelines may be updated periodically to reflect platform improvements or legal requirements.",
        "Continued use of AURA indicates acceptance of the latest version of these guidelines."
      ]
    }
  ];

  return (
    <div className="bg-aura-black min-h-screen text-white font-sans selection:bg-purple-500/30">
      <Navbar />

      <div className="max-w-6xl mx-auto pt-32 px-6 pb-20">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Platform Guidelines
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed border-l-4 border-purple-500/50 pl-6">
            To ensure a fair, effective, and high-quality interview simulation experience, 
            users are required to follow the guidelines outlined below while using the AURA platform.
          </p>
        </div>

        {/* Guidelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {guidelines.map((section, index) => (
            <div 
              key={index} 
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/[0.08]"
            >
              <h2 className="text-xl font-bold text-white mb-4">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.points.map((point, idx) => (
                  <li key={idx} className="flex items-start text-gray-400 text-sm leading-relaxed">
                    <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Aura Platform. All Rights Reserved.</p>
        </div>

      </div>
      
      <Footer />
    </div>
  );
};

export default Guide;