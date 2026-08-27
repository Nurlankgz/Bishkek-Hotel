import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { MapPin, Phone, Navigation, Copy, Check, ExternalLink, Clock } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const { language, t, settings } = useHotel();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(settings.address[language]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="location" className="py-20 bg-[#0F1115] text-[#E0E0E0] relative border-b border-[#252936]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-xs font-semibold uppercase tracking-widest mb-2 border border-[#C5A059]/25 font-sans">
            <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{t.locationTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#FAF8F5] font-display">
            {t.locationTitle}
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-2 font-sans">
            {t.locationSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Info Card */}
          <div className="lg:col-span-5 bg-[#14161C] border border-[#252936] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-[#C5A059] font-sans">
                  {settings.name}
                </span>
                <h3 className="text-2xl font-bold text-[#FAF8F5] mt-1 font-display">
                  {language === 'ky' ? 'Биздин так дарегибиз' : language === 'ru' ? 'Наше точное местоположение' : 'Our Exact Location'}
                </h3>
              </div>

              {/* Address Box */}
              <div className="bg-[#0F1115] rounded-xl p-4 border border-[#252936] space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#FAF8F5] text-sm font-display">{settings.address[language]}</h4>
                    <p className="text-xs text-[#C5A059] font-medium mt-0.5 font-sans">
                      {settings.intersectionNote[language]}
                    </p>
                    <p className="text-[11px] text-[#9CA3AF] mt-1 font-sans">
                      {language === 'ky' 
                        ? 'Чүй проспектисине жана шаардын борборуна жакын, тынч аймак.' 
                        : language === 'ru' 
                        ? 'Удобный заезд с основных магистралей Бишкека, тихий район.' 
                        : 'Convenient approach from Bishkek main arteries, quiet residential area.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCopyAddress}
                  className="w-full mt-2 py-2 rounded-lg bg-[#1F222A] hover:bg-[#252936] text-xs font-semibold text-[#E0E0E0] border border-[#252936] transition-colors flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C5A059]" />}
                  <span>{copied ? t.addressCopiedNotice : t.copyAddressBtn}</span>
                </button>
              </div>

              {/* Phone Numbers */}
              <div className="bg-[#0F1115] rounded-xl p-4 border border-[#252936] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FAF8F5]">
                  <Phone className="w-4 h-4 text-[#C5A059]" />
                  <span>{t.hotelPhonesLabel}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {settings.phones.map((phone, idx) => (
                    <a
                      key={idx}
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="p-2.5 rounded-lg bg-[#14161C] border border-[#252936] hover:border-[#C5A059]/50 text-xs font-bold text-[#FAF8F5] hover:text-[#C5A059] transition-colors flex items-center justify-between font-mono"
                    >
                      <span>{phone}</span>
                      <span className="text-[10px] text-[#C5A059] font-semibold uppercase font-sans">24/7</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Front Desk Badge */}
              <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                <Clock className="w-4 h-4 text-[#C5A059]" />
                <span className="font-sans">
                  {language === 'ky' ? 'Ресепшн 24/7 иштейт. Келүү үчүн алдын ала чалсаңыз болот.' : language === 'ru' ? 'Ресепшн работает 24/7. Встречаем гостей в любое время суток.' : '24/7 Front desk ready for welcoming you at any hour.'}
                </span>
              </div>
            </div>

            {/* Get Directions Button */}
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-xl font-semibold gold-gradient-btn flex items-center justify-center gap-2 shadow-lg active:scale-95 text-sm transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>{t.getDirectionsBtn}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Right Interactive Map Card */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#252936] bg-[#14161C] shadow-2xl relative min-h-[380px] flex flex-col">
            <div className="bg-[#14161C] px-4 py-3 border-b border-[#252936] flex items-center justify-between text-xs text-[#9CA3AF]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-semibold text-[#FAF8F5]">Google Maps Interactive Preview</span>
              </div>
              <span className="text-[#C5A059] font-sans text-[11px]">Садовая 82 / Будённого</span>
            </div>

            <div className="flex-1 relative w-full h-full min-h-[340px] bg-[#0F1115]">
              <iframe
                title="Bishkek Hotel Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2923.771239846201!2d74.6390123!3d42.8779432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x389eb7c59a35e2cf%3A0x8e8749a46698651c!2sBishkek%2C%20Kyrgyzstan!5e0!3m2!1sen!2skg!4v1700000000000!5m2!1sen!2skg"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '340px' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale contrast-125 opacity-80 hover:opacity-100 transition-opacity"
              />

              {/* Map Floating Location Pin Card */}
              <div className="absolute top-4 left-4 bg-[#0F1115]/95 backdrop-blur-md p-3.5 rounded-xl border border-[#C5A059]/40 text-xs shadow-2xl max-w-xs pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#C5A059]" />
                  <strong className="text-[#FAF8F5] font-bold font-display">Bishkek Hotel</strong>
                </div>
                <p className="text-[#9CA3AF] text-[11px] mt-1 font-sans">
                  Sadovaya 82 (Corner of Budennogo)
                </p>
                <div className="mt-1 text-[10px] text-emerald-400 font-medium font-sans">
                  ✓ Open 24 Hours
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
