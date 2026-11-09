import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowUp, Check, CornerDownRight, FileDown, Mail, MessageCircle, RotateCcw, Sparkles, X, ArrowRight } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { runAgent, planSteps, type AgentReply } from '../utils/agentEngine';
import { INTENTS, START_CHIPS, type KAction, type Lang } from '../data/knowledge';
import { prefersReducedMotion, scrollToSection } from '../hooks/useSpotlight';

interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  steps?: string[];
  stepsDone?: number;
  sources?: string[];
  followups?: AgentReply['followups'];
  actions?: KAction[];
  streaming?: boolean;
}

type Mode = 'unknown' | 'remote' | 'local';

const uid = () => Math.random().toString(36).slice(2, 10);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** **bold**, line breaks and "•" bullets — the only formatting the agent uses. */
const RichText: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split('\n').map((line, i) => {
      const bullet = line.trimStart().startsWith('•') || line.trimStart().startsWith('- ');
      const content = bullet ? line.trimStart().replace(/^(•|-)\s*/, '') : line;
      const parts = content.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={j} className="font-semibold text-white">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={j}>{p}</React.Fragment>
        )
      );
      if (!line.trim()) return <div key={i} className="h-2" />;
      return bullet ? (
        <div key={i} className="flex gap-2 pl-1">
          <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-glow" />
          <span>{parts}</span>
        </div>
      ) : (
        <p key={i}>{parts}</p>
      );
    })}
  </>
);

const Orb: React.FC<{ size?: number; busy?: boolean }> = ({ size = 32, busy }) => (
  <span className="relative inline-flex shrink-0 items-center justify-center rounded-full" style={{ width: size, height: size }} aria-hidden="true">
    <span className={`absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#5EEAD4,#8B5CF6,#34D399,#5EEAD4)] ${busy ? 'animate-spin' : 'animate-[spin_8s_linear_infinite]'}`} />
    <span className="absolute inset-[2px] rounded-full bg-night-900" />
    <span className="absolute inset-[30%] rounded-full bg-gradient-to-br from-glow to-volt blur-[2px]" />
  </span>
);

