import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Bot, Copy, FileDown, Github, Hash, Languages, Linkedin, Search, Sparkles, type LucideIcon } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import { askAgent, scrollToSection } from '../hooks/useSpotlight';

interface Item {
  id: string;
  group: 'navigate' | 'actions';
  label: string;
  Icon: LucideIcon;
  run: () => void;
}

const CommandPalette: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('palette:open', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('palette:open', onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement as HTMLElement;
      setQuery('');
      setIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      lastFocus.current?.focus?.();
    }
  }, [open]);

  const go = (id: string) => () => scrollToSection(id);
  const isEs = i18n.language?.startsWith('es');

  const items: Item[] = useMemo(
    () => [
      { id: 'ai', group: 'navigate', label: t('header.ai'), Icon: Hash, run: go('ai') },
      { id: 'about', group: 'navigate', label: t('header.about'), Icon: Hash, run: go('about') },
      { id: 'stack', group: 'navigate', label: t('header.stack'), Icon: Hash, run: go('stack') },
      { id: 'projects', group: 'navigate', label: t('header.projects'), Icon: Hash, run: go('projects') },
      { id: 'contact', group: 'navigate', label: t('header.contact'), Icon: Hash, run: go('contact') },
      { id: 'ask', group: 'actions', label: t('palette.ask'), Icon: Bot, run: () => askAgent() },
      { id: 'cv', group: 'actions', label: t('palette.downloadCV'), Icon: FileDown, run: () => window.open(isEs ? '/cv-es.pdf' : '/cv-en.pdf', '_blank', 'noopener') },
      {
        id: 'email',
        group: 'actions',
        label: `${t('palette.copyEmail')}  ${CONTACT_INFO.EMAIL}`,
        Icon: Copy,
        run: () => {
          navigator.clipboard?.writeText(CONTACT_INFO.EMAIL);
          setToast(t('palette.copied'));
          setTimeout(() => setToast(''), 1800);
        },
      },
      { id: 'lang', group: 'actions', label: t('palette.switchLang'), Icon: Languages, run: () => i18n.changeLanguage(isEs ? 'en' : 'es') },
      { id: 'gh', group: 'actions', label: t('palette.github'), Icon: Github, run: () => window.open(CONTACT_INFO.GITHUB, '_blank', 'noopener') },
      { id: 'li', group: 'actions', label: t('palette.linkedin'), Icon: Linkedin, run: () => window.open(CONTACT_INFO.LINKEDIN, '_blank', 'noopener') },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, isEs]
  );

  const q = query.trim().toLowerCase();
  const filtered = q ? items.filter((it) => it.label.toLowerCase().includes(q)) : items;
  // Free text always offers to ask the agent as the last option.
  const results: Item[] = q
    ? [...filtered, { id: 'ask-q', group: 'actions', label: `${t('palette.ask')}: "${query.trim()}"`, Icon: Sparkles, run: () => askAgent(query.trim()) }]
    : filtered;

  const run = (item?: Item) => {
    if (!item) return;
    setOpen(false);
    setTimeout(item.run, 60);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[index]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const groups: Item['group'][] = ['navigate', 'actions'];

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-start justify-center bg-night-950/70 px-4 pt-[14vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t('header.search')}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-night-900/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,.9),0_0_0_1px_rgba(94,234,212,.08)]"
            >
              <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
                <Search size={18} className="text-text-muted" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIndex(0);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder={t('palette.placeholder')}
                  aria-label={t('palette.placeholder')}
                  className="h-14 flex-1 border-0 bg-transparent p-0 text-base text-white placeholder:text-text-muted focus:ring-0"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="palette-list"
                  aria-activedescendant={results[index] ? `pal-${results[index].id}` : undefined}
                />
                <kbd className="rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">Esc</kbd>
              </div>
              <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
                {groups.map((g) => {
                  const list = results.filter((r) => r.group === g);
                  if (!list.length) return null;
                  return (
                    <li key={g} role="presentation">
                      <p className="px-3 pb-1 pt-3 text-xs text-text-muted">{t(`palette.${g}`)}</p>
                      <ul role="presentation">
                        {list.map((it) => {
                          const i = results.indexOf(it);
                          const active = i === index;
                          return (
                            <li
                              key={it.id}
                              id={`pal-${it.id}`}
                              role="option"
                              aria-selected={active}
                              onMouseMove={() => setIndex(i)}
                              onClick={() => run(it)}
                              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                                active ? 'bg-white/[0.07] text-white' : 'text-white/75'
                              }`}
                            >
                              <it.Icon size={16} className={active ? 'text-glow' : 'text-text-muted'} />
                              <span className="flex-1 truncate">{it.label}</span>
                              {active && <ArrowRight size={14} className="text-text-muted" aria-hidden="true" />}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-8 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-white/10 bg-night-800 px-4 py-2 text-sm text-white"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommandPalette;
