import React, { useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { PageBanner } from '../components/PageBanner';
import { RoomsSection } from '../components/RoomsSection';
import { StayLogicBanner } from '../components/StayLogicBanner';
import { FAQSection } from '../components/FAQSection';
import { BedDouble } from 'lucide-react';

export const RoomsPage: React.FC = () => {
  const { language, t } = useHotel();

  useEffect(() => {
    document.title = 'Бөлмөлөр — Bishkek Hotel';
  }, []);

  const title = t.navRooms;
  const subtitle =
    language === 'ky'
      ? 'Bishkek Hotel — бардык 11 бөлмө заманбап эмеректер, ийкемдүү 12 жана 24 сааттык туруу мүмкүнчүлүгү менен жабдылган.'
      : language === 'ru'
      ? 'Bishkek Hotel — все 11 номеров оснащены всем необходимым для комфортного отдыха на 12 или 24 часа.'
      : 'Bishkek Hotel — all 11 rooms feature comfortable furnishings with flexible 12-hour and 24-hour stay options.';

  return (
    <main>
      <PageBanner
        title={title}
        subtitle={subtitle}
        badge={language === 'ky' ? '11 Бөлмө' : language === 'ru' ? '11 Номеров' : '11 Total Rooms'}
        badgeIcon={<BedDouble className="w-3.5 h-3.5 text-[#C5A059]" />}
      />
      <RoomsSection />
      <StayLogicBanner />
      <FAQSection />
    </main>
  );
};
