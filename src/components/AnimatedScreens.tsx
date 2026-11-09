import React, { useEffect, useRef, useState } from 'react';
import { onIdle, prefersReducedMotion } from '../hooks/useSpotlight';

/**
 * Live content for the three monitors in /assets/index.png (1026×513).
 * Each screen is positioned in image pixels; a silhouette-only copy of the
 * illustration (index-fg.png) is layered on top by the parent so the person
 * and bezels stay in front of the code.
 */
const IMG_W = 1026;
const IMG_H = 513;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  /** optional quad (image px) for tilted monitors */
  quad?: [number, number][];
}

const SCREENS: Record<'left' | 'center' | 'right', Rect> = {
  left: { x: 205, y: 78, w: 118, h: 150, quad: [[207, 80], [322, 87], [321, 226], [208, 226]] },
  center: { x: 330, y: 6, w: 371, h: 215 },
  right: { x: 707, y: 104, w: 111, h: 124, quad: [[710, 112], [816, 105], [812, 224], [708, 227]] },
};

const pos = ({ x, y, w, h, quad }: Rect): React.CSSProperties => ({
  position: 'absolute',
  left: `${(x / IMG_W) * 100}%`,
  top: `${(y / IMG_H) * 100}%`,
  width: `${(w / IMG_W) * 100}%`,
  height: `${(h / IMG_H) * 100}%`,
  clipPath: quad ? `polygon(${quad.map(([qx, qy]) => `${((qx - x) / w) * 100}% ${((qy - y) / h) * 100}%`).join(',')})` : undefined,
});

/* ---------------- code + highlighting ---------------- */

const CODE = [
  'export async function* agent(question: string) {',
  '  const context = await vectors.search(embed(question), { k: 6 });',
  '',
  '  const stream = llm.stream({',
  '    system: "Answer only from verified context.",',
  '    tools: [sqlQuery, searchDocs, createTicket],',
  '    messages: [...memory.recall(), { role: "user", content: question }],',
  '    context,',
  '  });',
  '',
  '  for await (const token of stream) yield token;',
  '  telemetry.track("agent.answer", { tokens: stream.usage });',
  '}',
];

const KEYWORDS = new Set(['export', 'async', 'function*', 'function', 'await', 'const', 'for', 'of', 'yield', 'return']);
const TYPES = new Set(['string']);

const OBJECTS = new Set(['vectors', 'llm', 'memory', 'telemetry', 'stream']);

const highlight = (line: string) => {
  const toks = line.split(/(\s+|[(){}<>.,;:=[\]]+|"[^"]*"?)/).filter(Boolean);
  return toks.map((tok, i) => {
    let color = '#D6D3E8';
    if (KEYWORDS.has(tok)) color = '#C4B5FD';
    else if (TYPES.has(tok)) color = '#5EEAD4';
    else if (tok.startsWith('"')) color = '#86EFAC';
    else if (/^\w+$/.test(tok) && toks[i + 1]?.startsWith('(')) color = '#FDE68A';
    else if (OBJECTS.has(tok)) color = '#F0ABFC';
    else if (/^\d/.test(tok)) color = '#FDBA74';
    else if (/^[(){}<>.,;:=[\]]+$/.test(tok)) color = '#8B85A8';
    return (
      <span key={i} style={{ color }}>
        {tok}
      </span>
    );
  });
};

/** Loops 0 → total, advancing `step` every `ms`, holding `hold` ms at the end. */
const useLoop = (total: number, ms: number, hold: number, step = 1, startDelay = 0) => {
  const [n, setN] = useState(() => (prefersReducedMotion() ? total : 0));
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let v = 0;
    let timer: number;
    const tick = () => {
      if (v >= total) {
        timer = window.setTimeout(() => {
          v = 0;
          setN(0);
          timer = window.setTimeout(tick, ms);
        }, hold);
        return;
      }
      v = Math.min(total, v + step);
      setN(v);
      timer = window.setTimeout(tick, ms * (0.6 + Math.random() * 0.8));
    };
    timer = window.setTimeout(tick, startDelay);
    return () => window.clearTimeout(timer);
  }, [total, ms, hold, step, startDelay]);
  return n;
};

const Caret: React.FC<{ color?: string }> = ({ color = '#5EEAD4' }) => (
  <span className="inline-block animate-caret align-[-0.1em]" style={{ width: '0.55em', height: '1.05em', background: color, boxShadow: `0 0 6px ${color}` }} />
);

/* ---------------- center: editor ---------------- */

const TOTAL_CHARS = CODE.reduce((s, l) => s + l.length + 1, 0);

