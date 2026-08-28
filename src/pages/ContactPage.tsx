import React, { useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { PageBanner } from '../components/PageBanner';
import { ContactSection } from '../components/ContactSection';
import { LocationSection } from '../components/LocationSection';
import { FAQSection } from '../components/FAQSection';
import { Phone } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { language, t } = useHotel();

  useEffect(() => {
    document.title = 'Байланыш — Bishkek Hotel';
  }, []);

  const title = t.navContact;
  const subtitle =
    language === 'ky'
      ? 'Биз менен 24/7 телефон же WhatsApp аркылуу байланышыңыз, же Садовая 82 дарегине келиңиз.'
      : language === 'ru'
      ? 'Свяжитесь с нами круглосуточно 24/7 по телефонам или WhatsApp, либо приезжайте по адресу ул. Садовая 82.'
      : 'Reach out to our 24/7 front desk via phone or WhatsApp, or visit us at Sadovaya 82, Bishkek.';

  return (
    <main>
      <PageBanner
        title={title}
        subtitle={subtitle}
        badge={language === 'ky' ? '24/7 Байланыш' : language === 'ru' ? 'Связь 24/7' : '24/7 Support'}
        badgeIcon={<Phone className="w-3.5 h-3.5 text-[#C5A059]" />}
      />
      <ContactSection />
      <LocationSection />
      <FAQSection />
    </main>
  );
};
