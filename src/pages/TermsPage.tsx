import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import SEO from '../../components/SEO';

const TermsPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white font-sans text-apple-text">
            <SEO
                title={t('terms.title')}
                description={t('terms.section1')}
            />
            <Header />
            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-apple-dark mb-8">{t('terms.title')}</h1>
                <p className="text-gray-500 mb-12">{t('terms.lastUpdated')}</p>

                <h2 className="text-2xl font-bold text-apple-dark mb-4 mt-10">{t('terms.section1Title')}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{t('terms.section1')}</p>

                <h2 className="text-2xl font-bold text-apple-dark mb-4 mt-10">{t('terms.section2Title')}</h2>
                <p className="text-gray-600 leading-relaxed mb-4">{t('terms.section2')}</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                    <li>{t('terms.section2List1')}</li>
                    <li>{t('terms.section2List2')}</li>
                    <li>{t('terms.section2List3')}</li>
                    <li>{t('terms.section2List4')}</li>
                    <li>{t('terms.section2List5')}</li>
                </ul>

                <h2 className="text-2xl font-bold text-apple-dark mb-4 mt-10">{t('terms.section3Title')}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{t('terms.section3')}</p>

                <h2 className="text-2xl font-bold text-apple-dark mb-4 mt-10">{t('terms.section4Title')}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{t('terms.section4')}</p>

                <h2 className="text-2xl font-bold text-apple-dark mb-4 mt-10">{t('terms.section5Title')}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{t('terms.section5')}</p>
            </main>
            <Footer />
        </div>
    );
};

export default TermsPage;