const Editor: React.FC = () => {
  const typed = useLoop(TOTAL_CHARS, 34, 3800, 1, 600);
  let left = typed;
  const rendered = CODE.map((line) => {
    const take = Math.max(0, Math.min(line.length, left));
    const partial = left >= 0 && left <= line.length;
    left -= line.length + 1;
    return { text: line.slice(0, take), active: partial };
  });
  const activeLine = Math.max(0, rendered.findIndex((r) => r.active));

  return (
    <div className="flex h-full flex-col bg-[#15111f] font-mono text-[1.02cqw] leading-[1.55]">
      <div className="flex items-center gap-[1em] border-b border-white/5 bg-[#0f0c18] px-[0.8em] py-[0.35em] text-[#8B85A8]">
        <span className="text-white/80">agent.ts</span>
        <span>tools.ts</span>
        <span className="ml-auto text-[#5EEAD4]">● Copilot</span>
      </div>
      <div className="relative flex-1 overflow-hidden px-[0.6em] pt-[0.5em]">
        {rendered.map((r, i) => {
          const shown = i <= activeLine || typed >= TOTAL_CHARS;
          if (!shown) return null;
          return (
            <div key={i} className={`flex whitespace-pre ${i === activeLine && typed < TOTAL_CHARS ? 'bg-white/[0.04]' : ''}`}>
              <span className="mr-[1em] inline-block w-[1.6em] text-right text-[#4B4566]">{i + 1}</span>
              <span>
                {highlight(r.text)}
                {i === activeLine && typed < TOTAL_CHARS && <Caret />}
              </span>
            </div>
          );
        })}
        {typed >= TOTAL_CHARS && (
          <div className="mt-[0.6em] whitespace-pre pl-[2.6em] text-[#5EEAD4]">
            ✓ agent.ts compiled <span className="text-[#8B85A8]">streaming ready</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- left: terminal ---------------- */

const TERMINAL: { t: string; c: string }[] = [
  { t: '$ npm run eval', c: '#EEEAFB' },
  { t: '› running eval suite', c: '#A49CC2' },
  { t: '✓ grounding checks', c: '#34D399' },
  { t: '✓ tool-call checks', c: '#34D399' },
  { t: '✓ latency budget', c: '#34D399' },
  { t: 'all checks passed', c: '#5EEAD4' },
  { t: '$ azd deploy agent', c: '#EEEAFB' },
  { t: '████████░░', c: '#8B5CF6' },
  { t: '✓ deployed', c: '#34D399' },
];

const Terminal: React.FC = () => {
  const n = useLoop(TERMINAL.length, 650, 2600, 1, 1200);
  const visible = TERMINAL.slice(Math.max(0, n - 7), n);
  return (
    <div className="flex h-full flex-col justify-end bg-[#0d0b14] p-[0.7em] font-mono text-[0.86cqw] leading-[1.6]">
      {visible.map((l) => (
        <div key={l.t} className="truncate" style={{ color: l.c }}>
          {l.t}
        </div>
      ))}
      <div>
        <span className="text-[#5EEAD4]">❯ </span>
        <Caret color="#EEEAFB" />
      </div>
    </div>
  );
};

/* ---------------- right: next-token probabilities ---------------- */

const SENTENCE = ['The', 'agent', 'retrieved', 'the', 'documents', 'and', 'answered', 'with', 'sources'];
const CANDIDATES: string[][] = [
  ['The', 'An', 'Our'],
  ['agent', 'model', 'system'],
  ['retrieved', 'found', 'read'],
  ['the', 'relevant', 'six'],
  ['documents', 'chunks', 'files'],
  ['and', 'then', ','],
  ['answered', 'replied', 'cited'],
  ['with', 'using', 'from'],
  ['sources', 'citations', 'context'],
];
// deterministic pseudo-probabilities per step
const probs = (i: number) => {
  const top = 0.52 + ((i * 37) % 40) / 100;
  const second = (1 - top) * 0.62;
  return [top, second, 1 - top - second];
};

const NextToken: React.FC = () => {
  const n = useLoop(SENTENCE.length, 700, 2800, 1, 1600);
  const step = Math.min(n, SENTENCE.length - 1);
  const p = probs(step);
  return (
    <div className="flex h-full flex-col bg-[#120e1f] p-[0.6em] font-mono text-[0.74cqw] leading-[1.35] text-white">
      <div className="flex items-center justify-between text-[#8B85A8]">
        <span>next token</span>
        <span className="text-[#5EEAD4]">t={step + 1}</span>
      </div>
      <p className="mt-[0.5em] min-h-[3.2em] text-white/85">
        {SENTENCE.slice(0, n).join(' ')}
        <Caret />
      </p>
      <div className="mt-auto space-y-[0.35em]">
        {CANDIDATES[step].map((c, i) => (
          <div key={c + i} className="flex items-center gap-[0.4em]">
            <span className={`w-[5.2em] truncate ${i === 0 ? 'text-[#5EEAD4]' : 'text-[#8B85A8]'}`}>{c}</span>
            <span className="h-[0.55em] flex-1 overflow-hidden rounded-full bg-white/5">
              <span
                className="block h-full rounded-full transition-[width] duration-500"
                style={{ width: `${p[i] * 100}%`, background: i === 0 ? 'linear-gradient(90deg,#5EEAD4,#8B5CF6)' : '#4B4566' }}
              />
            </span>
            <span className="w-[2.4em] text-right text-[#8B85A8]">{p[i].toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface AnimatedScreensProps {
  isMobile?: boolean;
}

/** Starts after the page is idle and pauses while the hero is off-screen. */
const useActive = (ref: React.RefObject<HTMLElement>) => {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    return onIdle(() => setReady(true), 2500);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return ready && visible;
};

const Blank: React.FC = () => <div className="h-full w-full bg-[#14101f]" />;

const AnimatedScreens: React.FC<AnimatedScreensProps> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const active = useActive(ref);
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 select-none" style={{ containerType: 'inline-size' }} aria-hidden="true">
      <div style={pos(SCREENS.left)} className="screen-glow">
        {active ? <Terminal /> : <Blank />}
      </div>
      <div style={pos(SCREENS.center)} className="screen-glow">
        {active ? <Editor /> : <Blank />}
      </div>
      <div style={pos(SCREENS.right)} className="screen-glow">
        {active ? <NextToken /> : <Blank />}
      </div>
    </div>
  );
};

export default AnimatedScreens;
