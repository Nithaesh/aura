import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Blog = () => {
  // Sample Data matching the "Aura" / Tech / Minimalist theme
  const blogPosts = [
    {
      id: 1,
      title: "The Art of Dark UI Design",
      excerpt: "Exploring the psychology behind dark mode and how to create depth without relying on heavy shadows.",
      category: "Design",
      date: "Oct 12, 2023",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Optimizing React for Performance",
      excerpt: "A deep dive into memoization, lazy loading, and ensuring your Aura app runs as smooth as silk.",
      category: "Engineering",
      date: "Oct 28, 2023",
      readTime: "8 min read",
    },
    {
      id: 3,
      title: "The Future of Digital Aesthetics",
      excerpt: "Moving beyond flat design: How glassmorphism and neon accents are shaping the next web era.",
      category: "Trends",
      date: "Nov 03, 2023",
      readTime: "4 min read",
    },
    {
      id: 4,
      title: "Building Scalable Systems",
      excerpt: "Lessons learned from scaling our backend infrastructure to handle millions of requests.",
      category: "Backend",
      date: "Nov 15, 2023",
      readTime: "6 min read",
    }
  ];

  return (
    <div className="bg-aura-black min-h-screen text-white font-sans selection:bg-purple-500/30">
      <Navbar />
      
      <div className="max-w-5xl mx-auto pt-32 px-6 pb-20">
        {/* Header Section */}
        <div className="mb-16 border-b border-white/10 pb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Aura Blog
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Insights, updates, and thoughts on design, technology, and the future of digital experiences.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <article 
              key={post.id} 
              className="group relative flex flex-col justify-between p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/20"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold tracking-wider uppercase text-purple-400">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {post.date}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold mb-3 group-hover:text-purple-300 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-gray-400 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>

              <div className="flex items-center text-sm font-medium text-white/80 mt-auto">
                <span>{post.readTime}</span>
                <span className="mx-2 text-gray-600">•</span>
                <button className="flex items-center group-hover:text-white transition-colors">
                  Read Article 
                  <svg 
                    className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;