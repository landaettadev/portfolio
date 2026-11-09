import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp, Github, Linkedin, Mail, Phone } from 'lucide-react';
import ShaderCanvas, { AURORA_FRAG } from './effects/ShaderCanvas';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="relative isolate overflow-hidden border-t border-white/[0.06]">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[300px] mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_55%,transparent_90%)]">
        <ShaderCanvas frag={AURORA_FRAG} still={12} />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-b from-transparent via-night-950/60 to-night-950" />
      <div className="container mx-auto px-6 lg:px-12 pb-12 pt-56">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
              <span className="font-display text-xl font-semibold tracking-tight">landaetta<span className="text-glow">.dev</span></span>
            </div>
            <p className="text-text-muted mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-5">
              <a
                href="https://github.com/landaettadev"
                target="_blank"
                rel="noopener noreferrer"
                className="-m-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white/5 hover:text-text-main"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/brandon-landaetta-70340ba2/"
                target="_blank"
                rel="noopener noreferrer"
                className="-m-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white/5 hover:text-text-main"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:brandon@landaetta.dev"
                className="-m-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white/5 hover:text-text-main"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
              <a
                href="https://wa.me/573006361659"
                target="_blank"
                rel="noopener noreferrer"
                className="-m-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white/5 hover:text-text-main"
                aria-label="WhatsApp"
              >
                <Phone size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold mb-4">{t('footer.quickLinks')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="inline-flex min-h-[32px] items-center text-text-muted transition-colors hover:text-text-main">{t('header.home')}</a>
                </li>
                <li>
                  <a href="#about" className="inline-flex min-h-[32px] items-center text-text-muted transition-colors hover:text-text-main">{t('header.about')}</a>
                </li>
                <li>
                  <a href="#stack" className="inline-flex min-h-[32px] items-center text-text-muted transition-colors hover:text-text-main">{t('header.stack')}</a>
                </li>
              </ul>
              <ul className="space-y-2">
                <li>
                  <a href="#projects" className="inline-flex min-h-[32px] items-center text-text-muted transition-colors hover:text-text-main">{t('header.projects')}</a>
                </li>
                <li>
                  <a href="#contact" className="inline-flex min-h-[32px] items-center text-text-muted transition-colors hover:text-text-main">{t('header.contact')}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <hr className="border-slate-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-muted text-sm mb-4 md:mb-0">
            &copy; {currentYear} Brandon Landaetta. {t('footer.copyright')}
          </p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-text-muted hover:bg-slate-700 hover:text-text-main transition-all"
            aria-label="Back to top"
          >
            <span>{t('footer.backToTop')}</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 