import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { initialFAQs } from '../data/initialData';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { language, t } = useHotel();
  const [openId, setOpenId] = useState<string>('faq-1');

  const toggle = (id: string) => {
    setOpenId(openId === id ? '' : id);
  };

  return (
    <section id="faq" className="py-20 bg-[#0F1115] text-[#E0E0E0] relative border-b border-[#252936]">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-xs font-semibold uppercase tracking-widest mb-2 border border-[#C5A059]/25 font-sans">
            <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{t.faqTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#FAF8F5] font-display">
            {t.faqTitle}
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-2 font-sans">
            {t.faqSubtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {initialFAQs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-[#14161C] border border-[#252936] rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#1F222A]/60 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-[#FAF8F5] font-display">
                    {faq.question[language]}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C5A059] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#9CA3AF] leading-relaxed border-t border-[#252936] pt-3 animate-in fade-in duration-200 font-sans">
                    <p>{faq.answer[language]}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
