import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const translatePage = (targetLang: string) => {
    const currentUrl = encodeURIComponent(window.location.href);
    const pageLang = document.documentElement.lang || 'en';
    window.location.href = `https://translate.google.com/translate?sl=${pageLang}&tl=${targetLang}&u=${currentUrl}`;
  };

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'fr', label: 'FR' },
    { code: 'de', label: 'DE' },
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLangMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLangMenuOpen(!isLangMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const langSwitcher = document.getElementById('lang-switcher');
      if (langSwitcher && !langSwitcher.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Stack', href: '#stack' },
    { name: 'Projects', href: '#projects' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
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
          <span className="font-bold text-xl">Dev<span className="text-gradient">Port</span></span>
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
          <div id="lang-switcher" className="relative">
            <button
              onClick={toggleLangMenu}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-text-main hover:bg-slate-700 transition-colors"
              aria-label="Select language"
            >
              <Globe size={16} />
              <span className="text-sm">EN</span>
            </button>
            
            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 py-2 w-32 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => translatePage(lang.code)}
                    className="w-full px-4 py-2 text-left text-sm text-text-main hover:bg-slate-700 transition-colors"
                    aria-label={`Translate to ${lang.label}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all duration-300 text-sm"
          >
            Download CV
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          {/* Mobile Language Switcher */}
          <div id="mobile-lang-switcher" className="relative">
            <button
              onClick={toggleLangMenu}
              className="flex items-center gap-1 px-2 py-2 rounded-lg bg-slate-800 text-text-main hover:bg-slate-700 transition-colors"
              aria-label="Select language"
            >
              <Globe size={16} />
            </button>
            
            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 py-2 w-32 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => translatePage(lang.code)}
                    className="w-full px-4 py-2 text-left text-sm text-text-main hover:bg-slate-700 transition-colors"
                    aria-label={`Translate to ${lang.label}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
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
        className={`md:hidden fixed top-[100%] left-0 right-0 w-full z-50 bg-bg-primary/95 backdrop-blur-sm shadow-md transition-all duration-300 ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        } overflow-hidden`}
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
            Download CV
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;  