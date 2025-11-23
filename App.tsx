import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;