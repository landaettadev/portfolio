import React, { useState, useEffect } from 'react';
import { Menu, X, Command, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useScrollSpy } from '../utils/useScrollSpy';
import { openPalette } from '../hooks/useSpotlight';

const SECTION_IDS = ['home', 'ai', 'about', 'stack', 'projects', 'contact'];

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeId = useScrollSpy({ ids: SECTION_IDS, offset: 200 });
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'ai', name: t('header.ai') },
    { id: 'about', name: t('header.about') },
    { id: 'stack', name: t('header.stack') },
    { id: 'projects', name: t('header.projects') },
    { id: 'contact', name: t('header.contact') },
  ];

  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const cvHref = lang === 'es' ? '/cv-es.pdf' : '/cv-en.pdf';

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
      <div className="container mx-auto px-2 sm:px-3 lg:px-8">
      <div
        className={`flex items-center justify-between gap-4 rounded-full border px-3 py-2 pl-4 transition-[background-color,border-color,box-shadow] duration-500 ${
          isScrolled
            ? 'border-white/10 bg-night-900/70 shadow-[0_8px_40px_-12px_rgba(0,0,0,.8)] backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <a href="#home" className="flex items-center gap-2.5" aria-label="Landaetta Dev, inicio">
          <img src="/logo.svg" alt="" className="h-8 w-8" />
          <span className="font-display text-lg font-semibold tracking-tight">
            landaetta<span className="text-glow">.dev</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {navLinks.map((link) => {
            const active = activeId === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={active ? 'true' : undefined}
                className={`relative whitespace-nowrap rounded-full px-3 xl:px-4 py-2 text-sm transition-colors duration-300 ${
                  active ? 'text-white' : 'text-text-muted hover:text-white'
                }`}
              >
                {active && <span className="absolute inset-0 -z-10 rounded-full bg-white/[0.07] ring-1 ring-white/10" />}
                {link.name}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openPalette}
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-3 pr-1.5 text-sm text-text-muted transition-colors hover:border-white/20 hover:text-white sm:flex"
          >
            <Search size={14} />
            <span className="hidden xl:inline">{t('header.search')}</span>
            <kbd className="ml-2 flex items-center gap-0.5 rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[11px]">
              {isMac ? <Command size={11} /> : 'Ctrl'} K
            </kbd>
          </button>

          <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-0.5 text-xs font-medium" role="group" aria-label="Idioma">
            {(['es', 'en'] as const).map((l) => (
              <button
                key={l}
                onClick={() => i18n.changeLanguage(l)}
                aria-pressed={lang === l}
                className={`min-h-[30px] min-w-[34px] rounded-full px-2.5 py-1 transition-colors ${
                  lang === l ? 'bg-white text-night-950' : 'text-text-muted hover:text-white'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <a href={cvHref} target="_blank" rel="noopener noreferrer" className="btn-primary hidden whitespace-nowrap !px-4 !py-2 text-sm md:inline-flex">
            {t('header.downloadCV')}
          </a>

          <button
            className="rounded-full p-2 text-white lg:hidden"
            onClick={() => setIsMenuOpen((o) => !o)}
            aria-label={t('header.menu')}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      </div>

      {/* Mobile navigation */}
      <div
        className={`mx-2 mt-2 overflow-hidden sm:mx-auto sm:max-w-xl rounded-3xl border border-white/10 bg-night-900/90 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          isMenuOpen ? 'max-h-[480px] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col p-3" aria-label="Móvil">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`rounded-2xl px-4 py-3 text-base transition-colors ${
                activeId === link.id ? 'bg-white/[0.06] text-white' : 'text-text-muted hover:text-white'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              openPalette();
            }}
            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-text-muted hover:text-white"
          >
            <Search size={16} /> {t('header.search')}
          </button>
          <a href={cvHref} target="_blank" rel="noopener noreferrer" className="btn-primary mt-2" onClick={() => setIsMenuOpen(false)}>
            {t('header.downloadCV')}
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
