import React from 'react';
import { useHotel } from '../context/HotelContext';
import { Phone, MessageCircle, Calendar } from 'lucide-react';

export const MobileActionBar: React.FC = () => {
  const { language, setActiveTab, settings } = useHotel();

  const handleBookClick = () => {
    setActiveTab('booking');
    const el = document.getElementById('booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const primaryPhone = settings.phones[0] ? settings.phones[0].replace(/\s/g, '') : '0880334335';
  const whatsappNumber = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '996503334335';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#14161C]/95 backdrop-blur-lg border-t border-[#252936] px-3 py-2 shadow-2xl safe-area-bottom">
      <div className="grid grid-cols-3 gap-2">
        {/* Call Button */}
        <a
          id="mobile-call-btn"
          href={`tel:${primaryPhone}`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#1F222A] hover:bg-[#252936] text-[#FAF8F5] border border-[#252936] transition-colors"
        >
          <Phone className="w-4 h-4 text-[#C5A059] mb-0.5" />
          <span className="text-[11px] font-bold">
            {language === 'ky' ? 'Чалуу' : language === 'ru' ? 'Позвонить' : 'Call'}
          </span>
        </a>

        {/* WhatsApp Button */}
        <a
          id="mobile-whatsapp-btn"
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/50 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400 mb-0.5" />
          <span className="text-[11px] font-bold">WhatsApp</span>
        </a>

        {/* Book Room Button */}
        <button
          id="mobile-book-btn"
          type="button"
          onClick={handleBookClick}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl gold-gradient-btn font-bold text-[#0F1115] shadow transition-transform active:scale-95"
        >
          <Calendar className="w-4 h-4 text-[#0F1115] mb-0.5" />
          <span className="text-[11px] font-bold">
            {language === 'ky' ? 'Брондоо' : language === 'ru' ? 'Бронь' : 'Book'}
          </span>
        </button>
      </div>
    </div>
  );
};
