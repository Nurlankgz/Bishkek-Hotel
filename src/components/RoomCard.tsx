import React, { useState } from 'react';
import { Room } from '../types';
import { useHotel } from '../context/HotelContext';
import { formatCurrency } from '../utils/bookingLogic';
import { 
  Calendar, 
  Info,
  Coffee,
  X
} from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onBookNow: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onBookNow }) => {
  const { language, t } = useHotel();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[#14161C] border border-[#252936] hover:border-[#C5A059]/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#C5A059]/5 transition-all flex flex-col group">
        {/* Room Image Container */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#0F1115]">
          <img
            src={room.image}
            alt={room.name[language]}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14161C] via-transparent to-black/30" />

          {/* Room Number Badge */}
          <div className="absolute top-3 left-3 bg-[#0F1115]/90 backdrop-blur-sm border border-[#C5A059]/40 text-[#C5A059] px-3 py-1 rounded-lg text-sm font-bold shadow font-display">
            {room.name[language]}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xl font-bold text-[#FAF8F5] group-hover:text-[#C5A059] transition-colors font-display">
              {room.name[language]}
            </h3>
            
            {/* Confirmed info description */}
            <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed font-sans">
              {room.price12h 
                ? (language === 'ky' 
                    ? `12 сааттык туруу: ${formatCurrency(room.price12h, language)} | 24 саат: 5 000 сом.`
                    : language === 'ru'
                    ? `Тариф на 12 часов: ${formatCurrency(room.price12h, language)} | 24 часа: 5 000 сом.`
                    : `12-hour stay: ${formatCurrency(room.price12h, language)} | 24-hour: 5,000 KGS.`)
                : (language === 'ky'
                    ? `12 сааттык туруу: Баасы такталууда | 24 саат: 5 000 сом.`
                    : language === 'ru'
                    ? `Тариф на 12 часов: Цена уточняется | 24 часа: 5 000 сом.`
                    : `12-hour stay: Price to be determined | 24-hour: 5,000 KGS.`)
              }
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="bg-[#0F1115] rounded-xl p-3.5 border border-[#252936] space-y-2.5">
            {/* 12h Rate */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#9CA3AF] font-medium">{t.price12hLabel}</span>
              <span className={`font-bold ${room.price12h ? 'text-[#C5A059] text-sm' : 'text-[#9CA3AF] italic text-xs'}`}>
                {room.price12h ? formatCurrency(room.price12h, language) : t.priceTBD}
              </span>
            </div>

            {/* 24h Rate */}
            <div className="flex items-center justify-between text-xs border-t border-[#252936] pt-2">
              <span className="text-[#9CA3AF] font-medium">{t.price24hLabel}</span>
              <div className="text-right">
                <span className="font-bold text-[#FAF8F5] text-sm">
                  {formatCurrency(room.price24hWithoutBreakfast, language)}
                </span>
              </div>
            </div>

            {/* Breakfast Notice for 24h */}
            <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] bg-[#14161C] px-2.5 py-1.5 rounded-lg border border-[#252936]/60">
              <span className="flex items-center gap-1 text-[#D8B46C]">
                <Coffee className="w-3.5 h-3.5 text-[#C5A059]" />
                {language === 'ky' ? 'Эртең мененки тамак:' : language === 'ru' ? 'Завтрак:' : 'Breakfast:'}
              </span>
              <span className="font-medium text-[#FAF8F5]">
                {t.advBreakfastDesc}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#1F222A] hover:bg-[#262A35] text-[#E0E0E0] border border-[#252936] transition-colors flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{t.roomDetailsBtn}</span>
            </button>

            <button
              onClick={() => onBookNow(room)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold gold-gradient-btn transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 text-[#0F1115]" />
              <span>{t.bookThisRoomBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Room Details Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14161C] border border-[#252936] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative">
            <div className="relative h-56 w-full">
              <img
                src={room.image}
                alt={room.name[language]}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0F1115]/80 text-white flex items-center justify-center hover:bg-[#1F222A] transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 bg-[#0F1115]/90 text-[#C5A059] px-3 py-1 rounded-lg text-sm font-bold border border-[#C5A059]/30 font-display">
                {room.name[language]}
              </div>
            </div>

            <div className="p-6 space-y-5 text-[#E0E0E0]">
              <div>
                <h3 className="text-2xl font-bold text-[#FAF8F5] font-display">{room.name[language]}</h3>
                <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed font-sans">
                  {language === 'ky' 
                    ? 'Bishkek Hotel отелинин бөлмөсү. 12 сааттык жана 24 сааттык туруу варианттары жеткиликтүү.' 
                    : language === 'ru' 
                    ? 'Номер отеля Bishkek Hotel. Доступны тарифы на 12 и 24 часа.' 
                    : 'Bishkek Hotel guest room. 12-hour and 24-hour stay options available.'}
                </p>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2.5 bg-[#0F1115] p-4 rounded-xl border border-[#252936]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#9CA3AF] font-medium">{t.price12hLabel}</span>
                  <span className={`font-bold ${room.price12h ? 'text-[#C5A059] text-base' : 'text-[#9CA3AF] italic text-xs'}`}>
                    {room.price12h ? formatCurrency(room.price12h, language) : t.priceTBD}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-[#252936] pt-2.5">
                  <span className="text-[#9CA3AF] font-medium">{t.price24hLabel}</span>
                  <span className="font-bold text-[#FAF8F5] text-base">
                    {formatCurrency(room.price24hWithoutBreakfast, language)}
                  </span>
                </div>
                <div className="space-y-1.5 border-t border-[#252936] pt-2.5 bg-[#14161C] p-3 rounded-lg">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#D8B46C] font-semibold flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5 text-[#C5A059]" />
                      {language === 'ky' ? '🍳 Эртең мененки тамак:' : language === 'ru' ? '🍳 Завтрак:' : '🍳 Breakfast:'}
                    </span>
                    <span className="font-semibold text-[#FAF8F5]">
                      {t.advBreakfastDesc}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                    {t.advBreakfastLongDesc}
                  </p>
                  <p className="text-[10px] text-[#C5A059] font-medium pt-0.5">
                    {t.advBreakfastPriceNote}
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl text-xs font-semibold bg-[#1F222A] hover:bg-[#262A35] text-[#9CA3AF] hover:text-[#FAF8F5] transition-colors border border-[#252936]"
                >
                  {language === 'ky' ? 'Жабуу' : language === 'ru' ? 'Закрыть' : 'Close'}
                </button>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    onBookNow(room);
                  }}
                  className="w-2/3 py-2.5 rounded-xl text-xs font-bold gold-gradient-btn transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Calendar className="w-4 h-4 text-[#0F1115]" />
                  <span>{t.bookThisRoomBtn}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
