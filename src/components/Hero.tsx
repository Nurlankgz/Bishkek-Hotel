import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotel } from '../context/HotelContext';
import { StayDuration } from '../types';
import { calculateCheckOutDateTime, combineDateAndTime, formatDateTime } from '../utils/bookingLogic';
import { 
  Clock, 
  Calendar, 
  Coffee, 
  BedDouble, 
  MapPin, 
  Headphones, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { language, t, setQuickBookingParams } = useHotel();
  const navigate = useNavigate();

  // Quick check widget state
  const todayStr = new Date().toISOString().split('T')[0];
  const [quickDate, setQuickDate] = useState<string>(todayStr);
  const [quickTime, setQuickTime] = useState<string>('18:00');
  const [quickDuration, setQuickDuration] = useState<StayDuration>('12h');

  const checkInDateObj = combineDateAndTime(quickDate, quickTime);
  const checkOutDateObj = calculateCheckOutDateTime(checkInDateObj, quickDuration);

  const handleStartBooking = () => {
    setQuickBookingParams({
      date: quickDate,
      time: quickTime,
      duration: quickDuration,
    });
    navigate('/booking');
  };

  const advantages = [
    {
      icon: Clock,
      title: t.adv12hTitle,
      desc: t.adv12hDesc,
      badge: '2 500 KGS+',
    },
    {
      icon: Calendar,
      title: t.adv24hTitle,
      desc: t.adv24hDesc,
      badge: '5 000 KGS',
    },
    {
      icon: Coffee,
      title: t.advBreakfastTitle,
      desc: t.advBreakfastDesc,
      badge: language === 'ky' ? 'Заказ боюнча' : language === 'ru' ? 'Под заказ' : 'On request',
    },
    {
      icon: BedDouble,
      title: t.advRoomsTitle,
      desc: t.advRoomsDesc,
      badge: '11 Rooms',
    },
    {
      icon: MapPin,
      title: t.advLocationTitle,
      desc: t.advLocationDesc,
      badge: 'Sadovaya 82',
    },
    {
      icon: Headphones,
      title: t.advSupportTitle,
      desc: t.advSupportDesc,
      badge: '24/7',
    },
  ];

  return (
    <section className="relative bg-[#0F1115] text-[#E0E0E0] pt-12 pb-20 overflow-hidden border-b border-[#252936]">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs font-semibold uppercase tracking-widest font-sans">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{t.heroBadge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF8F5] leading-[1.15] font-display">
              {t.heroTitle}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E2BE78] to-[#C5A059] text-3xl sm:text-4xl lg:text-5xl mt-2 font-display italic font-normal">
                {language === 'ky' 
                  ? 'Эркин туруу жана чыныгы жайлуулук' 
                  : language === 'ru' 
                  ? 'Комфорт без фиксированного часа выезда' 
                  : 'Flexible Stays with Exact Checkout'}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#9CA3AF] leading-relaxed max-w-2xl font-normal font-sans">
              {t.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/booking')}
                className="px-6 py-3.5 rounded-xl font-bold gold-gradient-btn shadow-lg shadow-[#C5A059]/20 active:scale-95 transition-all flex items-center gap-2 text-[#0F1115]"
              >
                <span>{t.heroPrimaryCta}</span>
                <ArrowRight className="w-4 h-4 text-[#0F1115]" />
              </button>

              <button
                onClick={() => navigate('/rooms')}
                className="px-6 py-3.5 rounded-xl font-semibold bg-[#1F222A] hover:bg-[#262A35] text-[#E0E0E0] border border-[#252936] active:scale-95 transition-all"
              >
                {t.heroSecondaryCta}
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#252936] text-[#E0E0E0]">
              <div>
                <div className="text-2xl font-bold text-[#C5A059] font-display">11</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">
                  {language === 'ky' ? 'Жайлуу бөлмөлөр' : language === 'ru' ? 'Уютных номеров' : 'Modern Rooms'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#D8B46C] font-display">12h / 24h</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">
                  {language === 'ky' ? 'Ийкемдүү эсептөө' : language === 'ru' ? 'Точный расчет' : 'Relative Stays'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#FAF8F5] font-display">24/7</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">
                  {language === 'ky' ? 'Ресепшн & Коноктоо' : language === 'ru' ? 'Прием гостей' : 'Front Desk'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Stay Duration & Checkout Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-6 shadow-2xl backdrop-blur-sm relative">
              <div className="flex items-center justify-between pb-4 border-b border-[#252936]">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="font-bold text-[#FAF8F5] text-base font-display">
                    {language === 'ky' ? 'Ыкчам эсептөөчү' : language === 'ru' ? 'Калькулятор времени' : 'Stay Time Calculator'}
                  </h3>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded bg-[#C5A059]/15 text-[#C5A059] font-medium border border-[#C5A059]/30">
                  {language === 'ky' ? '12:00 чектөөсүз' : language === 'ru' ? 'Без 12:00 выезда' : 'No 12:00 checkout'}
                </span>
              </div>

              <div className="space-y-4 py-4">
                {/* Date Input */}
                <div>
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
                    {t.selectCheckInDate}
                  </label>
                  <input
                    type="date"
                    value={quickDate}
                    onChange={(e) => setQuickDate(e.target.value)}
                    className="w-full bg-[#1F222A] border border-[#252936] rounded-xl px-3.5 py-2.5 text-sm text-[#E0E0E0] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {/* Time Input */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
                      {t.selectCheckInTime}
                    </label>
                    <input
                      type="time"
                      value={quickTime}
                      onChange={(e) => setQuickTime(e.target.value)}
                      className="w-full bg-[#1F222A] border border-[#252936] rounded-xl px-3.5 py-2.5 text-sm text-[#E0E0E0] focus:outline-none focus:border-[#C5A059] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
                      {t.selectDuration}
                    </label>
                    <select
                      value={quickDuration}
                      onChange={(e) => setQuickDuration(e.target.value as StayDuration)}
                      className="w-full bg-[#1F222A] border border-[#252936] rounded-xl px-3.5 py-2.5 text-sm text-[#E0E0E0] focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="12h">{t.duration12hOption}</option>
                      <option value="24h">{t.duration24hOption}</option>
                    </select>
                  </div>
                </div>

                {/* Resulting exact checkout box */}
                <div className="bg-[#0F1115] rounded-xl p-4 border border-[#C5A059]/30 space-y-2">
                  <div className="text-xs text-[#C5A059] font-semibold uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{t.calculatedCheckOutNotice}</span>
                  </div>
                  <div className="text-base font-bold text-[#FAF8F5] font-mono">
                    {formatDateTime(checkOutDateObj, language)}
                  </div>
                  <div className="text-xs text-[#9CA3AF]">
                    {quickDuration === '12h'
                      ? (language === 'ky' ? 'Келген убакыттан так 12 саат өткөндө' : language === 'ru' ? 'Ровно 12 часов с момента заезда' : 'Exactly 12 hours from arrival')
                      : (language === 'ky' ? 'Келген убакыттан так 24 саат өткөндө' : language === 'ru' ? 'Ровно 24 часа с момента заезда' : 'Exactly 24 hours from arrival')}
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartBooking}
                className="w-full py-3.5 rounded-xl font-bold gold-gradient-btn shadow-md transition-all flex items-center justify-center gap-2 text-[#0F1115]"
              >
                <span>{language === 'ky' ? 'Бул убакытка бөлмө издөө' : language === 'ru' ? 'Найти свободные номера' : 'Find Available Rooms'}</span>
                <ArrowRight className="w-4 h-4 text-[#0F1115]" />
              </button>
            </div>
          </div>
        </div>

        {/* 6 Key Advantages Grid */}
        <div className="mt-16 pt-12 border-t border-[#252936]">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FAF8F5] font-display">
              {language === 'ky' ? 'Bishkek Hotel артыкчылыктары' : language === 'ru' ? 'Почему выбирают Bishkek Hotel' : 'Why Choose Bishkek Hotel'}
            </h2>
            <p className="text-sm text-[#9CA3AF] mt-1 font-sans">
              {language === 'ky' ? 'Садовая 82 дарегиндеги ыңгайлуулук жана так эсеп' : language === 'ru' ? 'Честный сервис и комфорт на Садовой 82' : 'Convenience, comfort, and transparent pricing on Sadovaya 82'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {advantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#14161C] hover:bg-[#1F222A] border border-[#252936] hover:border-[#C5A059]/40 rounded-xl p-5 transition-all group shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-[#0F1115] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#1F222A] text-[#C5A059] font-semibold border border-[#252936]">
                      {adv.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#FAF8F5] mb-1 font-display">{adv.title}</h3>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">{adv.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

