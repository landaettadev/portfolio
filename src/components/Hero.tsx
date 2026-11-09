import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, FileDown, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import AnimatedScreens from './AnimatedScreens';
import TechIcon from './TechIcon';
import { MARQUEE } from '../data/tech';
import { askAgent, prefersReducedMotion } from '../hooks/useSpotlight';

/** Prompt box whose placeholder types out real questions, then hands them to the assistant. */
const AskBar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const questions = t('hero.questions', { returnObjects: true }) as string[];
  const [value, setValue] = useState('');
  const [typed, setTyped] = useState('');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!Array.isArray(questions) || questions.length === 0) return;
    if (prefersReducedMotion()) {
      setTyped(questions[0]);
      return;
    }
    let q = 0;
    let i = 0;
    let deleting = false;
    let timer: number;
    const tick = () => {
      const full = questions[q];
      if (!deleting) {
        i++;
        setTyped(full.slice(0, i));
        if (i === full.length) {
          deleting = true;
          timer = window.setTimeout(tick, 2200);
          return;
        }
        timer = window.setTimeout(tick, 45 + Math.random() * 40);
      } else {
        i -= 2;
        setTyped(full.slice(0, Math.max(i, 0)));
        if (i <= 0) {
          deleting = false;
          q = (q + 1) % questions.length;
          timer = window.setTimeout(tick, 400);
          return;
        }
        timer = window.setTimeout(tick, 18);
      }
    };
    timer = window.setTimeout(tick, 900);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim() || typed;
    if (!q) return;
    askAgent(q);
    setValue('');
  };

  return (
    <form onSubmit={submit} className="border-beam group mt-2.5 rounded-2xl" aria-label={t('hero.askLabel')}>
      <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-night-800/80 p-2 pl-4 shadow-[0_20px_80px_-20px_rgba(139,92,246,.5)] backdrop-blur-xl">
        <Sparkles size={18} className="shrink-0 text-glow" aria-hidden="true" />
        <label htmlFor="hero-ask" className="sr-only">
          {t('hero.askLabel')}
        </label>
        <div className="relative min-w-0 flex-1">
          <input
            id="hero-ask"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete="off"
            className="w-full border-0 bg-transparent p-0 py-2 text-[15px] text-white placeholder-transparent focus:ring-0"
            placeholder={t('hero.askLabel')}
          />
          {!value && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex items-center truncate text-[15px] text-text-muted">
              {focused ? t('hero.askLabel') : typed}
              <span className="ml-0.5 inline-block h-4 w-[2px] animate-caret bg-glow" />
            </span>
          )}
        </div>
        <button
          type="submit"
          aria-label={t('hero.askButton')}
          className="flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-sm font-medium text-night-950 transition-transform hover:scale-[1.03]"
        >
          <span className="hidden sm:inline">{t('hero.askButton')}</span>
          <ArrowUp size={16} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
};

