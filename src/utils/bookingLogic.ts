import { Room, Booking, StayDuration, Language } from '../types';

/**
 * Calculates exact checkout Date from check-in Date and duration (12h or 24h)
 * Bishkek Hotel does NOT use fixed 12:00 checkout; it is strictly relative.
 */
export function calculateCheckOutDateTime(checkInDate: Date, duration: StayDuration): Date {
  const hoursToAdd = duration === '12h' ? 12 : 24;
  const checkOut = new Date(checkInDate.getTime());
  checkOut.setHours(checkOut.getHours() + hoursToAdd);
  return checkOut;
}

/**
 * Parses date string and time string into a valid Date object
 */
export function combineDateAndTime(dateStr: string, timeStr: string): Date {
  // dateStr: YYYY-MM-DD, timeStr: HH:mm
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0);
}

/**
 * Overlap collision detection algorithm:
 * Two time spans [A_start, A_end] and [B_start, B_end] overlap if and only if:
 * (A_start < B_end) && (A_end > B_start)
 *
 * An optional cleaningBufferMinutes (e.g. 15-30m) can be added to the end of each stay
 */
export function checkBookingCollision(
  requestedStart: Date,
  requestedEnd: Date,
  existingStart: Date,
  existingEnd: Date,
  bufferMinutes: number = 0
): boolean {
  const reqStartMs = requestedStart.getTime();
  const reqEndMs = requestedEnd.getTime();
  
  const existStartMs = existingStart.getTime();
  const existEndMs = existingEnd.getTime() + bufferMinutes * 60 * 1000;

  return reqStartMs < existEndMs && reqEndMs > existStartMs;
}

/**
 * Checks if a specific room is available for the requested time frame
 */
export function isRoomAvailable(
  roomId: string,
  checkInDate: Date,
  duration: StayDuration,
  allBookings: Booking[],
  excludeBookingId?: string,
  bufferMinutes: number = 0
): { available: boolean; conflictingBooking?: Booking } {
  const checkOutDate = calculateCheckOutDateTime(checkInDate, duration);

  const activeBookings = allBookings.filter(
    (b) => b.roomId === roomId && b.status !== 'cancelled' && b.id !== excludeBookingId
  );

  for (const booking of activeBookings) {
    const existStart = new Date(booking.checkInDateTime);
    const existEnd = new Date(booking.checkOutDateTime);

    if (checkBookingCollision(checkInDate, checkOutDate, existStart, existEnd, bufferMinutes)) {
      return {
        available: false,
        conflictingBooking: booking,
      };
    }
  }

  return { available: true };
}

/**
 * Get all available rooms for a given check-in time and duration
 */
export function getAvailableRooms(
  rooms: Room[],
  checkInDate: Date,
  duration: StayDuration,
  bookings: Booking[],
  bufferMinutes: number = 0
): Room[] {
  return rooms.filter((room) => {
    if (!room.isActive) return false;
    // If 12h stay requested and price is null (undetermined), room might still be shown with notice
    const { available } = isRoomAvailable(room.id, checkInDate, duration, bookings, undefined, bufferMinutes);
    return available;
  });
}

/**
 * Calculate total price for a stay in Kyrgyz Som (KGS)
 */
export function calculateStayPrice(
  room: Room,
  duration: StayDuration,
  hasBreakfast: boolean,
  customBreakfastPrice?: number,
  custom24hBasePrice?: number
): { totalPrice: number | null; isPriceDetermined: boolean; priceBreakdown: string } {
  if (duration === '12h') {
    if (room.price12h === null) {
      return {
        totalPrice: null,
        isPriceDetermined: false,
        priceBreakdown: 'Price to be determined by administrator',
      };
    }
    return {
      totalPrice: room.price12h,
      isPriceDetermined: true,
      priceBreakdown: `${room.price12h.toLocaleString('ru-RU')} KGS (12 hours stay)`,
    };
  }

  // 24h stay
  const base24h = room.price24hWithoutBreakfast || custom24hBasePrice || 5000;

  return {
    totalPrice: base24h,
    isPriceDetermined: true,
    priceBreakdown: `${base24h.toLocaleString('ru-RU')} KGS (24 hours stay)`,
  };
}

/**
 * Generate human readable reference code
 */
export function generateReferenceCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BSHK-${new Date().getFullYear()}-${rand}`;
}

/**
 * Format date & time nicely with language support
 */
export function formatDateTime(date: Date, lang: Language): string {
  const months = {
    ky: [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ],
    ru: [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ],
    en: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
  };

  const day = date.getDate();
  const monthName = months[lang][date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (lang === 'ky') {
    return `${year}-ж. ${day}-${monthName}, ${hours}:${minutes}`;
  }
  if (lang === 'ru') {
    return `${day} ${monthName} ${year} г., ${hours}:${minutes}`;
  }
  return `${monthName} ${day}, ${year} at ${hours}:${minutes}`;
}

/**
 * Format currency in KGS
 */
export function formatCurrency(amount: number | null, lang: Language): string {
  if (amount === null) {
    if (lang === 'ky') return 'Баасы такталууда';
    if (lang === 'ru') return 'Цена уточняется';
    return 'Price TBD';
  }
  const formatted = amount.toLocaleString('ru-RU');
  if (lang === 'ky') return `${formatted} сом`;
  if (lang === 'ru') return `${formatted} сом`;
  return `${formatted} KGS`;
}
