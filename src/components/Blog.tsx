import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, Search, ArrowRight } from 'lucide-react';
import Fuse from 'fuse.js';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Blog post data
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Building Performant React Applications: A Deep Dive',
      excerpt: 'Learn advanced optimization techniques to make your React applications blazing fast and responsive.',
      date: 'April 15, 2023',
      readTime: '8 min read',
      category: 'React',
      slug: 'building-performant-react-applications',
    },
    {
      id: 2,
      title: 'The Power of TypeScript: Type Safety in Modern Web Development',
      excerpt: 'Discover how TypeScript can improve your development workflow and help catch errors before they reach production.',
      date: 'March 22, 2023',
      readTime: '6 min read',
      category: 'TypeScript',
      slug: 'power-of-typescript',
    },
    {
      id: 3,
      title: 'Designing Accessible User Interfaces: WCAG 2.2 Explained',
      excerpt: 'A comprehensive guide to implementing accessibility features according to the latest WCAG guidelines.',
      date: 'February 10, 2023',
      readTime: '10 min read',
      category: 'Accessibility',
      slug: 'designing-accessible-interfaces',
    },
    {
      id: 4,
      title: 'State Management in 2023: Beyond Redux',
      excerpt: 'Exploring modern state management solutions for React applications, from Context API to Recoil and Jotai.',
      date: 'January 5, 2023',
      readTime: '7 min read',
      category: 'State Management',
      slug: 'state-management-beyond-redux',
    },
  ];

  // Set up Fuse.js for search
  const fuse = new Fuse(blogPosts, {
    keys: ['title', 'excerpt', 'category'],
    threshold: 0.4,
  });

  const filteredPosts = searchQuery
    ? fuse.search(searchQuery).map(result => result.item)
    : blogPosts;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <section id="blog" className="section bg-bg-primary/50" ref={sectionRef}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <h2 className="section-title mb-0">Latest Articles</h2>
          
          <div className="relative max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-lg bg-slate-800 border-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                className="card hover:shadow-xl transition-all group"
                variants={itemVariants}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-400">
                      {post.category}
                    </span>
                    <div className="flex items-center text-text-muted text-xs">
                      <Calendar size={14} className="mr-1" />
                      {post.date}
                    </div>
                    <div className="flex items-center text-text-muted text-xs">
                      <Clock size={14} className="mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-text-main group-hover:text-gradient transition-colors duration-300">
                    {post.title}
                  </h3>
                  
                  <p className="text-text-muted mb-4">
                    {post.excerpt}
                  </p>
                  
                  <a 
                    href={`/blog/${post.slug}`} 
                    className="inline-flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors"
                  >
                    Read more
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              <p className="text-text-muted">No articles found matching your search.</p>
            </div>
          )}
        </motion.div>
        
        <div className="text-center mt-12">
          <a href="/blog" className="btn-secondary inline-flex items-center gap-2">
            View All Articles
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Blog;