import React, { useState, useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { StayDuration, Room, Booking } from '../types';
import { 
  calculateCheckOutDateTime, 
  combineDateAndTime, 
  isRoomAvailable, 
  calculateStayPrice, 
  generateReferenceCode, 
  formatDateTime, 
  formatCurrency 
} from '../utils/bookingLogic';
import { 
  Calendar, 
  Clock, 
  BedDouble, 
  User, 
  Phone, 
  Coffee, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Printer, 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft,
  DollarSign,
  Info
} from 'lucide-react';

export const BookingWizard: React.FC = () => {
  const { 
    rooms, 
    bookings, 
    addBooking, 
    addBookingAsync,
    language, 
    t, 
    settings, 
    selectedRoomForBooking, 
    setSelectedRoomForBooking,
    quickBookingParams,
    setQuickBookingParams
  } = useHotel();

  // Wizard Steps: 1 (Time & Duration) -> 2 (Room & Breakfast) -> 3 (Guest Info) -> 4 (Confirmation & Voucher)
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const defaultDate = new Date().toISOString().split('T')[0];
  const [checkInDate, setCheckInDate] = useState<string>(defaultDate);
  const [checkInTime, setCheckInTime] = useState<string>('18:00');
  const [duration, setDuration] = useState<StayDuration>('12h');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [hasBreakfast, setHasBreakfast] = useState<boolean>(false);
  const [breakfastGuestCount, setBreakfastGuestCount] = useState<number>(1);
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('+996 ');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mbank' | 'optima' | 'card'>('cash');
  const [notes, setNotes] = useState<string>('');

  // Result state
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // If quickBookingParams was set from Hero
  useEffect(() => {
    if (quickBookingParams) {
      setCheckInDate(quickBookingParams.date);
      setCheckInTime(quickBookingParams.time);
      setDuration(quickBookingParams.duration);
      setQuickBookingParams(null);
    }
  }, [quickBookingParams, setQuickBookingParams]);

  // If a room was pre-selected from rooms section, sync it
  useEffect(() => {
    if (selectedRoomForBooking) {
      setSelectedRoomId(selectedRoomForBooking.id);
    } else if (rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [selectedRoomForBooking, rooms]);

  // Derived calculation
  const checkInDateObj = combineDateAndTime(checkInDate, checkInTime);
  const checkOutDateObj = calculateCheckOutDateTime(checkInDateObj, duration);

  const currentSelectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  // Live availability check for current selected room
  const availabilityCheck = currentSelectedRoom
    ? isRoomAvailable(currentSelectedRoom.id, checkInDateObj, duration, bookings, undefined, settings.cleaningBufferMinutes)
    : { available: true };

  // Price Calculation
  const priceInfo = currentSelectedRoom
    ? calculateStayPrice(
        currentSelectedRoom,
        duration,
        duration === '24h' ? hasBreakfast : false,
        settings.defaultBreakfastPriceKGS,
        settings.default24hBasePriceKGS
      )
    : { totalPrice: 0, isPriceDetermined: true, priceBreakdown: '' };

  const handleNextStep1 = () => {
    setFormError(null);
    if (!checkInDate || !checkInTime) {
      setFormError(t.errorFillFields);
      return;
    }

    // If selected check-in date is today, verify time has not already passed
    const now = new Date();
    const todayFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (checkInDate === todayFormatted) {
      const [hStr, mStr] = checkInTime.split(':');
      const inH = parseInt(hStr, 10);
      const inM = parseInt(mStr, 10);
      const selectedDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), inH, inM);
      // Grace period of 2 minutes
      if (selectedDateTime.getTime() < now.getTime() - 2 * 60 * 1000) {
        setFormError(t.timePastError);
        return;
      }
    }

    setStep(2);
  };

  const handleNextStep2 = () => {
    setFormError(null);
    if (!selectedRoomId) {
      setFormError(language === 'ky' ? 'Сураныч, бөлмөнү тандаңыз' : language === 'ru' ? 'Пожалуйста, выберите номер' : 'Please select a room');
      return;
    }

    // Check collision for step 2 room
    const check = isRoomAvailable(selectedRoomId, checkInDateObj, duration, bookings, undefined, settings.cleaningBufferMinutes);
    if (!check.available) {
      setFormError(t.errorOverlapNotice);
      return;
    }

    setStep(3);
  };

  const handleNextStep3 = async () => {
    setFormError(null);
    if (!guestName.trim()) {
      setFormError(language === 'ky' ? 'Аты-жөнүңүздү жазыңыз' : language === 'ru' ? 'Укажите Ф.И.О. гостя' : 'Please enter guest name');
      return;
    }
    if (guestPhone.trim().length < 9) {
      setFormError(language === 'ky' ? 'Телефон номерин толук жазыңыз' : language === 'ru' ? 'Укажите корректный номер телефона' : 'Please enter a valid phone number');
      return;
    }

    // Final collision verification check before booking
    const check = isRoomAvailable(selectedRoomId, checkInDateObj, duration, bookings, undefined, settings.cleaningBufferMinutes);
    if (!check.available) {
      setFormError(t.errorOverlapNotice);
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      // Create booking in Supabase / State
      const result = await addBookingAsync({
        referenceCode: generateReferenceCode(),
        roomId: currentSelectedRoom.id,
        roomNumber: currentSelectedRoom.roomNumber,
        guestName: guestName.trim(),
        guestPhone: guestPhone.trim(),
        checkInDateTime: checkInDateObj.toISOString(),
        duration: duration,
        checkOutDateTime: checkOutDateObj.toISOString(),
        hasBreakfast: hasBreakfast,
        breakfastGuestCount: hasBreakfast ? breakfastGuestCount : undefined,
        totalPriceKGS: priceInfo.totalPrice || 0,
        status: 'confirmed',
        notes: notes.trim(),
        paymentMethod: paymentMethod,
      });

      if (result.success && result.booking) {
        setConfirmedBooking(result.booking);
        setStep(4);
      } else {
        setFormError(result.error || t.errorOverlapNotice);
        setStep(2);
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setFormError(t.errorOverlapNotice);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetBooking = () => {
    setStep(1);
    setConfirmedBooking(null);
    setGuestName('');
    setGuestPhone('+996 ');
    setHasBreakfast(false);
    setBreakfastGuestCount(1);
    setNotes('');
    setSelectedRoomForBooking(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppContact = () => {
    if (!confirmedBooking) return;

    const breakfastText = confirmedBooking.hasBreakfast
      ? (language === 'ky'
          ? `Ооба (${confirmedBooking.breakfastGuestCount || 1} адамга) - Заказ боюнча даярдалат`
          : language === 'ru'
          ? `Да (${confirmedBooking.breakfastGuestCount || 1} чел.) - Под заказ`
          : `Yes (${confirmedBooking.breakfastGuestCount || 1} guests) - Prepared on request`)
      : (language === 'ky' ? 'Жок' : language === 'ru' ? 'Нет' : 'No');

    let text = '';
    if (language === 'ky') {
      text = encodeURIComponent(
        `Саламатсызбы! Мен Bishkek Hotel отелинен №${confirmedBooking.roomNumber} бөлмөнү брондодум.\n` +
        `Брондоо коду: ${confirmedBooking.referenceCode}\n` +
        `Конок: ${confirmedBooking.guestName}\n` +
        `Телефон: ${confirmedBooking.guestPhone}\n` +
        `Келүү: ${formatDateTime(new Date(confirmedBooking.checkInDateTime), 'ky')}\n` +
        `Чыгуу: ${formatDateTime(new Date(confirmedBooking.checkOutDateTime), 'ky')}\n` +
        `Мөөнөтү: ${confirmedBooking.duration}\n` +
        `Эртең мененки тамак: ${breakfastText}\n` +
        `Суммасы: ${confirmedBooking.totalPriceKGS} сом`
      );
    } else if (language === 'en') {
      text = encodeURIComponent(
        `Hello! I booked Room №${confirmedBooking.roomNumber} at Bishkek Hotel.\n` +
        `Booking Code: ${confirmedBooking.referenceCode}\n` +
        `Guest: ${confirmedBooking.guestName}\n` +
        `Phone: ${confirmedBooking.guestPhone}\n` +
        `Check-in: ${formatDateTime(new Date(confirmedBooking.checkInDateTime), 'en')}\n` +
        `Checkout: ${formatDateTime(new Date(confirmedBooking.checkOutDateTime), 'en')}\n` +
        `Duration: ${confirmedBooking.duration}\n` +
        `Breakfast: ${breakfastText}\n` +
        `Total: ${confirmedBooking.totalPriceKGS} KGS`
      );
    } else {
      text = encodeURIComponent(
        `Здравствуйте! Я забронировал номер №${confirmedBooking.roomNumber} в Bishkek Hotel.\n` +
        `Код брони: ${confirmedBooking.referenceCode}\n` +
        `Гость: ${confirmedBooking.guestName}\n` +
        `Телефон: ${confirmedBooking.guestPhone}\n` +
        `Заезд: ${formatDateTime(new Date(confirmedBooking.checkInDateTime), 'ru')}\n` +
        `Выезд: ${formatDateTime(new Date(confirmedBooking.checkOutDateTime), 'ru')}\n` +
        `Длительность: ${confirmedBooking.duration}\n` +
        `Завтрак: ${breakfastText}\n` +
        `Сумма: ${confirmedBooking.totalPriceKGS} сом`
      );
    }

    window.open(`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <section id="booking" className="py-20 bg-[#0F1115] text-[#E0E0E0] min-h-[80vh] relative border-b border-[#252936]">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-xs font-semibold uppercase tracking-widest mb-2 border border-[#C5A059]/25 font-sans">
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{t.bookingTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#FAF8F5] font-display">
            {t.bookingTitle}
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-2 font-sans">
            {t.bookingSubtitle}
          </p>
        </div>

        {/* Step Indicator Bar */}
        {step < 4 && (
          <div className="grid grid-cols-3 gap-2 mb-8 bg-[#14161C] p-2 rounded-2xl border border-[#252936]">
            <div
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                step === 1 ? 'bg-[#C5A059] text-[#0F1115] font-bold shadow' : step > 1 ? 'text-[#C5A059] bg-[#1F222A]' : 'text-[#9CA3AF]/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{t.step1Title}</span>
            </div>
            <div
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                step === 2 ? 'bg-[#C5A059] text-[#0F1115] font-bold shadow' : step > 2 ? 'text-[#C5A059] bg-[#1F222A]' : 'text-[#9CA3AF]/60'
              }`}
            >
              <BedDouble className="w-4 h-4" />
              <span>{t.step2Title}</span>
            </div>
            <div
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                step === 3 ? 'bg-[#C5A059] text-[#0F1115] font-bold shadow' : 'text-[#9CA3AF]/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t.step3Title}</span>
            </div>
          </div>
        )}

        {/* Form Error Alert */}
        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Main Wizard Card */}
        <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-6 sm:p-8 shadow-2xl">
          
          {/* STEP 1: Date, Time and Duration */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#252936] pb-4">
                <h3 className="text-xl font-bold text-[#FAF8F5] flex items-center gap-2 font-display">
                  <Clock className="w-5 h-5 text-[#C5A059]" />
                  <span>{t.step1Title}</span>
                </h3>
                <p className="text-xs text-[#9CA3AF] mt-1 font-sans">
                  {language === 'ky' 
                    ? 'Келүү убактысын тандаңыз, чыгуу убактысы автоматтык эсептелет.' 
                    : language === 'ru' 
                    ? 'Укажите точное время вашего заезда. Расчет выезда происходит без привязки к 12:00.' 
                    : 'Specify your exact check-in time. Checkout is calculated relative to arrival.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-[#FAF8F5] mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{t.selectCheckInDate}</span>
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    min={defaultDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-4 py-3 text-sm text-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-semibold text-[#FAF8F5] mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{t.selectCheckInTime}</span>
                  </label>
                  <input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-4 py-3 text-sm text-[#FAF8F5] focus:outline-none focus:border-[#C5A059] font-mono text-base"
                  />
                </div>
              </div>

              {/* Duration Choice */}
              <div>
                <label className="block text-xs font-semibold text-[#FAF8F5] mb-2">
                  {t.selectDuration}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDuration('12h')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      duration === '12h'
                        ? 'bg-[#C5A059]/15 border-[#C5A059] text-white shadow-md'
                        : 'bg-[#0F1115] border-[#252936] text-[#9CA3AF] hover:border-[#333846]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-[#C5A059]">{t.duration12hOption}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#C5A059] font-semibold">
                        2 500 – 2 800 KGS
                      </span>
                    </div>
                    <p className="text-xs text-[#9CA3AF]">
                      {language === 'ky' ? 'Келген убакыттан так 12 саат' : language === 'ru' ? 'Ровно 12 часов с момента заезда' : 'Exactly 12 hours from check-in'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDuration('24h')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      duration === '24h'
                        ? 'bg-[#C5A059]/15 border-[#C5A059] text-white shadow-md'
                        : 'bg-[#0F1115] border-[#252936] text-[#9CA3AF] hover:border-[#333846]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-[#FAF8F5]">{t.duration24hOption}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[#1F222A] text-[#E0E0E0] font-semibold border border-[#252936]">
                        5 000 KGS
                      </span>
                    </div>
                    <p className="text-xs text-[#9CA3AF]">
                      {language === 'ky' ? 'Так 24 сааттык толук эс алуу' : language === 'ru' ? 'Полные 24 часа комфортного отдыха' : 'Full 24-hour restful stay'}
                    </p>
                  </button>
                </div>
              </div>

              {/* Real-time Calculated Checkout Summary Box */}
              <div className="bg-[#0F1115] rounded-xl p-4 border border-[#C5A059]/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9CA3AF]">{language === 'ky' ? 'Келүү убактысы:' : language === 'ru' ? 'Время заезда:' : 'Check-in:'}</span>
                  <span className="font-semibold text-[#FAF8F5] font-mono">{formatDateTime(checkInDateObj, language)}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-[#252936] pt-2 text-[#C5A059]">
                  <span className="font-bold flex items-center gap-1.5 text-[#E0E0E0]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                    {t.calculatedCheckOutNotice}
                  </span>
                  <span className="font-bold font-mono text-sm text-[#C5A059]">{formatDateTime(checkOutDateObj, language)}</span>
                </div>
              </div>

              {/* Next Step Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="px-6 py-3 rounded-xl font-bold gold-gradient-btn shadow-md transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>{t.nextBtn}: {t.step2Title}</span>
                  <ArrowRight className="w-4 h-4 text-[#0F1115]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Room Selection & Breakfast Choice */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#252936] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-[#FAF8F5] flex items-center gap-2 font-display">
                    <BedDouble className="w-5 h-5 text-[#C5A059]" />
                    <span>{t.step2Title}</span>
                  </h3>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    {formatDateTime(checkInDateObj, language)} → {formatDateTime(checkOutDateObj, language)} ({duration})
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-[#1F222A] border border-[#252936] text-[#C5A059] font-semibold self-start sm:self-auto">
                  {duration === '12h' ? '12 Hours' : '24 Hours'}
                </span>
              </div>

              {/* Room Grid Selector with Live Overlap Detection */}
              <div>
                <label className="block text-xs font-semibold text-[#FAF8F5] mb-3">
                  {t.availableRoomsTitle}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                  {rooms.map((room) => {
                    const status = isRoomAvailable(room.id, checkInDateObj, duration, bookings, undefined, settings.cleaningBufferMinutes);
                    const isSelected = selectedRoomId === room.id;
                    const rPrice = calculateStayPrice(
                      room,
                      duration,
                      false,
                      settings.defaultBreakfastPriceKGS,
                      settings.default24hBasePriceKGS
                    );

                    return (
                      <button
                        key={room.id}
                        type="button"
                        disabled={!status.available}
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all relative ${
                          !status.available
                            ? 'bg-[#0F1115]/50 border-red-900/30 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#C5A059]/15 border-[#C5A059] shadow-md ring-1 ring-[#C5A059]'
                            : 'bg-[#0F1115] border-[#252936] hover:border-[#333846]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-sm text-[#FAF8F5]">
                              {room.name[language]}
                            </div>
                            <div className="text-xs text-[#9CA3AF] mt-0.5">
                              {room.price12h 
                                ? (language === 'ky' ? `12с: ${formatCurrency(room.price12h, language)}` : language === 'ru' ? `12ч: ${formatCurrency(room.price12h, language)}` : `12h: ${formatCurrency(room.price12h, language)}`)
                                : (language === 'ky' ? '12с: Баасы такталууда' : language === 'ru' ? '12ч: Цена уточняется' : '12h: Price TBD')
                              }
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-[#C5A059] text-xs block">
                              {rPrice.totalPrice ? formatCurrency(rPrice.totalPrice, language) : t.priceTBD}
                            </span>
                            {status.available ? (
                              <span className="text-[10px] text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                                <CheckCircle2 className="w-3 h-3" />
                                {language === 'ky' ? 'Бош' : language === 'ru' ? 'Свободен' : 'Available'}
                              </span>
                            ) : (
                              <span className="text-[10px] text-red-400 font-medium mt-0.5 block">
                                {language === 'ky' ? 'Ээленген' : language === 'ru' ? 'Занят' : 'Booked'}
                              </span>
                            )}
                          </div>
                        </div>

                        {!status.available && status.conflictingBooking && (
                          <div className="mt-2 text-[10px] text-red-300 bg-red-950/60 p-1.5 rounded border border-red-900/50">
                            {language === 'ky' ? 'Кагылышуу: ' : language === 'ru' ? 'Занят: ' : 'Collision: '}
                            {formatDateTime(new Date(status.conflictingBooking.checkInDateTime), language)} - {formatDateTime(new Date(status.conflictingBooking.checkOutDateTime), language)}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Breakfast Selection Section */}
              <div className="bg-[#0F1115] p-5 rounded-2xl border border-[#252936] space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-[#FAF8F5] font-display">
                      <Coffee className="w-4 h-4 text-[#C5A059]" />
                      <span>{t.breakfastQuestion}</span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-1 font-sans">
                      {t.advBreakfastLongDesc}
                    </p>
                    <p className="text-[11px] text-[#C5A059] font-medium mt-0.5 font-sans">
                      {t.advBreakfastPriceNote}
                    </p>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#1F222A] text-[#C5A059] border border-[#252936] font-semibold shrink-0">
                    {t.advBreakfastDesc}
                  </span>
                </div>

                {/* Breakfast Options Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setHasBreakfast(true)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      hasBreakfast
                        ? 'bg-[#C5A059]/15 border-[#C5A059] text-[#FAF8F5] shadow-md ring-1 ring-[#C5A059]'
                        : 'bg-[#14161C] border-[#252936] text-[#9CA3AF] hover:border-[#333846]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        hasBreakfast ? 'border-[#C5A059] bg-[#C5A059] text-[#0F1115]' : 'border-[#9CA3AF]/40'
                      }`}>
                        {hasBreakfast && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <span className="text-xs font-bold text-[#FAF8F5]">{t.breakfastOptionYes}</span>
                    </div>
                    <span className="text-[11px] text-[#C5A059] font-semibold">
                      {language === 'ky' ? 'Заказ боюнча' : language === 'ru' ? 'Под заказ' : 'On request'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHasBreakfast(false)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      !hasBreakfast
                        ? 'bg-[#1F222A] border-[#C5A059]/50 text-[#FAF8F5]'
                        : 'bg-[#14161C] border-[#252936] text-[#9CA3AF] hover:border-[#333846]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        !hasBreakfast ? 'border-[#C5A059] bg-[#C5A059] text-[#0F1115]' : 'border-[#9CA3AF]/40'
                      }`}>
                        {!hasBreakfast && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <span className="text-xs font-semibold text-[#E0E0E0]">{t.breakfastOptionNo}</span>
                    </div>
                  </button>
                </div>

                {/* Additional Guest Count selector when Breakfast is requested */}
                {hasBreakfast && (
                  <div className="pt-3 border-t border-[#252936] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div>
                      <label className="block text-xs font-bold text-[#FAF8F5] mb-0.5">
                        {t.breakfastPeopleQuestion}
                      </label>
                      <p className="text-[11px] text-[#9CA3AF]">
                        {language === 'ky' 
                          ? 'Эртең мененки тамак даярдала турган коноктордун саны' 
                          : language === 'ru' 
                          ? 'Количество персон для приготовления свежего завтрака' 
                          : 'Number of guests for freshly prepared breakfast'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto bg-[#14161C] p-1.5 rounded-xl border border-[#252936]">
                      <button
                        type="button"
                        onClick={() => setBreakfastGuestCount(Math.max(1, breakfastGuestCount - 1))}
                        disabled={breakfastGuestCount <= 1}
                        className="w-8 h-8 rounded-lg bg-[#1F222A] hover:bg-[#262A35] disabled:opacity-40 disabled:cursor-not-allowed text-[#FAF8F5] flex items-center justify-center font-bold text-sm transition-colors"
                        aria-label="Decrease guests"
                      >
                        -
                      </button>

                      <div className="px-3 text-center">
                        <span className="text-sm font-bold text-[#C5A059] font-mono">
                          {breakfastGuestCount}
                        </span>
                        <span className="text-[10px] text-[#9CA3AF] block">
                          {t.breakfastPersonSuffix}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setBreakfastGuestCount(Math.min(10, breakfastGuestCount + 1))}
                        disabled={breakfastGuestCount >= 10}
                        className="w-8 h-8 rounded-lg bg-[#1F222A] hover:bg-[#262A35] disabled:opacity-40 disabled:cursor-not-allowed text-[#FAF8F5] flex items-center justify-center font-bold text-sm transition-colors"
                        aria-label="Increase guests"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#1F222A] hover:bg-[#262A35] text-[#E0E0E0] border border-[#252936] transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.backBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep2}
                  disabled={!availabilityCheck.available}
                  className="px-6 py-3 rounded-xl font-bold gold-gradient-btn shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{t.nextBtn}: {t.step3Title}</span>
                  <ArrowRight className="w-4 h-4 text-[#0F1115]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Guest Info & Summary Preview */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#252936] pb-4">
                <h3 className="text-xl font-bold text-[#FAF8F5] flex items-center gap-2 font-display">
                  <User className="w-5 h-5 text-[#C5A059]" />
                  <span>{t.step3Title}</span>
                </h3>
                <p className="text-xs text-[#9CA3AF] mt-1 font-sans">
                  {language === 'ky' 
                    ? 'Брондоону ырастоо үчүн байланыш маалыматыңызды жазыңыз.' 
                    : language === 'ru' 
                    ? 'Укажите контактные данные гостя для связи и подтверждения бронирования.' 
                    : 'Provide guest details for booking confirmation and front desk registration.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#FAF8F5] mb-2">
                    {t.guestNameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-4 py-3 text-sm text-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-[#FAF8F5] mb-2">
                    {t.guestPhoneLabel} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-4 py-3 text-sm text-[#FAF8F5] focus:outline-none focus:border-[#C5A059] font-mono"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-[#FAF8F5] mb-2">
                  {t.paymentMethodLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'cash', label: t.payCash },
                    { id: 'mbank', label: t.payMBANK },
                    { id: 'optima', label: t.payOptima },
                    { id: 'card', label: t.payCard },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                        paymentMethod === pm.id
                          ? 'bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059] font-bold'
                          : 'bg-[#0F1115] border-[#252936] text-[#9CA3AF] hover:border-[#333846]'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Requests / Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#FAF8F5] mb-2">
                  {language === 'ky' ? 'Кошумча каалоолор (милдеттүү эмес)' : language === 'ru' ? 'Пожелания к заезду (необязательно)' : 'Special Requests (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.specialRequestsPlaceholder}
                  className="w-full bg-[#0F1115] border border-[#252936] rounded-xl p-3 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#C5A059] resize-none"
                />
              </div>

              {/* Final Summary Card before submission */}
              <div className="bg-[#0F1115] rounded-xl p-4 border border-[#C5A059]/30 space-y-2.5">
                <div className="text-xs font-bold text-[#C5A059] uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  <span>{t.bookingSummaryTitle}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#E0E0E0] pt-1 border-t border-[#252936]">
                  <div>
                    <span className="text-[#9CA3AF]">{t.summaryRoom}</span>{' '}
                    <strong className="text-[#FAF8F5]">№{currentSelectedRoom.roomNumber} ({currentSelectedRoom.name[language]})</strong>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF]">{t.summaryDuration}</span>{' '}
                    <strong className="text-[#FAF8F5]">{duration === '12h' ? '12 Hours' : '24 Hours'}</strong>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF]">{t.summaryCheckIn}</span>{' '}
                    <strong className="text-[#FAF8F5] font-mono">{formatDateTime(checkInDateObj, language)}</strong>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF]">{t.summaryCheckOut}</span>{' '}
                    <strong className="text-[#C5A059] font-mono">{formatDateTime(checkOutDateObj, language)}</strong>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <div>
                      <span className="text-[#9CA3AF]">{t.summaryBreakfast}</span>{' '}
                      <strong className="text-[#FAF8F5]">
                        {hasBreakfast
                          ? `${t.breakfastStatusYes} (${breakfastGuestCount} ${t.breakfastPersonSuffix}) — ${t.advBreakfastDesc}`
                          : t.breakfastStatusNo}
                      </strong>
                    </div>
                    {hasBreakfast && (
                      <p className="text-[11px] text-[#C5A059]">
                        {t.advBreakfastPriceNote}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#252936] text-sm">
                  <span className="font-semibold text-[#E0E0E0]">{t.summaryTotal}</span>
                  <span className="font-extrabold text-[#C5A059] text-lg font-mono">
                    {priceInfo.totalPrice ? formatCurrency(priceInfo.totalPrice, language) : t.priceTBD}
                  </span>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#1F222A] hover:bg-[#262A35] text-[#E0E0E0] border border-[#252936] transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.backBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep3}
                  disabled={isSubmitting}
                  className={`px-7 py-3 rounded-xl font-bold gold-gradient-btn shadow-lg shadow-[#C5A059]/20 transition-all flex items-center gap-2 active:scale-95 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#0F1115]" />
                  <span>{isSubmitting ? (language === 'ky' ? 'Жүктөлүүдө...' : language === 'ru' ? 'Оформление...' : 'Processing...') : t.confirmBookingBtn}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Successful Booking Confirmation Voucher */}
          {step === 4 && confirmedBooking && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/40 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#FAF8F5] font-display">
                  {t.bookingSuccessTitle}
                </h3>
                <p className="text-xs text-[#9CA3AF] max-w-md mx-auto">
                  {t.bookingSuccessSubtitle}
                </p>
                <div className="inline-block bg-[#1F222A] border border-[#C5A059]/40 text-[#C5A059] font-mono font-bold text-lg px-4 py-1.5 rounded-xl shadow mt-2">
                  {confirmedBooking.referenceCode}
                </div>
              </div>

              {/* Printable Voucher Card */}
              <div className="bg-[#0F1115] border border-[#252936] rounded-2xl p-6 space-y-4 printable-voucher">
                <div className="flex justify-between items-start border-b border-[#252936] pb-3">
                  <div>
                    <h4 className="font-bold text-[#FAF8F5] text-base font-display">Bishkek Hotel</h4>
                    <p className="text-xs text-[#9CA3AF]">{t.voucherAddress}</p>
                    <p className="text-xs text-[#9CA3AF]">{t.voucherContact}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-[#9CA3AF]">
                      {new Date(confirmedBooking.createdAt).toLocaleDateString()}
                    </span>
                    <span className="block text-[11px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold mt-1 border border-emerald-500/30">
                      CONFIRMED
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-[#E0E0E0]">
                  <div>
                    <span className="text-[#9CA3AF] block">{t.voucherGuest}</span>
                    <strong className="text-[#FAF8F5] text-sm">{confirmedBooking.guestName}</strong>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block">{t.voucherPhone}</span>
                    <strong className="text-[#FAF8F5] text-sm font-mono">{confirmedBooking.guestPhone}</strong>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block">{t.summaryRoom}</span>
                    <strong className="text-[#C5A059] text-sm font-semibold">
                      № {confirmedBooking.roomNumber} ({rooms.find(r => r.id === confirmedBooking.roomId)?.name[language]})
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block">{t.summaryDuration}</span>
                    <strong className="text-[#FAF8F5] text-sm">{confirmedBooking.duration}</strong>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block">{t.summaryCheckIn}</span>
                    <strong className="text-[#FAF8F5] font-mono">{formatDateTime(new Date(confirmedBooking.checkInDateTime), language)}</strong>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block">{t.summaryCheckOut}</span>
                    <strong className="text-[#C5A059] font-mono">{formatDateTime(new Date(confirmedBooking.checkOutDateTime), language)}</strong>
                  </div>
                </div>

                <div className="border-t border-[#252936] pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-xs text-[#9CA3AF] block">{t.summaryBreakfast}</span>
                    <span className="text-xs font-semibold text-[#C5A059]">
                      {confirmedBooking.hasBreakfast
                        ? `🍳 ${t.breakfastStatusYes} (${confirmedBooking.breakfastGuestCount || 1} ${t.breakfastPersonSuffix}) — ${t.advBreakfastDesc}`
                        : t.breakfastStatusNo}
                    </span>
                    {confirmedBooking.hasBreakfast && (
                      <span className="block text-[10px] text-[#9CA3AF] mt-0.5">
                        {t.advBreakfastPriceNote}
                      </span>
                    )}
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-[#9CA3AF] block">{t.summaryTotal}</span>
                    <span className="text-lg font-bold text-[#C5A059] font-mono">
                      {formatCurrency(confirmedBooking.totalPriceKGS, language)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Post-booking Actions */}
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppContact}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.whatsappConfirmBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#1F222A] hover:bg-[#262A35] text-[#E0E0E0] border border-[#252936] transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t.printVoucherBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetBooking}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold gold-gradient-btn transition-colors"
                >
                  {t.newBookingBtn}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
