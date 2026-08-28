import React, { useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { PageBanner } from '../components/PageBanner';
import { AboutSection } from '../components/AboutSection';
import { StayLogicBanner } from '../components/StayLogicBanner';
import { ReviewsSection } from '../components/ReviewsSection';
import { Building2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { language, t } = useHotel();

  useEffect(() => {
    document.title = 'Отел жөнүндө — Bishkek Hotel';
  }, []);

  const title = t.navAbout;
  const subtitle =
    language === 'ky'
      ? 'Бишкек шаары, Садовая 82 дарегиндеги ыңгайлуу мейманкана — 24/7 ресепшн жана так эсептелүүчү ийкемдүү туруу.'
      : language === 'ru'
      ? 'Уютный отель в Бишкеке на ул. Садовая 82 — круглосуточный прием гостей и честные тарифы на 12 и 24 часа.'
      : 'Modern boutique hotel in Bishkek on Sadovaya 82 — 24/7 reception and relative 12h/24h stay calculations.';

  return (
    <main>
      <PageBanner
        title={title}
        subtitle={subtitle}
        badge={language === 'ky' ? '24/7 Мейманкана' : language === 'ru' ? 'Отель 24/7' : '24/7 Hotel'}
        badgeIcon={<Building2 className="w-3.5 h-3.5 text-[#C5A059]" />}
      />
      <AboutSection />
      <StayLogicBanner />
      <ReviewsSection />
    </main>
  );
};
