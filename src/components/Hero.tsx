import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import AnimatedScreens from './AnimatedScreens';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const pcLayerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Initialize starry background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Handle resize
    window.addEventListener('resize', setCanvasDimensions);
    setCanvasDimensions();

    // Star properties
    interface Star {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      speed: number;
      animationOffset: number;
    }

    // Create stars
    const stars: Star[] = [];
    const starCount = Math.floor(canvas.width * canvas.height / 2000);
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.05 + 0.01,
        animationOffset: Math.random() * Math.PI * 2,
      });
    }

    // Animation function
    let animationFrameId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw stars
      const time = Date.now() / 1000;
      
      stars.forEach(star => {
        // Calculate animation based on time and offset
        const opacity = star.opacity * (0.5 + 0.5 * Math.sin(time + star.animationOffset));
        
        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
        
        // Move star
        star.y += star.speed;
        
        // Reset position if off screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Parallax effect
  useEffect(() => {
    const pcLayer = pcLayerRef.current;
    if (!pcLayer || 'ontouchstart' in window) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      targetX = x;
      targetY = y;
    };

    const animate = () => {
      const dx = (targetX - currentX) * 0.1;
      const dy = (targetY - currentY) * 0.1;
      
      currentX += dx;
      currentY += dy;
      
      pcLayer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section 
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-bg-secondary to-bg-primary pt-16 perspective-1000"
    >
      {/* Stars canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 -z-10"></canvas>
      
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover opacity-30 mix-blend-screen"
        style={{
          clipPath: `polygon(
            42% 15%, 58% 15%,
            58% 35%, 42% 35%,
            42% 45%, 58% 45%,
            58% 65%, 42% 65%,
            42% 75%, 58% 75%,
            58% 95%, 42% 95%
          )`,
        }}
      >
        <source src="/assets/code-loop.mp4" type="video/mp4" />
      </video>
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between py-8 sm:py-16">
        <div className="max-w-xl content z-10 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
            Brandon&nbsp;
            <span className="text-gradient">
              Landaetta
            </span>
            <br /> Software&nbsp;Engineer
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-300">
            Building scalable, elegant solutions that empower users and
            transform businesses.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a 
              href="/cv.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary group w-full sm:w-auto"
            >
              Download CV
            </a>
            <a 
              href="#projects"
              className="btn-secondary w-full sm:w-auto"
            >
              View Projects
            </a>
          </div>
        </div>

        {/* PC Layer with Parallax */}
        <div 
          ref={pcLayerRef}
          className="block w-full max-w-[620px] mt-8 sm:mt-12 lg:mt-0 parallax-layer will-change-transform transition-transform duration-200 ease-out"
        >
          <div className="relative w-full aspect-[620/400]">
            <img 
              src="/assets/index.png"
              alt="Developer workspace at night"
              className="w-full h-auto object-cover pointer-events-none select-none"
              draggable="false"
            />
            <AnimatedScreens isMobile={isMobile} />
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <a 
          href="#about" 
          className="flex flex-col items-center text-text-muted hover:text-text-main transition-colors duration-300"
        >
          <span className="mb-2 text-sm">Scroll down</span>
          <ArrowDown className="animate-bounce" size={20} />
        </a>
      </div>
    </section>
  );
};

export default Hero;