import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../hooks/useSpotlight';
import { createBrain, MAX_NODES, type Pulse } from './growthSim';

/**
 * Differential growth inside two hemispheres: a closed line keeps splitting
 * and repelling itself until it folds like a cortex. Light pulses travel along
 * it like signals; replaying the agent trace ("agent:think") fires a burst.
 */

const GrowthBrain: React.FC<{ className?: string }> = ({ className = '' }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const brain = createBrain(W, H);
    const curves = brain.curves;
    const pointer = brain.pointer;
    const step = brain.step;
    const pulses: Pulse[][] = [[], []];
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#5EEAD4');
    grad.addColorStop(0.55, '#A78BFA');
    grad.addColorStop(1, '#8B5CF6');

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineJoin = 'round';
      for (let pass = 0; pass < 2; pass++) {
        ctx.strokeStyle = grad;
        ctx.globalAlpha = pass === 0 ? 0.12 : 0.85;
        ctx.lineWidth = pass === 0 ? 5 : 1.1;
        for (const pts of curves) {
          ctx.beginPath();
          pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
          ctx.closePath();
          ctx.stroke();
        }
      }
      // signals travelling along the folds
      ctx.globalCompositeOperation = 'lighter';
      curves.forEach((pts, ci) => {
        for (const pl of pulses[ci]) {
          const len = 26;
          for (let k = 0; k < len; k++) {
            const idx = Math.floor(pl.pos - k + pts.length * 4) % pts.length;
            const p = pts[idx];
            ctx.globalAlpha = (1 - k / len) * pl.life * 0.9;
            ctx.fillStyle = k < 3 ? '#ffffff' : '#5EEAD4';
            ctx.beginPath();
            ctx.arc(p.x, p.y, k < 3 ? 1.8 : 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    };

    const spawn = (count: number) => {
      curves.forEach((pts, ci) => {
        for (let i = 0; i < count; i++) pulses[ci].push({ pos: Math.random() * pts.length, speed: 1.2 + Math.random() * 2.2, life: 1 });
      });
    };

    const reduced = prefersReducedMotion();
    if (reduced) {
      // grow to a finished state off the main path, in small chunks, then draw once
      let done = 0;
      let timer = 0;
      const chunk = () => {
        for (let i = 0; i < 80; i++) step();
        done += 80;
        if (done < 1100) timer = window.setTimeout(chunk, 0);
        else draw();
      };
      chunk();
      return () => clearTimeout(timer);
    }

    let raf = 0;
    let visible = false;
    let frame = 0;
    const loop = () => {
      if (curves[0].length < MAX_NODES || frame % 2 === 0) step();
      frame++;
      if (frame % 50 === 0 && pulses[0].length < 4) spawn(1);
      pulses.forEach((list, ci) => {
        for (const pl of list) {
          pl.pos = (pl.pos + pl.speed) % curves[ci].length;
          pl.life -= 0.004;
        }
        pulses[ci] = list.filter((pl) => pl.life > 0);
      });
      draw();
      if (visible) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      pointer.x = e.clientX - b.left;
      pointer.y = e.clientY - b.top;
    };
    const onLeave = () => {
      pointer.x = -999;
      pointer.y = -999;
    };
    const onThink = () => spawn(5);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    window.addEventListener('agent:think', onThink);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('agent:think', onThink);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`h-full w-full ${className}`} />;
};

export default GrowthBrain;
