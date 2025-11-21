import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-apple-gray">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-apple-dark mb-4">Simple by design.</h2>
          <p className="text-gray-500">No accounts, no complexity. Just drag, drop, and done.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Upload", desc: "Drag & drop your PNG, JPG, or WebP images.", icon: "1" },
            { title: "Compress", desc: "Our server intelligently reduces file size locally.", icon: "2" },
            { title: "Download", desc: "Get your optimized images instantly.", icon: "3" }
          ].map((step, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl shadow-card border border-white/50 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-blue-50 text-apple-blue font-bold text-xl rounded-2xl flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-apple-dark mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;