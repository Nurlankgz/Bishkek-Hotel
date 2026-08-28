import React, { useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { PageBanner } from '../components/PageBanner';
import { BookingWizard } from '../components/BookingWizard';
import { FAQSection } from '../components/FAQSection';
import { Calendar } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const { language, t } = useHotel();

  useEffect(() => {
    document.title = 'Брондоо — Bishkek Hotel';
  }, []);

  const title = t.navBooking;
  const subtitle =
    language === 'ky'
      ? 'Келүү күнүңүздү жана так убактыңызды тандап, 12 же 24 сааттык туруу үчүн бөлмөнү дароо брондоңуз.'
      : language === 'ru'
      ? 'Выберите дату и точное время заезда, чтобы забронировать номер на 12 или 24 часа с точным расчетом времени выезда.'
      : 'Select your check-in date and exact arrival time to book a 12-hour or 24-hour stay with precise checkout calculation.';

  return (
    <main>
      <PageBanner
        title={title}
        subtitle={subtitle}
        badge={language === 'ky' ? 'Ыкчам онлайн брондоо' : language === 'ru' ? 'Быстрое онлайн бронирование' : 'Instant Online Booking'}
        badgeIcon={<Calendar className="w-3.5 h-3.5 text-[#C5A059]" />}
      />
      <BookingWizard />
      <FAQSection />
    </main>
  );
};
