import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: t('header.home'), href: '#home' },
    { name: t('header.about'), href: '#about' },
    { name: t('header.stack'), href: '#stack' },
    { name: t('header.projects'), href: '#projects' },
    { name: t('header.contact'), href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-bg-primary/95 backdrop-blur-sm shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        <a href="#home" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="w-10 h-10" />
          <span className="font-bold text-xl">Landaetta<span className="text-gradient">Dev</span></span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-text-main/80 hover:text-text-main transition-colors duration-300 text-sm font-medium"
            >
              {link.name}
            </a>
          ))}
          
          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                i18n.language === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-text-main hover:bg-slate-700'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('es')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                i18n.language === 'es'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-text-main hover:bg-slate-700'
              }`}
            >
              ES
            </button>
          </div>

          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all duration-300 text-sm"
          >
            {t('header.downloadCV')}
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          {/* Mobile Language Switcher */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                i18n.language === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-text-main hover:bg-slate-700'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('es')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                i18n.language === 'es'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-text-main hover:bg-slate-700'
              }`}
            >
              ES
            </button>
          </div>

          <button
            className="text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
<<<<<<< HEAD
        className={`md:hidden fixed top-0 left-0 right-0 w-full z-40 bg-bg-primary/95 backdrop-blur-sm shadow-md transition-all duration-300 ${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{ top: isScrolled ? '80px' : '100px' }}
=======
        className={`md:hidden fixed top-[100%] left-0 right-0 w-full z-50 bg-bg-primary/95 backdrop-blur-sm shadow-md transition-all duration-300 ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        } overflow-hidden`}
>>>>>>> 686329b362f44869f2c5a05335d8757d93613fa8
      >
        <div className="container mx-auto px-6 py-5 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-text-main/80 hover:text-text-main py-2 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all duration-300 text-center mt-2"
            onClick={() => setIsMenuOpen(false)}
          >
            {t('header.downloadCV')}
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;  