const Hero: React.FC = () => {
  const { t, i18n } = useTranslation();
  const pcLayerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Parallax on the workstation illustration
  useEffect(() => {
    const pcLayer = pcLayerRef.current;
    if (!pcLayer || 'ontouchstart' in window || prefersReducedMotion()) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 16;
      ty = (e.clientY / window.innerHeight - 0.5) * 10;
    };
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      pcLayer.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const cvHref = i18n.language?.startsWith('es') ? '/cv-es.pdf' : '/cv-en.pdf';
  const enter = (delay: number) => ({
    // transform-only entrance: text is painted on the first frame, so it never delays LCP
    initial: { y: 14 },
    animate: { y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id="home" className="relative isolate flex min-h-screen flex-col overflow-hidden pt-28">
      {/* Sky: violet dusk fading into the page */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_70%_at_72%_22%,rgba(42,29,87,.9)_0%,rgba(18,10,42,.55)_45%,transparent_80%)]" />
      <div aria-hidden="true" className="absolute -right-40 top-1/3 -z-10 h-[520px] w-[520px] rounded-full bg-glow/[0.07] blur-[120px]" />

      <div className="container mx-auto flex flex-1 flex-col items-center gap-12 px-5 sm:px-6 lg:flex-row lg:justify-between lg:gap-8 lg:px-12">
        <div className="w-full max-w-xl shrink-0 text-left lg:max-w-[540px]">
          <motion.a
            {...enter(0)}
            href="#contact"
            className="inline-flex items-center gap-2.5 rounded-full border border-leaf/25 bg-leaf/[0.07] py-1 pl-2 pr-3.5 text-sm text-leaf"
          >
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-leaf" />
            {t('hero.available')}
          </motion.a>

          <motion.h1
            {...enter(0.06)}
            className="mt-6 font-display text-[clamp(3.25rem,8.6vw,6.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-white"
          >
            {t('hero.name')}
            <br />
            {t('hero.lastName')}
          </motion.h1>

          <motion.p {...enter(0.12)} className="mt-6 font-display text-xl font-semibold tracking-tight text-glow sm:text-2xl">
            {t('hero.role')}
          </motion.p>
          <motion.p {...enter(0.16)} className="mt-1.5 text-balance font-display text-2xl font-semibold leading-tight text-white sm:text-[1.75rem]">
            {t('hero.tagline')}
          </motion.p>

          <motion.p {...enter(0.22)} className="mt-4 max-w-[34rem] text-base leading-relaxed text-text-muted sm:text-[1.0625rem]">
            {t('hero.description')}
          </motion.p>

          <motion.div {...enter(0.28)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#projects" className="btn-primary">
              {t('hero.viewProjects')}
            </a>
            <a href={cvHref} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <FileDown size={17} aria-hidden="true" />
              {t('hero.downloadCV')}
            </a>
          </motion.div>

          <motion.div {...enter(0.36)} className="mt-8">
            <p className="text-sm text-text-muted">{t('hero.askHint')}</p>
            <AskBar />
          </motion.div>
        </div>

        {/* Workstation illustration with parallax */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[680px] lg:-mr-10 lg:max-w-none lg:flex-1 xl:-mr-20"
        >
          <div ref={pcLayerRef} className="parallax-layer">
            <div className="relative aspect-[1026/513] w-full [mask-image:linear-gradient(to_bottom,#000_88%,transparent_100%)]">
              {/* light spilling from the monitors */}
              <div aria-hidden="true" className="absolute left-[28%] top-[-6%] h-[62%] w-[52%] animate-screen-breathe rounded-full bg-[radial-gradient(closest-side,rgba(94,234,212,.22),rgba(139,92,246,.12)_55%,transparent)] blur-2xl" />
              <picture>
                <source srcSet="/assets/index.webp" type="image/webp" />
                <img
                  src="/assets/index.png"
                  width={1026}
                  height={513}
                  fetchPriority="high"
                  decoding="async"
                  alt={i18n.language?.startsWith('es') ? 'Desarrollador programando de noche frente a tres monitores' : 'Developer coding at night in front of three monitors'}
                  className="pointer-events-none relative h-full w-full select-none"
                  draggable="false"
                />
              </picture>
              <AnimatedScreens isMobile={isMobile} />
              {/* silhouette + bezels redrawn above the live screens */}
              <picture>
                <source srcSet="/assets/index-fg.webp" type="image/webp" />
                <img src="/assets/index-fg.png" width={1026} height={513} alt="" aria-hidden="true" decoding="async" className="pointer-events-none absolute inset-0 h-full w-full select-none" draggable="false" />
              </picture>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stack marquee */}
      <div className="relative mt-12 border-y border-white/[0.06] bg-night-950/60 py-5">
        <div className="container mx-auto flex items-center gap-6 px-5 lg:px-12">
          <span className="hidden shrink-0 text-sm text-text-muted md:block">{t('hero.clouds')}</span>
          <div className="marquee-mask relative flex-1 overflow-hidden">
            <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
              {[...MARQUEE, ...MARQUEE].map((tech, i) => (
                <span key={`${tech.name}-${i}`} className="flex items-center gap-2.5 whitespace-nowrap text-sm text-white/70" aria-hidden={i >= MARQUEE.length}>
                  <TechIcon name={tech.name} icon={tech.icon} size={20} />
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
