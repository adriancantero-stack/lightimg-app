import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GlobeIcon } from './Icons';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsLangOpen(false);
  };

  const currentLang = i18n.language.split('-')[0].toUpperCase();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b ${scrolled
        ? 'bg-white/80 backdrop-blur-md border-gray-200/50 py-3'
        : 'bg-white border-transparent py-5'
        }`}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between relative">
        {/* Logo - Left */}
        <div className="flex items-center gap-2 z-20">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Light IMG Logo" className="h-11 w-auto" width="44" height="44" />
            <span className="font-semibold text-xl tracking-tight text-apple-dark">Light <span className="font-extrabold">IMG</span></span>
          </Link>
        </div>

        {/* Navigation - Centered */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link to="/how-it-works" className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors">{t('header.howItWorks')}</Link>
          <Link to="/faq" className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors">{t('header.faq')}</Link>
          <Link to="/contact" className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors">{t('header.contact')}</Link>
        </nav>

        {/* Right Side - Language & Mobile Menu */}
        <div className="flex items-center gap-4 z-20">
          {/* Language Switcher */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 text-gray-500 hover:text-apple-dark transition-colors px-2 py-1 rounded-lg hover:bg-gray-50"
            >
              <GlobeIcon className="w-4 h-4" />
              <span className="text-xs font-medium">{currentLang}</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden animate-fade-in">
                <button onClick={() => changeLanguage('en')} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-apple-dark transition-colors flex items-center justify-between">
                  English {currentLang === 'EN' && <span className="text-apple-blue">•</span>}
                </button>
                <button onClick={() => changeLanguage('es')} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-apple-dark transition-colors flex items-center justify-between">
                  Español {currentLang === 'ES' && <span className="text-apple-blue">•</span>}
                </button>
                <button onClick={() => changeLanguage('pt')} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-apple-dark transition-colors flex items-center justify-between">
                  Português {currentLang === 'PT' && <span className="text-apple-blue">•</span>}
                </button>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-gray-500 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Menu</span>
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg animate-fade-in">
          <nav className="flex flex-col p-4">
            <Link
              to="/how-it-works"
              className="py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-lg hover:text-apple-dark transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('header.howItWorks')}
            </Link>
            <Link
              to="/faq"
              className="py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-lg hover:text-apple-dark transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('header.faq')}
            </Link>
            <Link
              to="/contact"
              className="py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-lg hover:text-apple-dark transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('header.contact')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;