import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Community = () => {
  const discussions = [
    {
      id: 1,
      topic: "Best practices for React state management?",
      author: "AlexDev",
      replies: 24,
      tag: "Engineering"
    },
    {
      id: 2,
      topic: "How to implement dark mode effectively",
      author: "SarahUI",
      replies: 18,
      tag: "Design"
    },
    {
      id: 3,
      topic: "Aura v2.0 feature request thread",
      author: "TeamAura",
      replies: 156,
      tag: "Official"
    }
  ];

  const events = [
    {
      id: 1,
      title: "Tech Talk: Scaling Backends",
      date: "Nov 15 • 2:00 PM EST",
      status: "Upcoming"
    },
    {
      id: 2,
      title: "Community Hackathon",
      date: "Dec 01 • All Day",
      status: "Registration Open"
    }
  ];

  return (
    <div className="bg-aura-black min-h-screen text-white font-sans selection:bg-pink-500/30">
      <Navbar />

      <div className="max-w-6xl mx-auto pt-32 px-6 pb-20">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Community Hub
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Connect with developers, designers, and enthusiasts building the future with Aura.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
              Join Discord
            </button>
            <button className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors">
              Start Discussion
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content: Discussions */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-pink-500 pl-4">Trending Discussions</h2>
            {discussions.map((item) => (
              <div key={item.id} className="group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-pink-500/30 hover:bg-white/10 transition-all cursor-pointer">
                <div>
                  <h3 className="text-lg font-semibold group-hover:text-pink-300 transition-colors">
                    {item.topic}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                    <span className="text-pink-400">@{item.author}</span>
                    <span>•</span>
                    <span>{item.tag}</span>
                  </div>
                </div>
                <div className="text-center bg-black/30 px-4 py-2 rounded-lg border border-white/5">
                  <span className="block text-xl font-bold text-white">{item.replies}</span>
                  <span className="text-xs text-gray-500">Replies</span>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar: Events & Contributors */}
          <div className="space-y-8">
            
            {/* Events Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <h3 className="text-xl font-bold mb-6">Events</h3>
              <div className="space-y-6">
                {events.map((event) => (
                  <div key={event.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-mono text-pink-400 border border-pink-500/30 px-2 py-0.5 rounded">
                        {event.status}
                      </span>
                    </div>
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{event.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="p-6 rounded-2xl bg-pink-900/20 border border-pink-500/20 text-center">
              <h3 className="text-lg font-bold mb-2">Weekly Digest</h3>
              <p className="text-sm text-gray-400 mb-4">Get the best discussions delivered to your inbox.</p>
              <input 
                type="email" 
                placeholder="Enter email" 
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:border-pink-500"
              />
              <button className="w-full py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-sm font-semibold transition-colors">
                Subscribe
              </button>
            </div>

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Community;