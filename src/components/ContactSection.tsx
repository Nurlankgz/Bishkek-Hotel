import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Phone, MessageSquare, Send, Mail, MapPin, CheckCircle2, Clock } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { language, t, settings } = useHotel();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+996 ');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('+996 ');
      setMessage('');
    }, 2500);
  };

  return (
    <section id="contact" className="py-20 bg-[#0F1115] text-[#E0E0E0] relative border-b border-[#252936]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-xs font-semibold uppercase tracking-widest mb-2 border border-[#C5A059]/25 font-sans">
            <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{t.contactTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#FAF8F5] font-display">
            {t.contactTitle}
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-2 font-sans">
            {t.contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Quick Contact Options */}
          <div className="lg:col-span-5 space-y-4">
            {/* Phone numbers card */}
            <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-6 shadow-lg space-y-4">
              <h3 className="text-base font-bold text-[#FAF8F5] flex items-center gap-2 font-display">
                <Phone className="w-4 h-4 text-[#C5A059]" />
                <span>{t.phoneNumbers}</span>
              </h3>

              <div className="space-y-2.5">
                {settings.phones.map((phoneNum, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0F1115] border border-[#252936]"
                  >
                    <div>
                      <span className="text-xs text-[#9CA3AF] block font-sans">
                        {idx === 0 ? 'Primary Line' : 'Secondary Line'}
                      </span>
                      <strong className="text-sm text-[#FAF8F5] font-mono">{phoneNum}</strong>
                    </div>
                    <a
                      href={`tel:${phoneNum.replace(/\s/g, '')}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold gold-gradient-btn"
                    >
                      {t.callUs}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp direct card */}
            <div className="bg-[#14161C] border border-emerald-500/30 rounded-2xl p-6 shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base font-display">
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp 24/7</span>
              </div>
              <p className="text-xs text-[#9CA3AF] font-sans">
                {language === 'ky' 
                  ? 'Сүрөттөрдү, так убакытты же суроолорду WhatsApp аркылуу түз жөнөтүңүз.' 
                  : language === 'ru' 
                  ? 'Быстрое бронирование, фото номеров и ответы на любые вопросы в чате.' 
                  : 'Fast response, room photos, and instant reservations via WhatsApp.'}
              </p>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center justify-center gap-2 text-xs shadow"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.whatsappChat} (+996 503 334 335)</span>
              </a>
            </div>

            {/* Address & Hours */}
            <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-4 text-xs text-[#9CA3AF] space-y-2 font-sans">
              <div className="flex items-center gap-2 text-[#E0E0E0]">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>{settings.address[language]} ({settings.intersectionNote[language]})</span>
              </div>
              <div className="flex items-center gap-2 text-[#E0E0E0]">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === 'ky' ? '24 саат иштейбиз' : language === 'ru' ? 'Работаем круглосуточно 24/7' : 'Open 24/7, year-round'}</span>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 bg-[#14161C] border border-[#252936] rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-[#FAF8F5] mb-1 font-display">
              {t.sendDirectMsg}
            </h3>
            <p className="text-xs text-[#9CA3AF] mb-6 font-sans">
              {language === 'ky' ? 'Сурооңузду жазыңыз, администратор 10 мүнөттүн ичинде жооп берет.' : language === 'ru' ? 'Оставьте сообщение, дежурный администратор свяжется с вами.' : 'Leave a message, our front desk manager will contact you promptly.'}
            </p>

            {submitted ? (
              <div className="bg-[#0F1115] border border-[#C5A059]/40 p-6 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#C5A059] mx-auto" />
                <h4 className="font-bold text-base text-[#FAF8F5] font-display">
                  {t.contactFormSuccess}
                </h4>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#E0E0E0] mb-1.5 font-sans">
                      {t.guestNameLabel} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Иван / Азамат"
                      className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-4 py-2.5 text-xs text-[#FAF8F5] placeholder-[#6B7280] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#E0E0E0] mb-1.5 font-sans">
                      {t.guestPhoneLabel} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+996 700 123 456"
                      className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-4 py-2.5 text-xs text-[#FAF8F5] placeholder-[#6B7280] focus:outline-none focus:border-[#C5A059] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#E0E0E0] mb-1.5 font-sans">
                    {language === 'ky' ? 'Билдирүү / Суроо' : language === 'ru' ? 'Ваше сообщение / вопрос' : 'Your Message / Inquiry'} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={language === 'ky' ? 'Бөлмөлөр, баалар, тосуп алуу ж.б.' : language === 'ru' ? 'Интересующие даты, трансфер, спецпредложения...' : 'Dates, special requests, inquiries...'}
                    className="w-full bg-[#0F1115] border border-[#252936] rounded-xl p-3 text-xs text-[#FAF8F5] placeholder-[#6B7280] focus:outline-none focus:border-[#C5A059] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-semibold gold-gradient-btn shadow-md flex items-center justify-center gap-2 text-xs active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.sendBtn}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
