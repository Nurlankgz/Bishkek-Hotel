import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotel } from '../context/HotelContext';
import { formatCurrency } from '../utils/bookingLogic';
import { ArrowRight, BedDouble, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export const HomeRoomsPreview: React.FC = () => {
  const { language, t, rooms, setSelectedRoomForBooking } = useHotel();
  const navigate = useNavigate();

  // Pick 3 representative rooms (Room 1 @ 2500, Room 3 @ 2800, Room 8 @ 2800)
  const featuredRooms = rooms.filter((r) => [1, 3, 8].includes(r.roomNumber));

  const handleBookRoom = (room: typeof rooms[0]) => {
    setSelectedRoomForBooking(room);
    navigate('/booking');
  };

  return (
    <section className="py-20 bg-[#0F1115] border-b border-[#252936]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs font-semibold uppercase tracking-widest mb-3">
              <BedDouble className="w-3.5 h-3.5" />
              <span>{language === 'ky' ? '11 Бөлмө' : language === 'ru' ? '11 Номеров' : '11 Total Rooms'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#FAF8F5] font-display">
              {t.roomsTitle}
            </h2>
            <p className="text-sm text-[#9CA3AF] mt-2 max-w-xl">
              {t.roomsSubtitle}
            </p>
          </div>

          <button
            onClick={() => navigate('/rooms')}
            className="self-start md:self-auto px-5 py-3 rounded-xl bg-[#1F222A] hover:bg-[#262A35] text-[#FAF8F5] border border-[#252936] font-semibold text-sm transition-all flex items-center gap-2 hover:border-[#C5A059]/50 shadow-sm"
          >
            <span>{language === 'ky' ? 'Бардык 11 бөлмөнү көрүү' : language === 'ru' ? 'Посмотреть все 11 номеров' : 'View All 11 Rooms'}</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </button>
        </div>

        {/* 3 Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {featuredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-[#14161C] border border-[#252936] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-[#C5A059]/40 transition-all group"
            >
              <div>
                <div className="relative h-52 overflow-hidden bg-[#0F1115]">
                  <img
                    src={room.image}
                    alt={room.name[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#0F1115]/90 backdrop-blur-sm border border-[#C5A059]/40 text-[#C5A059] px-3 py-1 rounded-lg text-xs font-bold shadow">
                    {room.name[language]}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#0F1115]/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[11px] font-medium text-[#E0E0E0] border border-[#252936]">
                    {room.floor}-{language === 'ky' ? 'кабат' : language === 'ru' ? 'этаж' : 'floor'}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#FAF8F5] group-hover:text-[#C5A059] transition-colors font-display">
                      {room.name[language]}
                    </h3>
                    <p className="text-xs text-[#9CA3AF] mt-1 line-clamp-2">
                      {room.description[language]}
                    </p>
                  </div>

                  <div className="bg-[#0F1115] rounded-xl p-3.5 border border-[#252936] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#9CA3AF]">{t.price12hLabel}</span>
                      <span className="font-bold text-[#C5A059] text-sm">
                        {room.price12h ? formatCurrency(room.price12h, language) : '2 800 сом'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#252936] pt-2">
                      <span className="text-[#9CA3AF]">{t.price24hLabel}</span>
                      <span className="font-bold text-[#FAF8F5] text-sm">
                        {formatCurrency(room.price24hWithoutBreakfast, language)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => handleBookRoom(room)}
                  className="w-full py-3 rounded-xl font-bold text-xs gold-gradient-btn text-[#0F1115] shadow transition-all active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <span>{t.roomBookNow}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0F1115]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Banner */}
        <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#C5A059] shrink-0" />
            <div className="text-xs text-[#E0E0E0]">
              <span className="font-bold text-[#FAF8F5]">
                {language === 'ky' ? 'Бардык 11 бөлмө даярдалган:' : language === 'ru' ? 'Все 11 номеров подготовлены:' : 'All 11 Rooms Prepared:'}
              </span>{' '}
              <span className="text-[#9CA3AF]">
                {language === 'ky'
                  ? '№1–2: 2 500 сом (12с) | №3–7: 2 800 сом (12с) | №8–11: 2 800 сом (12с) | 24 саат: 5 000 сом'
                  : language === 'ru'
                  ? '№1–2: 2 500 сом (12ч) | №3–7: 2 800 сом (12ч) | №8–11: 2 800 сом (12ч) | 24 часа: 5 000 сом'
                  : 'Rooms 1–2: 2,500 KGS (12h) | Rooms 3–7: 2,800 KGS (12h) | Rooms 8–11: 2,800 KGS (12h) | 24-hour: 5,000 KGS'}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/rooms')}
            className="text-xs font-bold text-[#C5A059] hover:underline shrink-0"
          >
            {language === 'ky' ? 'Толук каталог →' : language === 'ru' ? 'Полный каталог →' : 'Full Catalog →'}
          </button>
        </div>
      </div>
    </section>
  );
};
