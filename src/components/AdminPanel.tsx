import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotel } from '../context/HotelContext';
import { Room, Booking, StayDuration } from '../types';
import { 
  formatCurrency, 
  formatDateTime, 
  generateReferenceCode, 
  calculateCheckOutDateTime, 
  combineDateAndTime, 
  isRoomAvailable 
} from '../utils/bookingLogic';
import { 
  ShieldCheck, 
  BedDouble, 
  Calendar, 
  Star, 
  Image as ImageIcon, 
  Settings as SettingsIcon, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  Trash2, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Phone, 
  User, 
  Search,
  Filter,
  RefreshCw,
  Eye
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { 
    rooms, 
    updateRoom, 
    updateRoom12hPrice, 
    bookings, 
    addBooking, 
    updateBookingStatus, 
    deleteBooking,
    reviews, 
    updateReviewStatus, 
    gallery, 
    settings, 
    updateSettings, 
    language, 
    t, 
    resetToDefaults
  } = useHotel();

  const [activeAdminTab, setActiveAdminTab] = useState<'rooms' | 'bookings' | 'reviews' | 'gallery' | 'settings'>('rooms');
  
  // Room Edit State
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editPrice12h, setEditPrice12h] = useState<string>('');
  const [editPrice24h, setEditPrice24h] = useState<string>('');
  const [editNameRu, setEditNameRu] = useState<string>('');
  const [editIsActive, setEditIsActive] = useState<boolean>(true);

  // Manual Booking Modal State
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [manualGuestName, setManualGuestName] = useState('');
  const [manualGuestPhone, setManualGuestPhone] = useState('+996 ');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualTime, setManualTime] = useState('14:00');
  const [manualDuration, setManualDuration] = useState<StayDuration>('12h');
  const [manualRoomId, setManualRoomId] = useState(rooms[0]?.id || 'room-1');
  const [manualBreakfast, setManualBreakfast] = useState(false);
  const [manualBreakfastCount, setManualBreakfastCount] = useState<number>(1);
  const [manualNotes, setManualNotes] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);

  // Filter Bookings State
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');

  const startEditRoom = (room: Room) => {
    setEditingRoomId(room.id);
    setEditPrice12h(room.price12h !== null ? String(room.price12h) : '');
    setEditPrice24h(String(room.price24hWithoutBreakfast));
    setEditNameRu(room.name.ru);
    setEditIsActive(room.isActive);
  };

  const saveRoomEdits = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    const parsed12h = editPrice12h.trim() === '' ? null : parseInt(editPrice12h, 10);
    const parsed24h = parseInt(editPrice24h, 10) || 5000;

    updateRoom({
      ...room,
      name: {
        ...room.name,
        ru: editNameRu.trim() || room.name.ru,
      },
      price12h: isNaN(parsed12h as number) ? null : parsed12h,
      price24hWithoutBreakfast: parsed24h,
      price24hWithBreakfast: parsed24h,
      isActive: editIsActive,
    });

    setEditingRoomId(null);
  };

  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);

    const startObj = combineDateAndTime(manualDate, manualTime);
    const endObj = calculateCheckOutDateTime(startObj, manualDuration);

    const check = isRoomAvailable(manualRoomId, startObj, manualDuration, bookings, undefined, settings.cleaningBufferMinutes);
    if (!check.available) {
      setManualError(t.errorOverlapNotice);
      return;
    }

    const room = rooms.find((r) => r.id === manualRoomId);
    if (!room) return;

    let price = manualDuration === '12h' 
      ? (room.price12h || 2800) 
      : room.price24hWithoutBreakfast;

    addBooking({
      referenceCode: generateReferenceCode(),
      roomId: room.id,
      roomNumber: room.roomNumber,
      guestName: manualGuestName.trim(),
      guestPhone: manualGuestPhone.trim(),
      checkInDateTime: startObj.toISOString(),
      duration: manualDuration,
      checkOutDateTime: endObj.toISOString(),
      hasBreakfast: manualBreakfast,
      breakfastGuestCount: manualBreakfast ? manualBreakfastCount : undefined,
      totalPriceKGS: price,
      status: 'confirmed',
      notes: `[Manual Admin Entry] ${manualNotes.trim()}`,
      paymentMethod: 'cash',
    });

    setShowManualBookingModal(false);
    setManualGuestName('');
    setManualGuestPhone('+996 ');
    setManualBreakfast(false);
    setManualBreakfastCount(1);
    setManualNotes('');
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilterStatus !== 'all' && b.status !== bookingFilterStatus) return false;
    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      return (
        b.guestName.toLowerCase().includes(q) ||
        b.guestPhone.includes(q) ||
        b.referenceCode.toLowerCase().includes(q) ||
        String(b.roomNumber).includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E0E0E0] pb-20">
      {/* Top Admin Header */}
      <div className="bg-[#14161C] border-b border-[#252936] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[#FAF8F5] tracking-tight font-display">
                  {t.adminDashboardTitle}
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 uppercase font-sans">
                  Live Mode
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] font-sans">
                {language === 'ky' 
                  ? 'Бөлмөлөрдүн бааларын, 8-11 бөлмөлөрдү жана брондоолорду кодсуз башкарыңыз' 
                  : language === 'ru' 
                  ? 'Управление 11 номерами, гибкая настройка цен 8–11 номеров и контроль броней' 
                  : 'Manage 11 rooms, dynamic pricing for rooms 8–11, and collision-free reservations'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1F222A] hover:bg-[#252936] text-[#FAF8F5] border border-[#252936] flex items-center gap-1.5 transition-colors font-sans"
            >
              <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{t.guestMode}</span>
            </button>
            <button
              onClick={resetToDefaults}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/60 transition-colors"
              title="Reset state to initial seed data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        {/* Navigation Tabs for Admin */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#252936] pb-4 mb-6">
          {[
            { id: 'rooms', label: t.adminRoomsTab, icon: BedDouble },
            { id: 'bookings', label: `${t.adminBookingsTab} (${bookings.length})`, icon: Calendar },
            { id: 'reviews', label: `${t.adminReviewsTab} (${reviews.length})`, icon: Star },
            { id: 'gallery', label: `${t.adminGalleryTab} (${gallery.length})`, icon: ImageIcon },
            { id: 'settings', label: t.adminSettingsTab, icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all font-sans ${
                  activeAdminTab === tab.id
                    ? 'bg-[#C5A059] text-[#0F1115] shadow-md'
                    : 'bg-[#14161C] text-[#9CA3AF] hover:text-[#FAF8F5] hover:bg-[#1F222A] border border-[#252936]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ROOMS MANAGEMENT & DYNAMIC PRICING */}
        {activeAdminTab === 'rooms' && (
          <div className="space-y-6">
            {/* Special Highlight for Rooms 8-11 */}
            <div className="bg-[#14161C] border border-[#C5A059]/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-[#FAF8F5] font-display">
                    {language === 'ky' ? '8–11 бөлмөлөрдүн баасын коюу' : language === 'ru' ? 'Настройка цен для номеров №8–11' : 'Dynamic Pricing for Rooms №8–11'}
                  </h3>
                  <p className="text-xs text-[#9CA3AF] mt-0.5 font-sans">
                    {t.specialNoticeRooms8to11}
                  </p>
                </div>
              </div>
            </div>

            {/* Rooms Table */}
            <div className="bg-[#14161C] border border-[#252936] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0F1115] text-[#9CA3AF] uppercase tracking-wider border-b border-[#252936] font-sans">
                    <tr>
                      <th className="p-4">{t.roomColNumber}</th>
                      <th className="p-4">{t.roomColName}</th>
                      <th className="p-4">{t.roomColType}</th>
                      <th className="p-4">{t.roomCol12hPrice}</th>
                      <th className="p-4">{t.roomCol24hPrice}</th>
                      <th className="p-4">{t.roomColStatus}</th>
                      <th className="p-4 text-right">{t.roomColActions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#252936] text-[#E0E0E0]">
                    {rooms.map((room) => {
                      const isEditing = editingRoomId === room.id;
                      const isSpecial8to11 = room.roomNumber >= 8;

                      return (
                        <tr
                          key={room.id}
                          className={`hover:bg-[#1F222A]/50 transition-colors ${
                            isSpecial8to11 ? 'bg-[#C5A059]/5' : ''
                          }`}
                        >
                          <td className="p-4 font-mono font-bold text-[#C5A059]">
                            № {room.roomNumber}
                          </td>
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editNameRu}
                                onChange={(e) => setEditNameRu(e.target.value)}
                                className="bg-[#0F1115] border border-[#252936] rounded-lg px-2 py-1 text-xs text-[#FAF8F5] w-48 focus:outline-none focus:border-[#C5A059]"
                              />
                            ) : (
                              <div>
                                <span className="font-bold text-[#FAF8F5] block font-display">{room.name[language] || room.name.ru}</span>
                                <span className="text-[11px] text-[#9CA3AF] font-sans">{room.sizeM2} m² • {room.capacity} {t.roomCardGuests}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-[#0F1115] border border-[#252936] text-[#9CA3AF] font-medium font-sans">
                              {room.type}
                            </span>
                          </td>
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editPrice12h}
                                onChange={(e) => setEditPrice12h(e.target.value)}
                                placeholder="TBD"
                                className="bg-[#0F1115] border border-[#252936] rounded-lg px-2 py-1 text-xs text-[#C5A059] font-mono w-28 focus:outline-none focus:border-[#C5A059]"
                              />
                            ) : (
                              <span
                                className={`font-bold font-mono ${
                                  room.price12h !== null
                                    ? 'text-[#C5A059]'
                                    : 'text-[#6B7280] italic'
                                }`}
                              >
                                {room.price12h !== null
                                  ? `${room.price12h.toLocaleString()} сом`
                                  : t.priceTBD}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editPrice24h}
                                onChange={(e) => setEditPrice24h(e.target.value)}
                                className="bg-[#0F1115] border border-[#252936] rounded-lg px-2 py-1 text-xs text-emerald-400 font-mono w-28 focus:outline-none focus:border-[#C5A059]"
                              />
                            ) : (
                              <span className="font-bold font-mono text-emerald-400">
                                {room.price24hWithoutBreakfast.toLocaleString()} сом
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {isEditing ? (
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editIsActive}
                                  onChange={(e) => setEditIsActive(e.target.checked)}
                                  className="rounded border-[#252936] text-[#C5A059]"
                                />
                                <span className="text-xs">{editIsActive ? t.statusActive : t.statusInactive}</span>
                              </label>
                            ) : (
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  room.isActive
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-red-500/20 text-red-300'
                                }`}
                              >
                                {room.isActive ? t.statusActive : t.statusInactive}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => saveRoomEdits(room.id)}
                                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                                  title={t.saveRoomBtn}
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingRoomId(null)}
                                  className="p-1.5 rounded-lg bg-[#1F222A] hover:bg-[#252936] text-[#9CA3AF] hover:text-[#FAF8F5]"
                                  title={t.cancelBtn}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEditRoom(room)}
                                className="px-3 py-1.5 rounded-lg bg-[#1F222A] hover:bg-[#252936] text-[#FAF8F5] font-medium transition-colors flex items-center gap-1 ml-auto border border-[#252936]"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#C5A059]" />
                                <span>{t.editRoomBtn}</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS SCHEDULE & MANUAL BOOKING */}
        {activeAdminTab === 'bookings' && (
          <div className="space-y-6">
            {/* Action & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#14161C] p-4 rounded-2xl border border-[#252936]">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search guest or code..."
                    className="w-full bg-[#0F1115] border border-[#252936] rounded-xl pl-9 pr-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <select
                  value={bookingFilterStatus}
                  onChange={(e) => setBookingFilterStatus(e.target.value)}
                  className="bg-[#0F1115] border border-[#252936] rounded-xl px-3 py-2 text-xs text-[#FAF8F5] focus:outline-none"
                >
                  <option value="all">{t.filterAllBookings}</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked_in">Checked In</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">{t.filterCancelledBookings}</option>
                </select>
              </div>

              <button
                onClick={() => setShowManualBookingModal(true)}
                className="px-4 py-2.5 rounded-xl font-semibold gold-gradient-btn text-xs flex items-center justify-center gap-1.5 transition-all shadow"
              >
                <Plus className="w-4 h-4 text-[#0F1115]" />
                <span>{t.addManualBookingBtn}</span>
              </button>
            </div>

            {/* Bookings Table */}
            <div className="bg-[#14161C] border border-[#252936] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0F1115] text-[#9CA3AF] uppercase tracking-wider border-b border-[#252936] font-sans">
                    <tr>
                      <th className="p-4">{t.bookingColRef}</th>
                      <th className="p-4">{t.bookingColGuest}</th>
                      <th className="p-4">{t.bookingColRoom}</th>
                      <th className="p-4">{t.bookingColCheckIn}</th>
                      <th className="p-4">{t.bookingColCheckOut}</th>
                      <th className="p-4">{t.bookingColDuration}</th>
                      <th className="p-4">{t.summaryBreakfast}</th>
                      <th className="p-4">{t.bookingColTotal}</th>
                      <th className="p-4">{t.bookingColStatus}</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#252936] text-[#E0E0E0]">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-[#6B7280]">
                          No bookings found.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#1F222A]/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-[#C5A059]">
                            {b.referenceCode}
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-[#FAF8F5]">{b.guestName}</div>
                            <div className="text-[11px] text-[#9CA3AF] font-mono">{b.guestPhone}</div>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-[#FAF8F5]">№ {b.roomNumber}</span>
                          </td>
                          <td className="p-4 font-mono text-[#E0E0E0]">
                            {formatDateTime(new Date(b.checkInDateTime), language)}
                          </td>
                          <td className="p-4 font-mono text-emerald-400 font-medium">
                            {formatDateTime(new Date(b.checkOutDateTime), language)}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-[#0F1115] border border-[#252936] text-[#9CA3AF] font-semibold">
                              {b.duration}
                            </span>
                          </td>
                          <td className="p-4">
                            {b.hasBreakfast ? (
                              <span className="px-2 py-1 rounded bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] text-[11px] font-semibold inline-flex items-center gap-1">
                                🍳 {b.breakfastGuestCount || 1} {language === 'ky' ? 'адам' : language === 'ru' ? 'чел.' : 'guests'}
                              </span>
                            ) : (
                              <span className="text-[#6B7280] text-[11px]">—</span>
                            )}
                          </td>
                          <td className="p-4 font-bold font-mono text-[#C5A059]">
                            {b.totalPriceKGS.toLocaleString()} сом
                          </td>
                          <td className="p-4">
                            <select
                              value={b.status}
                              onChange={(e) => updateBookingStatus(b.id, e.target.value as any)}
                              className="bg-[#0F1115] border border-[#252936] rounded px-2 py-1 text-xs text-[#FAF8F5] focus:outline-none"
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="checked_in">Checked In</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => deleteBooking(b.id)}
                              className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                              title="Delete booking"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REVIEWS MODERATION */}
        {activeAdminTab === 'reviews' && (
          <div className="space-y-4">
            <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-[#FAF8F5] font-display">
                Guest Reviews Moderation Queue
              </h3>

              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-[#0F1115] border border-[#252936] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-[#FAF8F5] text-sm font-display">{rev.guestName}</strong>
                        <span className="text-xs text-[#9CA3AF]">({rev.guestLocation})</span>
                        <div className="flex items-center text-[#C5A059] ml-2">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#C5A059]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#E0E0E0] italic font-sans">
                        "{rev.comment.ru || rev.comment.en || rev.comment.ky}"
                      </p>
                      <span className="text-[10px] text-[#6B7280]">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          rev.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-[#C5A059]/20 text-[#C5A059]'
                        }`}
                      >
                        {rev.status}
                      </span>
                      <button
                        onClick={() =>
                          updateReviewStatus(
                            rev.id,
                            rev.status === 'approved' ? 'pending' : 'approved'
                          )
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1F222A] hover:bg-[#252936] text-[#FAF8F5] transition-colors border border-[#252936]"
                      >
                        {rev.status === 'approved' ? 'Unpublish' : 'Approve'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GALLERY MANAGEMENT */}
        {activeAdminTab === 'gallery' && (
          <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#FAF8F5] font-display">
              Gallery Media Placeholders ({gallery.length} Photos)
            </h3>
            <p className="text-xs text-[#9CA3AF] font-sans">
              All images can be swapped with real high-resolution photos in the cloud database.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              {gallery.map((item) => (
                <div key={item.id} className="relative rounded-xl overflow-hidden bg-[#0F1115] border border-[#252936]">
                  <img
                    src={item.image}
                    alt={item.title.ru}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2.5 bg-[#0F1115] text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#C5A059] block font-sans">{item.category}</span>
                    <strong className="text-[#FAF8F5] truncate block font-display">{item.title.ru}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: HOTEL SETTINGS */}
        {activeAdminTab === 'settings' && (
          <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-6 shadow-xl space-y-6 max-w-2xl">
            <h3 className="text-base font-bold text-[#FAF8F5] flex items-center gap-2 font-display">
              <SettingsIcon className="w-5 h-5 text-[#C5A059]" />
              <span>General Hotel Settings</span>
            </h3>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#E0E0E0] font-medium mb-1">
                  Primary Phone Number
                </label>
                <input
                  type="text"
                  value={settings.phones[0]}
                  onChange={(e) =>
                    updateSettings({ phones: [e.target.value, settings.phones[1]] })
                  }
                  className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-3.5 py-2.5 text-[#FAF8F5] font-mono focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[#E0E0E0] font-medium mb-1">
                  Secondary Phone Number
                </label>
                <input
                  type="text"
                  value={settings.phones[1]}
                  onChange={(e) =>
                    updateSettings({ phones: [settings.phones[0], e.target.value] })
                  }
                  className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-3.5 py-2.5 text-[#FAF8F5] font-mono focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[#E0E0E0] font-medium mb-1">
                  Cleaning Buffer Between Stays (Minutes)
                </label>
                <input
                  type="number"
                  value={settings.cleaningBufferMinutes}
                  onChange={(e) =>
                    updateSettings({ cleaningBufferMinutes: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-3.5 py-2.5 text-[#FAF8F5] font-mono focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Manual Booking Modal */}
        {showManualBookingModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#14161C] border border-[#252936] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[#252936] pb-3">
                <h3 className="font-bold text-[#FAF8F5] text-base font-display">
                  {t.addManualBookingBtn}
                </h3>
                <button
                  onClick={() => setShowManualBookingModal(false)}
                  className="text-[#9CA3AF] hover:text-[#FAF8F5]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {manualError && (
                <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-xs text-red-200 font-sans">
                  {manualError}
                </div>
              )}

              <form onSubmit={handleCreateManualBooking} className="space-y-3 text-xs font-sans">
                <div>
                  <label className="block text-[#E0E0E0] mb-1">Guest Name *</label>
                  <input
                    type="text"
                    required
                    value={manualGuestName}
                    onChange={(e) => setManualGuestName(e.target.value)}
                    className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-3 py-2 text-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-[#E0E0E0] mb-1">Guest Phone *</label>
                  <input
                    type="tel"
                    required
                    value={manualGuestPhone}
                    onChange={(e) => setManualGuestPhone(e.target.value)}
                    className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-3 py-2 text-[#FAF8F5] font-mono focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#E0E0E0] mb-1">Date</label>
                    <input
                      type="date"
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-3 py-2 text-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#E0E0E0] mb-1">Time</label>
                    <input
                      type="time"
                      value={manualTime}
                      onChange={(e) => setManualTime(e.target.value)}
                      className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-3 py-2 text-[#FAF8F5] font-mono focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#E0E0E0] mb-1">Duration</label>
                    <select
                      value={manualDuration}
                      onChange={(e) => setManualDuration(e.target.value as any)}
                      className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-3 py-2 text-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="12h">12 Hours</option>
                      <option value="24h">24 Hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#E0E0E0] mb-1">Room</label>
                    <select
                      value={manualRoomId}
                      onChange={(e) => setManualRoomId(e.target.value)}
                      className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-3 py-2 text-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                    >
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          №{r.roomNumber} - {r.name.ru}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-[#0F1115] rounded-xl border border-[#252936] space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={manualBreakfast}
                      onChange={(e) => setManualBreakfast(e.target.checked)}
                      className="rounded border-[#252936] text-[#C5A059] focus:ring-[#C5A059]"
                    />
                    <span className="text-[#FAF8F5] font-semibold">
                      🍳 {language === 'ky' ? 'Эртең мененки тамак (Заказ боюнча)' : language === 'ru' ? 'Завтрак (Под заказ)' : 'Breakfast (On request)'}
                    </span>
                  </label>

                  {manualBreakfast && (
                    <div className="pl-6 flex items-center gap-3">
                      <label className="text-[#9CA3AF]">
                        {language === 'ky' ? 'Канча адамга?' : language === 'ru' ? 'Количество человек:' : 'Number of guests:'}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={manualBreakfastCount}
                        onChange={(e) => setManualBreakfastCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-20 bg-[#14161C] border border-[#252936] rounded-lg px-2 py-1 text-[#FAF8F5] font-mono text-center focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowManualBookingModal(false)}
                    className="px-4 py-2 rounded-xl text-[#9CA3AF] hover:text-[#FAF8F5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-semibold gold-gradient-btn"
                  >
                    Add Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
