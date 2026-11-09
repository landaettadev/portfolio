import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { Bot, Cloud, MessagesSquare, BrainCircuit, LineChart, RotateCcw, Database, Layers, FileCheck2, ListChecks, ChevronRight } from 'lucide-react';
import { prefersReducedMotion, spotlightMove } from '../hooks/useSpotlight';
import GrowthBrain from './effects/GrowthBrain';
import Nebula from './effects/Nebula';

/**
 * A replay of one request through the EAFIT certificates agent (Copilot Studio
 * in Microsoft Teams), drawn as an Application Insights–style waterfall.
 * Spans are timed in ms on a 0–1000 axis; `child` spans are tool calls.
 */
const SPANS = [
  { key: 'user', op: 'teams.message', start: 0, end: 40, color: '#A49CC2', Icon: MessagesSquare, child: false },
  { key: 'agent', op: 'copilot.topic.estado_certificado', start: 40, end: 190, color: '#8B5CF6', Icon: Bot, child: false },
  { key: 'tramite', op: 'GET /api/tramites/{doc}', start: 190, end: 360, color: '#34D399', Icon: FileCheck2, child: true },
  { key: 'sapiencia', op: 'sapiencia.validar_lista', start: 360, end: 540, color: '#34D399', Icon: ListChecks, child: true },
  { key: 'llm', op: 'copilot.generative_answer', start: 540, end: 880, color: '#5EEAD4', Icon: BrainCircuit, child: false },
  { key: 'obs', op: 'appinsights.track', start: 880, end: 920, color: '#A49CC2', Icon: LineChart, child: false },
] as const;

const TOTAL = 1000;
const PLAYBACK = 3.2; // real ms per trace ms

const CARDS = [
  { key: 'agents', Icon: Bot, tags: ['Copilot Studio', 'BotFramework', 'OpenAI'], span: 'md:col-span-2' },
  { key: 'genai', Icon: BrainCircuit, tags: ['Gemini', 'BigQuery', 'Cloud Run'], span: '' },
  { key: 'cloud', Icon: Cloud, tags: ['Azure', 'GCP', 'GitHub Actions'], span: '' },
  { key: 'fullstack', Icon: Layers, tags: ['.NET', 'C#', 'Angular 20', 'React'], span: '' },
  { key: 'ml', Icon: Database, tags: ['Python', 'Teradata', 'React'], span: '' },
] as const;

