import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { prefersReducedMotion } from '../../hooks/useSpotlight';

/**
 * Numbers assembled from bars, 7-segment style: unlit segments stay faintly
 * visible like a real display, lit ones grow in with a stagger when in view.
 */

// segment geometry in a 60×100 cell: [x, y, w, h]
const SEG: Record<string, [number, number, number, number]> = {
  a: [10, 0, 40, 9],
  b: [51, 9, 9, 37],
  c: [51, 54, 9, 37],
  d: [10, 91, 40, 9],
  e: [0, 54, 9, 37],
  f: [0, 9, 9, 37],
  g: [10, 45.5, 40, 9],
};

const DIGITS: Record<string, string> = {
  '0': 'abcdef',
  '1': 'bc',
  '2': 'abged',
  '3': 'abgcd',
  '4': 'fgbc',
  '5': 'afgcd',
  '6': 'afgedc',
  '7': 'abc',
  '8': 'abcdefg',
  '9': 'abcfgd',
};

const Cell: React.FC<{ ch: string; lit: boolean; delay: number; id: string }> = ({ ch, lit, delay, id }) => {
  const reduced = prefersReducedMotion();
  if (ch === '+') {
    const bars: [number, number, number, number][] = [
      [8, 45.5, 44, 9],
      [25.5, 28, 9, 44],
    ];
    return (
      <svg viewBox="0 0 60 100" className="h-full w-auto" aria-hidden="true">
        {bars.map(([x, y, w, h], i) => (
          <motion.rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            rx={3}
            fill={`url(#${id})`}
            initial={reduced ? false : { scaleX: w > h ? 0 : 1, scaleY: h > w ? 0 : 1, opacity: 0 }}
            animate={lit ? { scaleX: 1, scaleY: 1, opacity: 1 } : {}}
            transition={{ duration: 0.45, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}
          />
        ))}
      </svg>
    );
  }
  if (ch === '%') {
    return (
      <svg viewBox="0 0 70 100" className="h-full w-auto" aria-hidden="true">
        {[
          [4, 8, 20, 20],
          [46, 72, 20, 20],
        ].map(([x, y, w, h], i) => (
          <motion.rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            rx={4}
            fill={`url(#${id})`}
            initial={reduced ? false : { opacity: 0, scale: 0 }}
            animate={lit ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: delay + i * 0.08 }}
            style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}
          />
        ))}
        <motion.rect
          x={30}
          y={-2}
          width={9}
          height={104}
          rx={3}
          fill={`url(#${id})`}
          transform="rotate(28 35 50)"
          initial={reduced ? false : { scaleY: 0 }}
          animate={lit ? { scaleY: 1 } : {}}
          transition={{ duration: 0.5, delay: delay + 0.1 }}
          style={{ transformOrigin: '35px 50px' }}
        />
      </svg>
    );
  }
  const on = DIGITS[ch] ?? '';
  return (
    <svg viewBox="0 0 60 100" className="h-full w-auto" aria-hidden="true">
      {Object.entries(SEG).map(([k, [x, y, w, h]], i) => {
        const active = on.includes(k);
        const horizontal = w > h;
        return (
          <g key={k}>
            <rect x={x} y={y} width={w} height={h} rx={3} fill="rgba(255,255,255,0.05)" />
            {active && (
              <motion.rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx={3}
                fill={`url(#${id})`}
                initial={reduced ? false : { scaleX: horizontal ? 0 : 1, scaleY: horizontal ? 1 : 0 }}
                animate={lit ? { scaleX: 1, scaleY: 1 } : {}}
                transition={{ duration: 0.45, delay: delay + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: `${x + (horizontal ? 0 : w / 2)}px ${y + (horizontal ? h / 2 : 0)}px` }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

const BarDigits: React.FC<{ value: string; label: string; index?: number }> = ({ value, label, index = 0 }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const gid = `bd-${value.replace(/\W/g, 'x')}-${index}`;
  return (
    <div ref={ref}>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5EEAD4" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex h-12 items-end gap-1.5 drop-shadow-[0_0_14px_rgba(94,234,212,0.35)]" role="img" aria-label={`${value} ${label}`}>
        {value.split('').map((ch, i) => (
          <Cell key={i} ch={ch} lit={inView} delay={index * 0.15 + i * 0.12} id={gid} />
        ))}
      </div>
    </div>
  );
};

export default BarDigits;
