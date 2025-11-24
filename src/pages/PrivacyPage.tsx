import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import SEO from '../../components/SEO';

const PrivacyPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white font-sans text-apple-text">
            <SEO
                title={t('privacy.title')}
                description={t('privacy.intro')}
            />
            <Header />
            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-apple-dark mb-8">{t('privacy.title')}</h1>
                <p className="text-gray-500 mb-12">{t('privacy.lastUpdated')}</p>

                <p className="text-gray-600 leading-relaxed mb-8">{t('privacy.intro')}</p>

                <h2 className="text-2xl font-bold text-apple-dark mb-4 mt-10">{t('privacy.infoCollectTitle')}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{t('privacy.infoCollect')}</p>

                <h2 className="text-2xl font-bold text-apple-dark mb-4 mt-10">{t('privacy.logFilesTitle')}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{t('privacy.logFiles')}</p>

                <h2 className="text-2xl font-bold text-apple-dark mb-4 mt-10">{t('privacy.cookiesTitle')}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{t('privacy.cookies')}</p>

                <h2 className="text-2xl font-bold text-apple-dark mb-4 mt-10">{t('privacy.contactTitle')}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{t('privacy.contact')}</p>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPage;
