import React, { useEffect, useRef } from 'react';
import { onIdle, prefersReducedMotion } from '../hooks/useSpotlight';

/**
 * Fixed deep-space backdrop behind every section:
 * three star layers with scroll parallax, slow twinkle, an occasional
 * shooting star, a faint blueprint grid and a light that follows the pointer.
 */
const Background: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if ('ontouchstart' in window) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
        document.documentElement.style.setProperty('--my', `${e.clientY}px`);
      });
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = prefersReducedMotion();

    interface Star { x: number; y: number; r: number; a: number; tw: number; depth: number; tint: number }
    let stars: Star[] = [];
    let W = 0, H = 0;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((W * H) / 3200);
      stars = Array.from({ length: count }, () => {
        const depth = Math.random() < 0.6 ? 0.08 : Math.random() < 0.75 ? 0.2 : 0.45;
        return {
          x: Math.random() * W,
          y: Math.random() * H * 3,
          r: depth > 0.3 ? Math.random() * 1.1 + 0.8 : Math.random() * 0.9 + 0.25,
          a: Math.random() * 0.6 + 0.25,
          tw: Math.random() * Math.PI * 2,
          depth,
          tint: Math.random(),
        };
      });
    };
    resize();
    window.addEventListener('resize', resize);

    let shoot: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let nextShoot = performance.now() + 4000;

    const draw = (now: number) => {
      const t = now / 1000;
      const sy = window.scrollY;
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        const y = (((s.y - sy * s.depth) % (H * 3)) + H * 3) % (H * 3);
        if (y > H) continue;
        const a = reduced ? s.a : s.a * (0.6 + 0.4 * Math.sin(t * (0.6 + s.depth * 2) + s.tw));
        ctx.fillStyle = s.tint > 0.88 ? `rgba(94,234,212,${a})` : s.tint > 0.8 ? `rgba(196,181,253,${a})` : `rgba(255,255,255,${a})`;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 1.5) {
          ctx.fillStyle = `rgba(255,255,255,${a * 0.12})`;
          ctx.beginPath();
          ctx.arc(s.x, y, s.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reduced) {
        if (!shoot && now > nextShoot) {
          shoot = { x: Math.random() * W * 0.7 + W * 0.2, y: Math.random() * H * 0.4, vx: -9 - Math.random() * 5, vy: 4 + Math.random() * 3, life: 1 };
        }
        if (shoot) {
          const tail = 16;
          const g = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - shoot.vx * tail, shoot.y - shoot.vy * tail);
          g.addColorStop(0, `rgba(255,255,255,${shoot.life})`);
          g.addColorStop(1, 'rgba(94,234,212,0)');
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(shoot.x, shoot.y);
          ctx.lineTo(shoot.x - shoot.vx * tail, shoot.y - shoot.vy * tail);
          ctx.stroke();
          shoot.x += shoot.vx;
          shoot.y += shoot.vy;
          shoot.life -= 0.018;
          if (shoot.life <= 0 || shoot.y > H) {
            shoot = null;
            nextShoot = now + 6000 + Math.random() * 9000;
          }
        }
        raf = requestAnimationFrame(draw);
      }
    };

    // first paint of the sky waits for an idle slot so it never competes with the hero
    let raf = 0;
    const cancelStart = onIdle(() => (raf = requestAnimationFrame(draw)), 1500);
    const onScroll = () => {
      if (reduced) requestAnimationFrame(draw);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      cancelStart();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-0">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 page-grid" />
      <div className="absolute inset-0 cursor-light" />
    </div>
  );
};

export default Background;
