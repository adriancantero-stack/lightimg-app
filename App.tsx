import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoaderIcon } from './components/Icons';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./src/pages/HomePage'));
const HowItWorksPage = React.lazy(() => import('./src/pages/HowItWorksPage'));
const FAQPage = React.lazy(() => import('./src/pages/FAQPage'));
const PrivacyPage = React.lazy(() => import('./src/pages/PrivacyPage'));
const TermsPage = React.lazy(() => import('./src/pages/TermsPage'));
const ContactPage = React.lazy(() => import('./src/pages/ContactPage'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <LoaderIcon className="w-8 h-8 text-apple-blue animate-spin" />
  </div>
);

// Wrapper to handle language based on URL
const LanguageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const supportedLangs = ['en', 'es', 'pt'];

    if (lang && supportedLangs.includes(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    } else {
      // Invalid language or root path, redirect to default or detected
      const detectedLang = i18n.language.split('-')[0];
      const targetLang = supportedLangs.includes(detectedLang) ? detectedLang : 'en';
      // Preserve the rest of the path if it exists, otherwise go to root of target lang
      // But since this wrapper is inside /:lang, we might be here due to a catch-all or direct access
      // For simplicity in this step, we'll handle the root redirect in the main Routes
    }
  }, [lang, i18n, navigate, location]);

  return <>{children}</>;
};

// Component to handle root redirection
const RootRedirect = () => {
  const { i18n } = useTranslation();
  const supportedLangs = ['en', 'es', 'pt'];
  const detectedLang = i18n.language.split('-')[0];
  const targetLang = supportedLangs.includes(detectedLang) ? detectedLang : 'en';

  return <Navigate to={`/${targetLang}`} replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />

          <Route path="/:lang/*" element={
            <LanguageWrapper>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </LanguageWrapper>
          } />

          {/* Catch all for non-lang paths, redirect to root which then redirects to lang */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;