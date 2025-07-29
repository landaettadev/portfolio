import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScrollEffectProps {
  isVisible: boolean;
}

const ScrollEffect: React.FC<ScrollEffectProps> = ({ isVisible }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    // Simular scroll automático
    const scrollInterval = setInterval(() => {
      setIsScrolling(true);
      setScrollPosition(prev => {
        const newPos = prev + 1;
        if (newPos > 100) {
          setIsScrolling(false);
          return 0;
        }
        return newPos;
      });
    }, 50);

    return () => clearInterval(scrollInterval);
  }, [isVisible]);

  // Contenido que se "scrollea" - más compacto para la pantalla
  const scrollContent = [
    'import React from "react";',
    'import { motion } from "framer-motion";',
    '',
    'const Portfolio = () => {',
    '  return (',
    '    <motion.div',
    '      initial={{ opacity: 0 }}',
    '      animate={{ opacity: 1 }}',
    '    >',
    '      <h1>Brandon Landaetta</h1>',
    '      <p>Software Engineer</p>',
    '    </motion.div>',
    '  );',
    '};',
    '',
    'export default Portfolio;',
    '',
    '// React + TypeScript',
    '// Modern Web Development',
    '// Clean Code Principles',
    '',
    'const skills = [',
    '  "React", "TypeScript",',
    '  "Python", "C#", "PHP"',
    '];',
    '',
    '// Building scalable solutions',
    '// User-focused development',
    '',
    'const projects = [',
    '  "Bitcoin ATM System",',
    '  "AI Retail Platform",',
    '  "E-commerce Solutions"',
    '];'
  ];

  return (
    <div className="absolute inset-0 overflow-hidden hidden md:block">
      {/* Small centered code window */}
      <div className="absolute top-1/6 left-2/3 transform -translate-x-1/2 -translate-y-1/2 w-14 h-20 bg-slate-900/90 rounded-lg border border-slate-600/50 shadow-lg" style={{ marginTop: '56px', marginLeft: '-20px' }}>
        {/* Scrollbar for the small window */}
        <div className="absolute right-1 top-2 bottom-2 w-0.5 bg-slate-600/30 rounded-full">
          <motion.div
            className="w-full bg-blue-500/60 rounded-full"
            style={{
              height: '20%',
              y: `${scrollPosition * 1.3}%`
            }}
            animate={{
              y: isScrolling ? `${scrollPosition * 0.3}%` : 0
            }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Content that scrolls in small window */}
        <div className="absolute inset-0 pr-3 overflow-hidden">
          <motion.div
            className="text-xs font-mono text-slate-300 leading-tight p-2"
            style={{
              transform: `translateY(-${scrollPosition * 0.5}px)`
            }}
            animate={{
              y: isScrolling ? `-${scrollPosition * 0.5}px` : 0
            }}
            transition={{ duration: 0.1 }}
          >
            {scrollContent.map((line, index) => (
              <div
                key={index}
                className={`py-0 ${
                  line.includes('import') || line.includes('export') 
                    ? 'text-blue-400' 
                    : line.includes('const') || line.includes('function')
                    ? 'text-purple-400'
                    : line.includes('React') || line.includes('motion')
                    ? 'text-green-400'
                    : line.includes('//')
                    ? 'text-slate-500'
                    : line.includes('Brandon') || line.includes('Portfolio')
                    ? 'text-yellow-400'
                    : 'text-slate-300'
                }`}
              >
                {line}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Cursor blink effect in small window */}
        <motion.div
          className="absolute w-0.5 h-3 bg-green-400"
          style={{
            left: '8px',
            top: `${20 + scrollPosition * 0.2}%`
          }}
          animate={{
            opacity: [1, 0, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};

export default ScrollEffect; 