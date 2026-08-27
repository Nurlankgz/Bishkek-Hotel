import React from 'react';
import { useHotel } from '../context/HotelContext';
import { Building2, MapPin, Phone, MessageSquare, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t, settings, setActiveTab } = useHotel();

  return (
    <footer className="bg-[#0B0C0E] text-[#9CA3AF] border-t border-[#252936] text-xs">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#DFB972] flex items-center justify-center text-[#0F1115] font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-base font-bold text-[#FAF8F5] tracking-tight font-display">Bishkek Hotel</span>
            </div>
            <p className="text-[#9CA3AF] leading-relaxed font-sans">
              {language === 'ky' 
                ? 'Бишкек шаарындагы заманбап мейманкана. 12 жана 24 сааттык ийкемдүү эсептөө.' 
                : language === 'ru' 
                ? 'Современный отель в Бишкеке с честным расчетом времени на 12 и 24 часа без фиксированного часа выезда.' 
                : 'Modern boutique hotel in Bishkek featuring exact relative checkout times for 12h & 24h stays.'}
            </p>
            <div className="text-[11px] text-[#C5A059] font-medium font-sans">
              Sadovaya 82 • 24/7 Front Desk
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#FAF8F5] text-sm font-display">
              {language === 'ky' ? 'Бөлүмдөр' : language === 'ru' ? 'Навигация' : 'Navigation'}
            </h4>
            <ul className="space-y-2 font-sans">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-[#C5A059] transition-colors">
                  {t.navHome}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('rooms')} className="hover:text-[#C5A059] transition-colors">
                  {t.navRooms}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('booking')} className="hover:text-[#C5A059] transition-colors">
                  {t.navBooking}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#C5A059] transition-colors">
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-[#C5A059] transition-colors">
                  {t.navContact}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#FAF8F5] text-sm font-display">
              {language === 'ky' ? 'Байланыш' : language === 'ru' ? 'Контакты' : 'Contact'}
            </h4>
            <div className="space-y-2 font-sans">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{settings.address[language]} ({settings.intersectionNote[language]})</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href={`tel:${settings.phones[0].replace(/\s/g, '')}`} className="hover:text-[#FAF8F5] font-mono">
                  {settings.phones[0]}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href={`tel:${settings.phones[1].replace(/\s/g, '')}`} className="hover:text-[#FAF8F5] font-mono">
                  {settings.phones[1]}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#FAF8F5] font-mono text-emerald-400"
                >
                  WhatsApp: +996 503 334 335
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Stay Formats */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#FAF8F5] text-sm font-display">
              {language === 'ky' ? 'Тартип жана баалар' : language === 'ru' ? 'Форматы проживания' : 'Stay Options'}
            </h4>
            <div className="bg-[#14161C] border border-[#252936] rounded-xl p-3.5 space-y-2 text-[11px] font-sans">
              <div className="flex items-center gap-1.5 text-[#C5A059] font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>{language === 'ky' ? '12 жана 24 сааттык туруу' : language === 'ru' ? '12 и 24 часа проживания' : '12h & 24h stays'}</span>
              </div>
              <p className="text-[#9CA3AF] leading-relaxed">
                {language === 'ky' 
                  ? 'Чыгуу убактысы Сиз келген убакыттан так эсептелет. 24/7 кабыл алабыз.' 
                  : language === 'ru' 
                  ? 'Время выезда считается точно от момента заезда. Ресепшн открыт круглосуточно.' 
                  : 'Check-out is measured from exact arrival time. 24/7 reception.'}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#252936] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#9CA3AF] font-sans">
          <div>
            © {new Date().getFullYear()} Bishkek Hotel. Sadovaya 82, Bishkek, Kyrgyzstan.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059] font-medium">0880 334 335</span>
            <span className="text-[#252936]">|</span>
            <span className="text-[#C5A059] font-medium">0503 334 335</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
