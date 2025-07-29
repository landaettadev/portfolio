import React from 'react';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD
import { ArrowUp, Github, Linkedin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = 2025;
=======
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
>>>>>>> 686329b362f44869f2c5a05335d8757d93613fa8
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-slate-900">
      <div className="container mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
<<<<<<< HEAD
              <span className="font-bold text-xl">Landaetta<span className="text-gradient">Dev</span></span>
=======
              <span className="font-bold text-xl">Dev<span className="text-gradient">Port</span></span>
>>>>>>> 686329b362f44869f2c5a05335d8757d93613fa8
            </div>
            <p className="text-text-muted mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/landaettadev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-main transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/brandon-landaetta-70340ba2/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-main transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:brandon@landaetta.dev"
                className="text-text-muted hover:text-text-main transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
<<<<<<< HEAD
              <a
                href="https://wa.me/573006361659"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-main transition-colors"
                aria-label="WhatsApp"
              >
                <Phone size={20} />
              </a>
=======
>>>>>>> 686329b362f44869f2c5a05335d8757d93613fa8
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold mb-4">{t('footer.quickLinks')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-text-muted hover:text-text-main transition-colors">{t('header.home')}</a>
                </li>
                <li>
                  <a href="#about" className="text-text-muted hover:text-text-main transition-colors">{t('header.about')}</a>
                </li>
                <li>
                  <a href="#stack" className="text-text-muted hover:text-text-main transition-colors">{t('header.stack')}</a>
                </li>
              </ul>
              <ul className="space-y-2">
                <li>
                  <a href="#projects" className="text-text-muted hover:text-text-main transition-colors">{t('header.projects')}</a>
                </li>
                <li>
                  <a href="#contact" className="text-text-muted hover:text-text-main transition-colors">{t('header.contact')}</a>
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