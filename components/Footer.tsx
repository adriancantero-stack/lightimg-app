import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AdUnit from './AdUnit';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-8">
        {/* AdSense Slot */}
        <AdUnit slot="FOOTER_SLOT_ID" format="horizontal" className="w-full max-w-3xl mb-4" />

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Light IMG Logo" className="h-10 w-auto grayscale opacity-50" />
            <span className="font-semibold text-gray-400">Light <span className="font-extrabold">IMG</span></span>
          </div>

          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-apple-dark transition-colors">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-apple-dark transition-colors">{t('footer.terms')}</Link>
            <Link to="/contact" className="hover:text-apple-dark transition-colors">{t('header.contact')}</Link>
          </div>

          <div className="text-sm text-gray-400">
            © {currentYear} Light IMG. {t('footer.rights')}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;