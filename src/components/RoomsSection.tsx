import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotel } from '../context/HotelContext';
import { Room } from '../types';
import { RoomCard } from './RoomCard';
import { BedDouble, Info } from 'lucide-react';

export const RoomsSection: React.FC = () => {
  const { rooms, language, t, setSelectedRoomForBooking } = useHotel();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredRooms = rooms.filter((room) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === '1-2') return room.roomNumber >= 1 && room.roomNumber <= 2;
    if (activeFilter === '3-7') return room.roomNumber >= 3 && room.roomNumber <= 7;
    if (activeFilter === '8-11') return room.roomNumber >= 8 && room.roomNumber <= 11;
    return true;
  });

  const handleBookNow = (room: Room) => {
    setSelectedRoomForBooking(room);
    navigate('/booking');
  };

  return (
    <section id="rooms" className="py-20 bg-[#0F1115] text-[#E0E0E0] relative border-b border-[#252936]">

      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#252936]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-xs font-semibold uppercase tracking-widest mb-2 border border-[#C5A059]/25 font-sans">
              <BedDouble className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{language === 'ky' ? '11 Бөлмө' : language === 'ru' ? '11 Номеров' : '11 Total Rooms'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#FAF8F5] tracking-tight font-display">
              {t.roomsSectionTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#9CA3AF] mt-1.5 max-w-xl font-sans">
              {t.roomsSectionSubtitle}
            </p>
          </div>

          {/* Filter Tabs by Room Numbers */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#14161C] p-1.5 rounded-xl border border-[#252936]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#C5A059] text-[#0F1115] font-bold shadow'
                  : 'text-[#9CA3AF] hover:text-[#E0E0E0]'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setActiveFilter('1-2')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === '1-2'
                  ? 'bg-[#C5A059] text-[#0F1115] font-bold shadow'
                  : 'text-[#9CA3AF] hover:text-[#E0E0E0]'
              }`}
            >
              {language === 'ky' ? '№1–2 (2 500 с)' : language === 'ru' ? '№1–2 (2 500 с)' : 'Rooms 1–2 (2,500 KGS)'}
            </button>
            <button
              onClick={() => setActiveFilter('3-7')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === '3-7'
                  ? 'bg-[#C5A059] text-[#0F1115] font-bold shadow'
                  : 'text-[#9CA3AF] hover:text-[#E0E0E0]'
              }`}
            >
              {language === 'ky' ? '№3–7 (2 800 с)' : language === 'ru' ? '№3–7 (2 800 с)' : 'Rooms 3–7 (2,800 KGS)'}
            </button>
            <button
              onClick={() => setActiveFilter('8-11')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === '8-11'
                  ? 'bg-[#C5A059] text-[#0F1115] font-bold shadow'
                  : 'text-[#9CA3AF] hover:text-[#E0E0E0]'
              }`}
            >
              {language === 'ky' ? '№8–11' : language === 'ru' ? '№8–11' : 'Rooms 8–11'}
            </button>
          </div>
        </div>

        {/* Confirmed Pricing Notice Card */}
        <div className="bg-[#14161C] border border-[#252936] rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#E0E0E0] shadow-sm">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>
              <strong className="text-[#FAF8F5]">{language === 'ky' ? 'Тастыкталган баалар:' : language === 'ru' ? 'Подтвержденные тарифы:' : 'Confirmed Rates:'}</strong>{' '}
              <span className="text-[#9CA3AF]">
                {language === 'ky' 
                  ? '№1–2: 12с = 2 500 сом | №3–7: 12с = 2 800 сом | №8–11: 12с = 2 800 сом | Бардык бөлмөлөр: 24с = 5 000 сом (🍳 Эртең мененки тамак: Заказ боюнча даярдалат).' 
                  : language === 'ru' 
                  ? '№1–2: 12ч = 2 500 сом | №3–7: 12ч = 2 800 сом | №8–11: 12ч = 2 800 сом | Все номера: 24ч = 5 000 сом (🍳 Завтрак: Готовится под заказ).' 
                  : 'Rooms 1–2: 12h = 2,500 KGS | Rooms 3–7: 12h = 2,800 KGS | Rooms 8–11: 12h = 2,800 KGS | All rooms: 24h = 5,000 KGS (🍳 Breakfast: Prepared on request).'}
              </span>
            </span>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} onBookNow={handleBookNow} />
          ))}
        </div>
      </div>
    </section>
  );
};
