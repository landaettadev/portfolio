import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../hooks/useSpotlight';

/**
 * A field of short filings that align to a magnetic dipole: one pole follows
 * the pointer, the other drifts slowly. Without a pointer both poles orbit.
 */
const IronFilings: React.FC<{ className?: string }> = ({ className = '' }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const host = canvas.parentElement!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const GAP = 22;
    const LEN = 8;
    let W = 0, H = 0;
    let pts: { x: number; y: number }[] = [];

    const resize = () => {
      W = host.clientWidth;
      H = host.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = [];
      for (let y = GAP / 2; y < H; y += GAP) for (let x = GAP / 2; x < W; x += GAP) pts.push({ x, y });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let px = -1, py = -1, sx = 0, sy = 0, hasPointer = false;
    const onMove = (e: PointerEvent) => {
      const b = host.getBoundingClientRect();
      px = e.clientX - b.left;
      py = e.clientY - b.top;
      hasPointer = true;
    };
    const onLeave = () => (hasPointer = false);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);

    const reduced = prefersReducedMotion();
    let raf = 0;
    let visible = false;
    const t0 = performance.now();

    const draw = () => {
      const t = (performance.now() - t0) / 1000;
      // pole A: pointer (or orbit), pole B: slow drift
      const ax = hasPointer ? px : W * (0.5 + 0.3 * Math.cos(t * 0.25));
      const ay = hasPointer ? py : H * (0.5 + 0.3 * Math.sin(t * 0.31));
      sx += (ax - sx) * 0.12;
      sy += (ay - sy) * 0.12;
      const bx = W * (0.5 + 0.28 * Math.cos(t * 0.17 + 2));
      const by = H * (0.5 + 0.32 * Math.sin(t * 0.13 + 1));

      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';
      ctx.lineWidth = 1.4;
      for (const p of pts) {
        const dx1 = p.x - sx, dy1 = p.y - sy;
        const dx2 = p.x - bx, dy2 = p.y - by;
        const r1 = Math.max(dx1 * dx1 + dy1 * dy1, 400);
        const r2 = Math.max(dx2 * dx2 + dy2 * dy2, 400);
        const f1 = 1 / (r1 * Math.sqrt(r1));
        const f2 = 1 / (r2 * Math.sqrt(r2));
        const ex = dx1 * f1 - dx2 * f2;
        const ey = dy1 * f1 - dy2 * f2;
        const mag = Math.hypot(ex, ey);
        const ang = Math.atan2(ey, ex);
        const near = Math.min(1, 6 / Math.sqrt(Math.min(r1, r2)) * 4);
        const alpha = 0.08 + Math.min(0.55, mag * 2.2e4) * 0.6 + near * 0.15;
        const hx = Math.cos(ang) * LEN * 0.5;
        const hy = Math.sin(ang) * LEN * 0.5;
        const mix = Math.min(1, Math.sqrt(r1) / Math.sqrt(r1 + r2) * 1.4);
        ctx.strokeStyle = `rgba(${Math.round(94 + (139 - 94) * mix)},${Math.round(234 + (92 - 234) * mix)},${Math.round(212 + (246 - 212) * mix)},${Math.min(alpha, 0.85)})`;
        ctx.beginPath();
        ctx.moveTo(p.x - hx, p.y - hy);
        ctx.lineTo(p.x + hx, p.y + hy);
        ctx.stroke();
      }
      if (visible && !reduced) raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) draw();
    });
    io.observe(host);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`} />;
};

export default IronFilings;
