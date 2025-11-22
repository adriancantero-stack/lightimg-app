import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTranslation } from 'react-i18next';

const FAQPage: React.FC = () => {
    const { t } = useTranslation();

    const faqs = [
        {
            q: "Is it free?",
            a: "Yes, LightIMG is completely free to use for all your image compression needs."
        },
        {
            q: "Are my images safe?",
            a: "Absolutely. Your images are processed securely and are automatically deleted from our servers immediately after processing. We do not store your content."
        },
        {
            q: "What formats do you support?",
            a: "We currently support JPG, PNG, and WebP formats."
        },
        {
            q: "Is there a file size limit?",
            a: "Yes, currently we support files up to 10MB each to ensure fast processing for everyone."
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-apple-text">
            <Header />
            <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-apple-dark mb-12">{t('header.faq')}</h1>
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
