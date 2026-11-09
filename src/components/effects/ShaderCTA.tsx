import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Sparkles } from 'lucide-react';
import { askAgent, prefersReducedMotion } from '../../hooks/useSpotlight';
import ShaderCanvas, { CLOUDS_FRAG } from './ShaderCanvas';
import AgentNetwork from './AgentNetwork';

const STEP_MS = 480;

/** Neon 3·2·1 with a draining ring — the hook before the CTA message lands. */
const Countdown: React.FC<{ n: number }> = ({ n }) => (
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
    <svg viewBox="0 0 200 200" className="absolute h-56 w-56 -rotate-90 md:h-72 md:w-72">
      <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="3" />
      <circle
        key={n}
        cx="100"
        cy="100"
        r="88"
        fill="none"
        stroke="url(#cd-grad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="553"
        style={{ animation: `cd-drain ${STEP_MS}ms linear forwards`, filter: 'drop-shadow(0 0 8px #5EEAD4)' }}
      />
      <defs>
        <linearGradient id="cd-grad" x1="0" x2="1">
          <stop offset="0" stopColor="#5EEAD4" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
    <span
      key={`n${n}`}
      className="font-display text-[9rem] font-extrabold leading-none text-white md:text-[12rem]"
      style={{ animation: `cd-pop ${STEP_MS}ms cubic-bezier(.22,1,.36,1) forwards`, textShadow: '0 0 24px #5EEAD4, 0 0 60px rgba(139,92,246,.8)' }}
    >
      {n}
    </span>
  </div>
);

const ShaderCTA: React.FC = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ threshold: 0.55, triggerOnce: true });
  const [count, setCount] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setRevealed(true);
      return;
    }
    const timers = [3, 2, 1].map((n, i) => window.setTimeout(() => setCount(n), i * STEP_MS));
    timers.push(
      window.setTimeout(() => {
        setCount(null);
        setRevealed(true);
      }, 3 * STEP_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const reveal = (delay: number) => ({
    style: { transitionDelay: `${delay}ms` },
    className: `transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${revealed ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-4 opacity-0 blur-sm'}`,
  });

  return (
    <section id="cta" className="relative py-12 md:py-20" aria-labelledby="cta-title">
      <div className="container mx-auto px-5 sm:px-6 lg:px-12">
        <div ref={ref} className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-night-950">
          <ShaderCanvas frag={CLOUDS_FRAG} still={20} />
          <AgentNetwork />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_center,rgba(7,4,15,.7)_0%,rgba(7,4,15,.25)_70%,transparent_100%)]" aria-hidden="true" />
          {count !== null && <Countdown n={count} />}
          <div className="relative flex min-h-[480px] flex-col items-center justify-center px-6 py-20 text-center">
            <h2 id="cta-title" {...reveal(0)}>
              <span className="block max-w-3xl text-balance font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white md:text-6xl">{t('cta.title')}</span>
            </h2>
            <p {...reveal(120)}>
              <span className="mt-5 block max-w-xl text-lg leading-relaxed text-white/75">{t('cta.body')}</span>
            </p>
            <div {...reveal(240)}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#contact" className="btn-primary">
                  {t('cta.primary')}
                </a>
                <button type="button" onClick={() => askAgent()} className="btn-secondary !border-white/25 !bg-white/[0.08] hover:!bg-white/[0.14]">
                  <Sparkles size={16} aria-hidden="true" /> {t('cta.secondary')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShaderCTA;
