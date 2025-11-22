import React from 'react';
import { useTranslation } from 'react-i18next';

const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="py-20 bg-apple-gray">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-apple-dark mb-4">{t('howItWorks.title')}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: t('howItWorks.step1'), icon: "1" },
            { title: t('howItWorks.step2'), icon: "2" },
            { title: t('howItWorks.step3'), icon: "3" }
          ].map((step, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl shadow-card border border-white/50 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-blue-50 text-apple-blue font-bold text-xl rounded-2xl flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-apple-dark mb-2">{step.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;