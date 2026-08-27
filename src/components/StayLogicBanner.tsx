import React from 'react';
import { useHotel } from '../context/HotelContext';
import { Clock, CheckCircle2, AlertCircle, Sparkles, Coffee } from 'lucide-react';

export const StayLogicBanner: React.FC = () => {
  const { language, t } = useHotel();

  return (
    <div className="bg-[#0F1115] border-y border-[#252936] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#14161C] border border-[#C5A059]/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Main Text */}
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-xs font-bold uppercase tracking-widest border border-[#C5A059]/25 font-sans">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.stayLogicBannerTitle}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#FAF8F5] font-display">
                {language === 'ky' 
                  ? 'Сиз келген убакыттан баштап так эсептелет' 
                  : language === 'ru' 
                  ? 'Честный расчет времени от минуты фактического заезда' 
                  : 'Fair Pricing Based on Your Exact Arrival Time'}
              </h3>
              <p className="text-sm text-[#9CA3AF] leading-relaxed font-sans">
                {t.stayLogicBannerDesc}
              </p>
            </div>

            {/* Visual Example Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full lg:w-auto shrink-0">
              {/* 12-Hour Example */}
              <div className="bg-[#1F222A] rounded-xl p-4 border border-[#252936] space-y-2 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider font-sans">
                    {language === 'ky' ? '12 сааттык туруу' : language === 'ru' ? '12 часов проживания' : '12-Hour Stay'}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded bg-[#C5A059]/15 text-[#C5A059] font-bold">
                    2 500 - 2 800 KGS
                  </span>
                </div>
                <div className="text-xs space-y-1.5 text-[#E0E0E0]">
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">{language === 'ky' ? 'Заезд:' : language === 'ru' ? 'Заезд:' : 'Check-in:'}</span>
                    <span className="font-semibold text-[#FAF8F5]">27 авг, 18:30</span>
                  </div>
                  <div className="flex justify-between border-t border-[#252936] pt-1.5 text-[#C5A059]">
                    <span className="font-medium text-[#9CA3AF]">{language === 'ky' ? 'Выезд:' : language === 'ru' ? 'Выезд:' : 'Checkout:'}</span>
                    <span className="font-bold text-[#D8B46C]">28 авг, 06:30</span>
                  </div>
                </div>
              </div>

              {/* 24-Hour Example */}
              <div className="bg-[#1F222A] rounded-xl p-4 border border-[#252936] space-y-2 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-[#FAF8F5] uppercase tracking-wider font-sans">
                    {language === 'ky' ? '24 сааттык туруу' : language === 'ru' ? '24 часа проживания' : '24-Hour Stay'}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded bg-[#FAF8F5]/10 text-[#FAF8F5] font-bold">
                    5 000 KGS
                  </span>
                </div>
                <div className="text-xs space-y-1.5 text-[#E0E0E0]">
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">{language === 'ky' ? 'Заезд:' : language === 'ru' ? 'Заезд:' : 'Check-in:'}</span>
                    <span className="font-semibold text-[#FAF8F5]">27 авг, 18:30</span>
                  </div>
                  <div className="flex justify-between border-t border-[#252936] pt-1.5 text-[#C5A059]">
                    <span className="font-medium text-[#9CA3AF]">{language === 'ky' ? 'Выезд:' : language === 'ru' ? 'Выезд:' : 'Checkout:'}</span>
                    <span className="font-bold text-[#D8B46C]">28 авг, 18:30</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