const AIAssistant: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang: Lang = i18n.language?.startsWith('en') ? 'en' : 'es';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<Mode>('unknown');
  const [showTip, setShowTip] = useState(false);
  const lastIntents = useRef<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const modeRef = useRef<Mode>('unknown');
  const messagesRef = useRef<ChatMsg[]>([]);
  messagesRef.current = messages;

  useEffect(() => {
    try {
      if (sessionStorage.getItem('agent-tip')) return;
    } catch {
      /* storage unavailable */
    }
    const a = setTimeout(() => setShowTip(true), 3500);
    const b = setTimeout(() => setShowTip(false), 11000);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && isOpen && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const patch = (id: string, p: Partial<ChatMsg>) => setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...p } : m)));

  /** Try Claude via /api/chat; returns false when the endpoint is not available. */
  const streamRemote = async (id: string, history: ChatMsg[]) => {
    if (modeRef.current === 'local') return false;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          messages: history.filter((m) => m.text).map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      const type = res.headers.get('content-type') ?? '';
      if (!res.ok || !res.body || !type.startsWith('text/plain')) throw new Error(String(res.status));
      modeRef.current = 'remote';
      setMode('remote');
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let text = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += dec.decode(value, { stream: true });
        patch(id, { text, stepsDone: 99 });
      }
      return text.trim().length > 0;
    } catch {
      modeRef.current = 'local';
      setMode('local');
      return false;
    }
  };

  const typeOut = async (id: string, full: string) => {
    if (prefersReducedMotion()) return patch(id, { text: full });
    const words = full.split(/(\s+)/);
    let acc = '';
    for (let i = 0; i < words.length; i++) {
      acc += words[i];
      if (i % 3 === 0 || i === words.length - 1) {
        patch(id, { text: acc });
        await sleep(22);
      }
    }
  };

  const send = useCallback(
    async (raw: string) => {
      const q = raw.trim();
      if (!q || busy) return;
      setBusy(true);
      analytics.aiAssistantMessage('custom');

      const userMsg: ChatMsg = { id: uid(), role: 'user', text: q };
      const reply = runAgent(q, lang, lastIntents.current);
      if (reply.intentIds.length) lastIntents.current = reply.intentIds;
      const steps = planSteps(reply, lang);
      const aid = uid();
      const history = [...messagesRef.current, userMsg];
      setMessages((prev) => [...prev, userMsg, { id: aid, role: 'assistant', text: '', steps, stepsDone: 0, streaming: true }]);

      // Plan steps tick while the answer is prepared
      for (let s = 1; s <= steps.length - 1; s++) {
        await sleep(prefersReducedMotion() ? 0 : 380);
        patch(aid, { stepsDone: s });
      }

      const remote = await streamRemote(aid, history);
      if (!remote) await typeOut(aid, reply.text);
      patch(aid, {
        streaming: false,
        stepsDone: steps.length,
        sources: reply.sources,
        followups: reply.followups,
        actions: reply.actions,
      });
      setBusy(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [busy, lang]
  );

  const sendRef = useRef(send);
  sendRef.current = send;

  const open = useCallback(() => {
    setIsOpen(true);
    setShowTip(false);
    try {
      sessionStorage.setItem('agent-tip', '1');
    } catch {
      /* ignore */
    }
    analytics.aiAssistantOpen();
  }, []);

  // Hero prompt / command palette hand questions over through this event
  useEffect(() => {
    const onAsk = (e: Event) => {
      open();
      const q = (e as CustomEvent<string>).detail;
      if (q) setTimeout(() => sendRef.current(q), 250);
    };
    window.addEventListener('ai:ask', onAsk);
    return () => window.removeEventListener('ai:ask', onAsk);
  }, [open]);

  const runAction = (a: KAction) => {
    if (a.kind === 'scroll') {
      scrollToSection(a.target);
      if (window.innerWidth < 640) setIsOpen(false);
    } else if (a.kind === 'link') {
      window.open(lang === 'es' ? '/cv-es.pdf' : '/cv-en.pdf', '_blank', 'noopener');
    } else if (a.kind === 'whatsapp') {
      const msg = lang === 'es' ? 'Hola Brandon, vi tu portafolio y me gustaría hablar contigo.' : "Hi Brandon, I saw your portfolio and I'd like to talk.";
      window.open(`https://wa.me/${a.target.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    } else if (a.kind === 'email') {
      window.location.href = `mailto:${a.target}`;
    }
  };

  const actionIcon = (k: KAction['kind']) =>
    k === 'link' ? <FileDown size={13} /> : k === 'whatsapp' ? <MessageCircle size={13} /> : k === 'email' ? <Mail size={13} /> : <ArrowRight size={13} />;

  const startChips = START_CHIPS.map((id) => INTENTS.find((i) => i.id === id)!).filter(Boolean);
  const status =
    mode === 'remote' ? t('aiAssistant.statusRemote') : mode === 'local' ? t('aiAssistant.statusLocal') : t('aiAssistant.statusReady');

  return (
    <>
      {/* Launcher */}
      <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-3">
        <AnimatePresence>
          {!isOpen && showTip && (
            <motion.button
              onClick={open}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="hidden rounded-full border border-white/10 bg-night-800/90 px-4 py-2 text-sm text-white shadow-lg backdrop-blur-xl sm:block"
            >
              {t('aiAssistant.launcherTip')}
            </motion.button>
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => (isOpen ? setIsOpen(false) : open())}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full shadow-[0_10px_40px_-8px_rgba(94,234,212,.6)]"
          aria-label={isOpen ? t('aiAssistant.close') : t('aiAssistant.open')}
          aria-expanded={isOpen}
          aria-controls="agent-panel"
        >
          {isOpen ? (
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-night-800 text-white">
              <X size={22} />
            </span>
          ) : (
            <Orb size={56} busy={busy} />
          )}
        </motion.button>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.section
            id="agent-panel"
            role="dialog"
            aria-labelledby="agent-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-24 z-[60] flex h-[min(640px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-3xl border border-white/10 bg-night-900/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,.9),0_0_0_1px_rgba(94,234,212,.06)] backdrop-blur-2xl sm:inset-x-auto sm:right-5 sm:w-[420px]"
          >
            {/* Header */}
            <header className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3">
              <Orb size={34} busy={busy} />
              <div className="min-w-0 flex-1">
                <h2 id="agent-title" className="font-display text-base font-semibold leading-tight text-white">
                  {t('aiAssistant.agentName')}
                </h2>
                <p className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span className={`h-1.5 w-1.5 rounded-full ${mode === 'local' ? 'bg-volt' : 'bg-leaf'}`} />
                  {status}
                </p>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={() => {
                    setMessages([]);
                    lastIntents.current = [];
                  }}
                  className="rounded-full p-2 text-text-muted transition-colors hover:bg-white/5 hover:text-white"
                  aria-label={t('aiAssistant.clearChat')}
                  title={t('aiAssistant.clearChat')}
                >
                  <RotateCcw size={16} />
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="rounded-full p-2 text-text-muted transition-colors hover:bg-white/5 hover:text-white" aria-label={t('aiAssistant.close')}>
                <X size={18} />
              </button>
            </header>

            {/* Conversation */}
            <div ref={listRef} className="flex-1 space-y-5 overflow-y-auto px-4 py-5" aria-live="polite">
              {messages.length === 0 && (
                <div className="flex h-full flex-col justify-end">
                  <p className="font-display text-2xl font-semibold leading-tight text-white">{t('aiAssistant.emptyTitle')}</p>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{t('aiAssistant.emptyBody')}</p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {startChips.map((i) => (
                      <button
                        key={i.id}
                        onClick={() => send(i.ask[lang])}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-left text-sm text-white/85 transition-colors hover:border-glow/40 hover:bg-white/[0.06]"
                      >
                        {i.ask[lang]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) =>
                m.role === 'user' ? (
                  <div key={m.id} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-white/[0.09] px-4 py-2.5 text-[15px] text-white">
                    {m.text}
                  </div>
                ) : (
                  <div key={m.id} className="flex gap-3">
                    <Orb size={24} busy={m.streaming} />
                    <div className="min-w-0 flex-1">
                      {m.steps && (m.streaming || !m.text) && (
                        <ol className="mb-2 space-y-1">
                          {m.steps.map((s, i) => {
                            const done = (m.stepsDone ?? 0) > i;
                            const active = (m.stepsDone ?? 0) === i;
                            if (!done && !active) return null;
                            return (
                              <li key={i} className="flex items-center gap-2 text-xs text-text-muted">
                                {done ? <Check size={12} className="text-leaf" /> : <span className="h-3 w-3 animate-spin rounded-full border border-glow border-t-transparent" />}
                                <span className={active ? 'text-white/80' : ''}>{s}</span>
                              </li>
                            );
                          })}
                        </ol>
                      )}
                      {m.text && (
                        <div className="space-y-1 text-[15px] leading-relaxed text-white/85">
                          <RichText text={m.text} />
                          {m.streaming && <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-caret bg-glow" />}
                        </div>
                      )}
                      {!m.streaming && !!m.sources?.length && (
                        <p className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-text-muted">
                          {t('aiAssistant.sourcesLabel')}
                          {m.sources.map((s) => (
                            <span key={s} className="rounded-md border border-white/[0.08] px-1.5 py-0.5 text-white/60">
                              {s}
                            </span>
                          ))}
                        </p>
                      )}
                      {!m.streaming && !!m.actions?.length && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {m.actions.map((a) => (
                            <button
                              key={a.kind + a.target}
                              onClick={() => runAction(a)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-night-950 transition hover:brightness-90"
                            >
                              {actionIcon(a.kind)}
                              {a.label[lang]}
                            </button>
                          ))}
                        </div>
                      )}
                      {!m.streaming && !!m.followups?.length && m.id === messages[messages.length - 1]?.id && (
                        <div className="mt-3 flex flex-col items-start gap-1.5">
                          {m.followups.map((f) => (
                            <button
                              key={f.ask}
                              onClick={() => send(f.ask)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-left text-sm text-glow/90 transition-colors hover:bg-glow/10 hover:text-glow"
                            >
                              <CornerDownRight size={13} aria-hidden="true" />
                              {f.ask}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = input;
                setInput('');
                send(q);
              }}
              className="border-t border-white/[0.07] p-3"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-night-800/80 p-1.5 pl-3 focus-within:border-glow/40">
                <Sparkles size={16} className="mb-2.5 shrink-0 text-glow" aria-hidden="true" />
                <label htmlFor="agent-input" className="sr-only">
                  {t('aiAssistant.placeholder')}
                </label>
                <textarea
                  id="agent-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={600}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      const q = input;
                      setInput('');
                      send(q);
                    }
                  }}
                  placeholder={t('aiAssistant.placeholder')}
                  className="max-h-28 min-h-[36px] flex-1 resize-none border-0 bg-transparent px-0 py-2 text-[15px] text-white placeholder:text-text-muted focus:ring-0"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || busy}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-night-950 transition disabled:opacity-30"
                  aria-label={t('aiAssistant.send')}
                >
                  <ArrowUp size={17} />
                </button>
              </div>
              <p className="mt-2 px-1 text-[11px] text-text-muted">{t('aiAssistant.disclaimer')}</p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