const AgentTrace: React.FC = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ threshold: 0.35, triggerOnce: true });
  const [clock, setClock] = useState(0); // trace time in ms
  const raf = useRef(0);
  const [hovered, setHovered] = useState<string | null>(null);

  const play = useCallback(() => {
    cancelAnimationFrame(raf.current);
    window.dispatchEvent(new Event('agent:think'));
    if (prefersReducedMotion()) {
      setClock(TOTAL);
      return;
    }
    const t0 = performance.now();
    const loop = (now: number) => {
      const c = Math.min((now - t0) / PLAYBACK, TOTAL);
      setClock(c);
      if (c < TOTAL) raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (inView) play();
    return () => cancelAnimationFrame(raf.current);
  }, [inView, play]);

  const answer = t('ai.answer');
  // The answer streams in while the model span runs, finishing just after it closes.
  const streamProgress = Math.max(0, Math.min(1, (clock - 540) / 360));
  const streamed = answer.slice(0, Math.round(answer.length * streamProgress));
  const done = clock >= TOTAL;
  const activeSpan = SPANS.filter((s) => clock >= s.start && clock < s.end).pop();

  return (
    <section id="ai" className="section isolate">
      <Nebula variant="violet" className="-right-[10%] top-0 h-[700px] w-[70%]" />
      <div className="container mx-auto px-5 sm:px-6 lg:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
          <div className="max-w-3xl">
            <h2 className="section-title">{t('ai.title')}</h2>
            <p className="section-lede">{t('ai.lede')}</p>
          </div>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-[460px]">
            <div aria-hidden="true" className="absolute inset-[15%] rounded-full bg-volt/20 blur-3xl" />
            <GrowthBrain className="relative" />
          </div>
        </div>

        {/* Gradient hairline frame gives the console depth without heavy glow */}
        <div ref={ref} className="mt-14 rounded-[1.6rem] bg-gradient-to-b from-white/[0.14] via-white/[0.05] to-white/[0.02] p-px shadow-[0_1px_0_rgba(255,255,255,.06)_inset,0_30px_80px_-30px_rgba(0,0,0,.9),0_40px_120px_-60px_rgba(94,234,212,.35)]">
        <div className="overflow-hidden rounded-[calc(1.6rem-1px)] bg-night-900/90">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.015] px-4 py-3 sm:px-5">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </div>
              <span className="truncate font-mono text-xs text-text-muted">eafit-certificados-agent / trace</span>
              <span className="whitespace-nowrap rounded-full border border-volt/30 bg-volt/10 px-2 py-0.5 text-[11px] text-violet-200">{t('ai.simulated')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={play}
                className="flex min-h-[32px] items-center gap-1.5 rounded-full px-3 text-xs text-text-muted transition-colors hover:bg-white/5 hover:text-white"
              >
                <RotateCcw size={13} aria-hidden="true" /> {t('ai.replay')}
              </button>
            </div>
          </div>

          {/* Workflow strip: each stage lights up as the trace reaches it */}
          <ol aria-label={t('ai.flowLabel')} className="flex items-center gap-1 overflow-x-auto border-b border-white/[0.07] px-4 py-2.5 sm:px-5 [scrollbar-width:none]">
            {SPANS.map((s, i) => {
              const state = clock >= s.end ? 'done' : clock >= s.start ? 'run' : 'idle';
              return (
                <li key={s.key} className="flex shrink-0 items-center gap-1">
                  {i > 0 && <ChevronRight size={12} className="text-white/20" aria-hidden="true" />}
                  <span
                    className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors duration-300 ${
                      state === 'run' ? 'bg-white/[0.08] text-white' : state === 'done' ? 'text-white/80' : 'text-white/35'
                    } ${hovered === s.key ? 'ring-1 ring-white/20' : ''}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full transition-colors" style={{ background: state === 'idle' ? 'rgba(255,255,255,.2)' : s.color }} aria-hidden="true" />
                    {t(`ai.nodes.${s.key}.title`)}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* Conversation */}
            <div className="flex min-w-0 flex-col gap-4 border-b border-white/[0.07] p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <p className="flex items-center gap-2 text-xs text-text-muted">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-[#4B53BC] text-[10px] font-bold text-white" aria-hidden="true">T</span>
                Microsoft Teams
              </p>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={clock > 0 ? { opacity: 1, y: 0 } : {}}
                className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-white/[0.08] px-4 py-3 text-[15px] text-white"
              >
                {t('ai.question')}
              </motion.div>

              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-glow to-volt text-night-950">
                  <Bot size={16} aria-hidden="true" />
                </span>
                <div className="min-h-[88px] flex-1 rounded-2xl rounded-tl-md border border-white/[0.07] bg-night-800/60 px-4 py-3 text-[15px] leading-relaxed text-white/90" aria-live="polite">
                  {streamed ? (
                    <>
                      {streamed}
                      {!done && <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-caret bg-glow" />}
                    </>
                  ) : (
                    <span className="font-mono text-xs text-text-muted">
                      {activeSpan ? `${t(`ai.nodes.${activeSpan.key}.title`)}…` : ''}
                    </span>
                  )}
                </div>
              </div>

              <dl className="mt-auto grid grid-cols-3 gap-2 pt-4 text-xs">
                {[
                  ['latency', `${Math.round(Math.min(clock, 920))} ms`],
                  ['tokens', `${Math.round(312 * streamProgress)}`],
                  ['status', done ? '200 OK' : '…'],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-white/[0.06] px-3 py-2">
                    <dt className="font-mono text-text-muted">{k}</dt>
                    <dd className={`mt-0.5 font-mono tabular-nums ${k === 'status' && done ? 'text-leaf' : 'text-white'}`}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Waterfall */}
            <div className="p-6">
              <div className="relative">
                {/* time ruler */}
                <div className="mb-3 ml-[38%] flex justify-between font-mono text-[10px] text-text-muted sm:ml-[42%]" aria-hidden="true">
                  {[0, 250, 500, 750, 1000].map((ms) => (
                    <span key={ms}>{ms}</span>
                  ))}
                </div>
                <ol className="space-y-2">
                  {SPANS.map((s) => {
                    const started = clock >= s.start;
                    const width = Math.max(0, Math.min(clock, s.end) - s.start);
                    const running = started && clock < s.end;
                    return (
                      <li
                        key={s.key}
                        onMouseEnter={() => setHovered(s.key)}
                        onMouseLeave={() => setHovered(null)}
                        className={`-mx-2 grid grid-cols-[38%_1fr] items-center gap-0 rounded-lg px-2 py-0.5 transition-colors sm:grid-cols-[42%_1fr] ${hovered === s.key ? 'bg-white/[0.04]' : ''}`}
                      >
                        <div className={`flex min-w-0 items-center gap-2.5 pr-3 transition-opacity duration-300 ${started ? 'opacity-100' : 'opacity-40'}`} style={{ paddingLeft: s.child ? 18 : 0 }}>
                          <span
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border"
                            style={{ borderColor: `${s.color}55`, color: s.color, boxShadow: running ? `0 0 18px ${s.color}66` : 'none' }}
                          >
                            <s.Icon size={14} aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">{t(`ai.nodes.${s.key}.title`)}</p>
                            <p className="hidden truncate text-xs text-text-muted sm:block">{t(`ai.nodes.${s.key}.detail`)}</p>
                          </div>
                        </div>
                        <div className="relative h-7 rounded-md bg-white/[0.03]">
                          {[25, 50, 75].map((p) => (
                            <span key={p} className="absolute inset-y-0 w-px bg-white/[0.05]" style={{ left: `${p}%` }} aria-hidden="true" />
                          ))}
                          <div
                            className="absolute inset-y-1 rounded"
                            style={{
                              left: `${(s.start / TOTAL) * 100}%`,
                              width: `${(width / TOTAL) * 100}%`,
                              background: `linear-gradient(90deg, ${s.color}cc, ${s.color})`,
                              boxShadow: running ? `0 0 16px ${s.color}88` : 'none',
                            }}
                          />
                          <span
                            className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-2 font-mono text-[10px] text-white/70 transition-opacity ${clock >= s.end ? 'opacity-100' : 'opacity-0'}`}
                            style={s.end - s.start >= 300 ? { right: `${100 - (s.end / TOTAL) * 100}%`, paddingRight: 8, color: '#07040F' } : { left: `${(s.end / TOTAL) * 100}%` }}
                          >
                            {s.end - s.start} ms
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
                {/* playhead */}
                <div className="pointer-events-none absolute bottom-0 top-6 ml-[38%] w-[62%] sm:ml-[42%] sm:w-[58%]" aria-hidden="true">
                  <div className="absolute inset-y-0 w-px bg-glow/70 shadow-[0_0_12px_#5EEAD4]" style={{ left: `${(clock / TOTAL) * 100}%`, opacity: done ? 0 : 1 }} />
                </div>
              </div>
              <p className="mt-5 truncate font-mono text-xs text-text-muted">
                {hovered
                  ? `${SPANS.find((s) => s.key === hovered)!.op}  ·  ${SPANS.find((s) => s.key === hovered)!.end - SPANS.find((s) => s.key === hovered)!.start} ms`
                  : SPANS.filter((s) => clock >= s.end).map((s) => s.op).join('  ›  ') || ' '}
              </p>
            </div>
          </div>
        </div>
        </div>

        {/* What I build */}
        <h3 className="mt-16 font-display text-2xl font-semibold tracking-tight text-white">{t('ai.capabilitiesTitle')}</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {CARDS.map(({ key, Icon, tags, span }) => (
            <article key={key} onPointerMove={spotlightMove} className={`spotlight card flex flex-col ${span}`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-glow">
                <Icon size={19} aria-hidden="true" />
              </span>
              <h4 className="mt-5 font-display text-lg font-semibold text-white sm:text-xl">{t(`ai.cards.${key}.title`)}</h4>
              <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-text-muted">{t(`ai.cards.${key}.body`)}</p>
              <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
                {tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-white/[0.08] px-2.5 py-0.5 text-xs text-white/70">
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentTrace;
