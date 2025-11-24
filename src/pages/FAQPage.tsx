import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTranslation } from 'react-i18next';

import SEO from '../../components/SEO';

const FAQPage: React.FC = () => {
    const { t } = useTranslation();

    const faqs = [
        {
            q: t('faq.items.q1'),
            a: t('faq.items.a1')
        },
        {
            q: t('faq.items.q2'),
            a: t('faq.items.a2')
        },
        {
            q: t('faq.items.q3'),
            a: t('faq.items.a3')
        },
        {
            q: t('faq.items.q4'),
            a: t('faq.items.a4')
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-apple-text">
            <SEO
                title={t('faq.title')}
                description={t('faq.items.a1')}
            />
            <Header />
            <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-apple-dark mb-12">{t('faq.title')}</h1>
                <div className="space-y-8">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-8 last:border-0">
                            <h3 className="text-xl font-semibold text-apple-dark mb-3">{faq.q}</h3>
                            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FAQPage;
