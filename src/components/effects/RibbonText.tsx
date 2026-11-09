import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../hooks/useSpotlight';

/** Two ribbons carrying text along curved paths, drifting in opposite directions. */

const WORDS_A = ['AI agents', 'Azure', 'Copilot Studio', 'RAG', '.NET', 'Angular', 'Google Cloud', 'Observability', 'Evals'];
const WORDS_B = ['Ship to production', 'Measure everything', 'Secure by design', 'Prompt → API → Data', 'Teams · Web · APIs'];

const line = (words: string[]) => Array(6).fill(words.join('   ✦   ')).join('   ✦   ');

const Ribbon: React.FC<{ id: string; d: string; text: string; speed: number; color: string; band: string }> = ({ id, d, text, speed, color, band }) => {
  const tp = useRef<SVGTextPathElement>(null);

  useEffect(() => {
    const el = tp.current;
    if (!el || prefersReducedMotion()) return;
    const textEl = el.parentElement as unknown as SVGTextElement;
    const half = textEl.getComputedTextLength() / 2;
    let off = speed > 0 ? -half : 0;
    let raf = 0;
    let visible = false;
    const tick = () => {
      off += speed;
      if (off > 0) off -= half;
      if (off < -half) off += half;
      el.setAttribute('startOffset', String(off));
      if (visible) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(textEl);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [speed]);

  return (
    <g>
      <path id={id} d={d} fill="none" />
      <use href={`#${id}`} stroke={band} strokeWidth="46" strokeLinecap="round" fill="none" />
      <text className="font-display" fontSize="22" fontWeight="600" fill={color} dominantBaseline="central">
        <textPath ref={tp} href={`#${id}`}>
          {text}
        </textPath>
      </text>
    </g>
  );
};

const RibbonText: React.FC = () => (
  <div className="relative -my-6 overflow-hidden py-2" aria-hidden="true">
    <svg viewBox="0 0 1600 220" preserveAspectRatio="xMidYMid slice" className="h-[150px] w-full md:h-[200px]">
      <defs>
        <linearGradient id="ribbon-a" x1="0" x2="1">
          <stop offset="0" stopColor="#5EEAD4" stopOpacity="0" />
          <stop offset=".2" stopColor="#5EEAD4" stopOpacity=".16" />
          <stop offset=".8" stopColor="#8B5CF6" stopOpacity=".16" />
          <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ribbon-b" x1="0" x2="1">
          <stop offset="0" stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset=".3" stopColor="#8B5CF6" stopOpacity=".12" />
          <stop offset=".7" stopColor="#34D399" stopOpacity=".1" />
          <stop offset="1" stopColor="#34D399" stopOpacity="0" />
        </linearGradient>
      </defs>
      <Ribbon id="rp-b" d="M-100 60 C 300 200, 700 0, 1000 120 S 1500 210, 1700 90" text={line(WORDS_B)} speed={-0.35} color="rgba(196,181,253,.55)" band="url(#ribbon-b)" />
      <Ribbon id="rp-a" d="M-100 150 C 250 20, 650 220, 950 100 S 1450 10, 1700 140" text={line(WORDS_A)} speed={0.5} color="rgba(238,234,251,.9)" band="url(#ribbon-a)" />
    </svg>
  </div>
);

export default RibbonText;
