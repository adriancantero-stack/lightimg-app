import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './src/pages/HomePage';
import HowItWorksPage from './src/pages/HowItWorksPage';
import FAQPage from './src/pages/FAQPage';
import PrivacyPage from './src/pages/PrivacyPage';
import TermsPage from './src/pages/TermsPage';
import ContactPage from './src/pages/ContactPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
};

export default App;