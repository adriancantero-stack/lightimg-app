import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h4 className="font-bold text-lg text-apple-dark mb-1">Light IMG</h4>
          <p className="text-xs text-gray-400">Inspired by the simplicity of modern web tools.</p>
        </div>
        
        <div className="flex gap-6">
          <a href="#" className="text-xs text-gray-500 hover:text-apple-dark transition-colors">Privacy</a>
          <a href="#" className="text-xs text-gray-500 hover:text-apple-dark transition-colors">Terms</a>
          <a href="#" className="text-xs text-gray-500 hover:text-apple-dark transition-colors">Contact</a>
        </div>
        
        <div className="text-xs text-gray-300">
          © {new Date().getFullYear()} Light IMG.
        </div>
      </div>
    </footer>
  );
};

export default Footer;