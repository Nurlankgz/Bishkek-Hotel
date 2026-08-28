import React from 'react';
import { useHotel } from '../context/HotelContext';
import { Building2, MapPin, Clock, ShieldCheck, Coffee, BedDouble } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { language, t, settings } = useHotel();

  return (
    <section id="about" className="py-20 bg-[#0F1115] text-[#E0E0E0] relative border-b border-[#252936]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Images Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 relative">
            <div className="space-y-3">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
                alt="Bishkek Hotel Exterior"
                referrerPolicy="no-referrer"
                className="rounded-2xl object-cover h-48 w-full shadow-lg border border-[#252936]"
              />
              <img
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80"
                alt="Hotel Reception"
                referrerPolicy="no-referrer"
                className="rounded-2xl object-cover h-40 w-full shadow-lg border border-[#252936]"
              />
            </div>
            <div className="space-y-3 pt-6">
              <img
                src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80"
                alt="Hotel Room"
                referrerPolicy="no-referrer"
                className="rounded-2xl object-cover h-40 w-full shadow-lg border border-[#252936]"
              />
              <img
                src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80"
                alt="Hotel Lobby & Interior"
                referrerPolicy="no-referrer"
                className="rounded-2xl object-cover h-48 w-full shadow-lg border border-[#252936]"
              />
            </div>

            {/* Experience badge */}
            <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-[#C5A059] to-[#DFB972] text-[#0F1115] p-4 rounded-2xl shadow-xl font-bold text-center border-2 border-[#0F1115]">
              <span className="block text-2xl font-black">24/7</span>
              <span className="text-[11px] uppercase tracking-wider font-extrabold">Bishkek</span>
            </div>
          </div>

          {/* About Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-xs font-semibold uppercase tracking-widest border border-[#C5A059]/25 font-sans">
              <Building2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{t.aboutTitle}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#FAF8F5] tracking-tight leading-snug font-display">
              {t.aboutSubtitle}
            </h2>

            <div className="space-y-4 text-sm text-[#9CA3AF] leading-relaxed font-sans">
              <p>{t.aboutParagraph1}</p>
              <p>{t.aboutParagraph2}</p>
            </div>

            {/* 4 Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 bg-[#14161C] p-4 rounded-xl border border-[#252936]">
                <BedDouble className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#FAF8F5]">{t.featureKey1}</h4>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    {language === 'ky' ? 'Жайлуу, тынч жана таза' : language === 'ru' ? 'Светлые и современные номера' : 'Cozy, clean and soundproof'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#14161C] p-4 rounded-xl border border-[#252936]">
                <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#FAF8F5]">{t.featureKey2}</h4>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    {settings.intersectionNote[language]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#14161C] p-4 rounded-xl border border-[#252936]">
                <Clock className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#FAF8F5]">{t.featureKey3}</h4>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    {language === 'ky' ? 'Каалаган убакта кабыл алуу' : language === 'ru' ? 'Круглосуточное заселение' : 'Check-in at any convenient hour'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#14161C] p-4 rounded-xl border border-[#252936]">
                <Coffee className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#FAF8F5]">{t.featureKey4}</h4>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    {t.advBreakfastLongDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
