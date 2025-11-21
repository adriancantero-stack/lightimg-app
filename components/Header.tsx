import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md border-gray-200/50 py-3' 
          : 'bg-white border-transparent py-5'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-apple-blue rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
            L
          </div>
          <span className="font-semibold text-xl tracking-tight text-apple-dark">Light IMG</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors">How it works</a>
          <a href="#faq" className="text-sm font-medium text-gray-500 hover:text-apple-dark transition-colors">FAQ</a>
          <span className="text-sm font-medium text-gray-300 cursor-not-allowed">Contact</span>
        </nav>

        <button className="md:hidden text-gray-500">
          <span className="sr-only">Menu</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
    </header>
  );
};

export default Header;