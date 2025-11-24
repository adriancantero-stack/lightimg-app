import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTranslation } from 'react-i18next';

import SEO from '../../components/SEO';

const ContactPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white font-sans text-apple-text">
            <SEO
                title={t('contactPage.title')}
                description={t('contactPage.subtitle')}
            />
            <Header />
            <main className="pt-32 pb-20 px-6 max-w-2xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-apple-dark mb-8">{t('contactPage.title')}</h1>
                <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                    {t('contactPage.subtitle')}
                </p>

                <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100">
                    <p className="text-gray-500 mb-2 font-medium uppercase tracking-wide text-xs">{t('contactPage.emailLabel')}</p>
                    <a href="mailto:support@lightimg.app" className="text-2xl md:text-3xl font-bold text-apple-blue hover:underline">
                        support@lightimg.app
                    </a>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;
