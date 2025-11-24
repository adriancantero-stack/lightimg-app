import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTranslation } from 'react-i18next';

import SEO from '../../components/SEO';

const HowItWorksPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white font-sans text-apple-text">
            <SEO
                title={t('howItWorks.title')}
                description={t('howItWorks.step1Desc')}
            />
            <Header />
            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-apple-dark mb-8">{t('howItWorks.title')}</h1>
                <div className="space-y-12">
                    <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 bg-blue-50 text-apple-blue font-bold text-xl rounded-2xl flex items-center justify-center flex-shrink-0">1</div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">{t('howItWorks.step1')}</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {t('howItWorks.step1Desc')}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 bg-blue-50 text-apple-blue font-bold text-xl rounded-2xl flex items-center justify-center flex-shrink-0">2</div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">{t('howItWorks.step2')}</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {t('howItWorks.step2Desc')}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 bg-blue-50 text-apple-blue font-bold text-xl rounded-2xl flex items-center justify-center flex-shrink-0">3</div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">{t('howItWorks.step3')}</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {t('howItWorks.step3Desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HowItWorksPage;
