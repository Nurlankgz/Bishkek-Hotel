import { createClient } from '@supabase/supabase-js';
import { Room, Booking, StayDuration } from '../types';
import { initialRooms, initialBookings } from '../data/initialData';
import { calculateCheckOutDateTime, combineDateAndTime, checkBookingCollision } from '../utils/bookingLogic';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' &&
  supabaseUrl.startsWith('http')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Converts a database room row to our application Room type
 */
export function mapDbRoomToRoom(row: any): Room {
  return {
    id: row.id,
    roomNumber: row.room_number,
    name: {
      ky: row.name_ky || `№${row.room_number}`,
      ru: row.name_ru || `№${row.room_number}`,
      en: row.name_en || `Room #${row.room_number}`,
    },
    type: (row.category as any) || 'Standard',
    capacity: row.capacity_adults || 2,
    bedType: {
      ky: row.bed_type_ky || '1 чоң керебет',
      ru: row.bed_type_ru || '1 двуспальная кровать',
      en: row.bed_type_en || '1 Double Bed',
    },
    price12h: row.price_12h !== null && row.price_12h !== undefined ? Number(row.price_12h) : (row.room_number <= 2 ? 2500 : 2800),
    price24hWithoutBreakfast: Number(row.price_24h) || 5000,
    price24hWithBreakfast: Number(row.price_24h) || 5000,
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    image: Array.isArray(row.images) && row.images.length > 0 ? row.images[0] : (row.image || ''),
    description: {
      ky: row.description_ky || `12 сааттык (${row.price_12h || 2800} сом) жана 24 сааттык (5 000 сом) туруу жеткиликтүү.`,
      ru: row.description_ru || `Доступно проживание на 12 часов (${row.price_12h || 2800} сом) и на 24 часа (5 000 сом).`,
      en: row.description_en || `Available for 12-hour (${row.price_12h || 2800} KGS) and 24-hour (5,000 KGS) stays.`,
    },
    sizeM2: row.size || 22,
    floor: row.floor || 1,
    isActive: row.is_active ?? true,
  };
}

/**
 * Converts a database booking row to our application Booking type
 */
export function mapDbBookingToBooking(row: any): Booking {
  return {
    id: String(row.id),
    referenceCode: row.booking_code || `BSHK-${row.id?.slice?.(0, 4) || 'RES'}`,
    roomId: row.room_id,
    roomNumber: Number(row.room_number),
    guestName: row.guest_name,
    guestPhone: row.phone,
    checkInDateTime: row.check_in_timestamp || `${row.check_in_date}T${row.check_in_time}:00`,
    duration: row.duration as StayDuration,
    checkOutDateTime: row.check_out_timestamp || `${row.check_out_date}T${row.check_out_time}:00`,
    hasBreakfast: Boolean(row.breakfast),
    breakfastGuestCount: row.breakfast_count ? Number(row.breakfast_count) : undefined,
    totalPriceKGS: Number(row.total_price),
    status: row.status as Booking['status'],
    createdAt: row.created_at || new Date().toISOString(),
    notes: row.special_requests || '',
    paymentMethod: (row.payment_method as any) || 'cash',
  };
}

/**
 * Fetch all rooms from Supabase (or fallback to initialRooms)
 */
export async function fetchRoomsFromDb(): Promise<Room[]> {
  if (!supabase) {
    return initialRooms;
  }

  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('room_number', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Supabase rooms query fallback:', error?.message);
      return initialRooms;
    }

    return data.map(mapDbRoomToRoom);
  } catch (err) {
    console.error('Error fetching rooms from Supabase:', err);
    return initialRooms;
  }
}

/**
 * Fetch all bookings from Supabase (or fallback to initialBookings)
 */
export async function fetchBookingsFromDb(): Promise<Booking[]> {
  if (!supabase) {
    return initialBookings;
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase bookings query fallback:', error?.message);
      return initialBookings;
    }

    return data.map(mapDbBookingToBooking);
  } catch (err) {
    console.error('Error fetching bookings from Supabase:', err);
    return initialBookings;
  }
}

/**
 * Helper to build Asia/Bishkek (UTC+6) ISO string
 */
export function toBishkekIsoString(dateStr: string, timeStr: string): string {
  // Pad hours and minutes
  const [h, m] = timeStr.split(':').map((v) => v.padStart(2, '0'));
  return `${dateStr}T${h}:${m}:00+06:00`;
}

/**
 * Atomic Booking creation with server-side collision check
 */
export async function createBookingInDb(
  bookingData: Omit<Booking, 'id' | 'createdAt'>,
  currentBookings: Booking[]
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  const checkInDateObj = new Date(bookingData.checkInDateTime);
  const checkOutDateObj = new Date(bookingData.checkOutDateTime);

  // Extract Date and Time components for database columns
  const pad = (n: number) => String(n).padStart(2, '0');
  const checkInDate = `${checkInDateObj.getFullYear()}-${pad(checkInDateObj.getMonth() + 1)}-${pad(checkInDateObj.getDate())}`;
  const checkInTime = `${pad(checkInDateObj.getHours())}:${pad(checkInDateObj.getMinutes())}`;
  const checkOutDate = `${checkOutDateObj.getFullYear()}-${pad(checkOutDateObj.getMonth() + 1)}-${pad(checkOutDateObj.getDate())}`;
  const checkOutTime = `${pad(checkOutDateObj.getHours())}:${pad(checkOutDateObj.getMinutes())}`;

  if (!supabase) {
    // Local memory/storage fallback with strict collision check
    const isOverlapping = currentBookings.some((b) => {
      if (b.roomId !== bookingData.roomId) return false;
      if (b.status === 'cancelled') return false;
      const bStart = new Date(b.checkInDateTime);
      const bEnd = new Date(b.checkOutDateTime);
      return checkBookingCollision(checkInDateObj, checkOutDateObj, bStart, bEnd, 0);
    });

    if (isOverlapping) {
      return {
        success: false,
        error: 'Бул бөлмө тандалган убакытка ээленген / Номер уже занят на выбранное время',
      };
    }

    const localBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    return { success: true, booking: localBooking };
  }

  try {
    // 1. Try atomic RPC function first
    const { data: rpcResult, error: rpcError } = await supabase.rpc('create_booking_atomic', {
      p_booking_code: bookingData.referenceCode,
      p_room_id: bookingData.roomId,
      p_room_number: bookingData.roomNumber,
      p_guest_name: bookingData.guestName,
      p_phone: bookingData.guestPhone,
      p_guest_count: 1,
      p_check_in_timestamp: checkInDateObj.toISOString(),
      p_check_out_timestamp: checkOutDateObj.toISOString(),
      p_check_in_date: checkInDate,
      p_check_in_time: checkInTime,
      p_check_out_date: checkOutDate,
      p_check_out_time: checkOutTime,
      p_duration: bookingData.duration,
      p_room_price: bookingData.totalPriceKGS,
      p_breakfast: bookingData.hasBreakfast,
      p_breakfast_count: bookingData.breakfastGuestCount || 0,
      p_breakfast_price: (bookingData.breakfastGuestCount || 0) * 350,
      p_total_price: bookingData.totalPriceKGS,
      p_special_requests: bookingData.notes || '',
      p_payment_method: bookingData.paymentMethod || 'cash',
    });

    if (!rpcError && rpcResult) {
      if (!rpcResult.success) {
        return {
          success: false,
          error: rpcResult.message || 'Room is already booked for this interval.',
        };
      }
      return {
        success: true,
        booking: mapDbBookingToBooking(rpcResult.booking),
      };
    }

    // 2. Direct table insert fallback if RPC was not deployed yet
    // Query active overlapping bookings
    const { data: conflicts, error: queryError } = await supabase
      .from('bookings')
      .select('id, check_in_timestamp, check_out_timestamp, status')
      .eq('room_id', bookingData.roomId)
      .in('status', ['pending', 'confirmed', 'checked_in'])
      .lt('check_in_timestamp', checkOutDateObj.toISOString())
      .gt('check_out_timestamp', checkInDateObj.toISOString());

    if (queryError) {
      console.warn('Direct collision check error:', queryError);
    }

    if (conflicts && conflicts.length > 0) {
      return {
        success: false,
        error: 'Бул бөлмө тандалган убакытка ээленген / Номер уже занят на выбранное время',
      };
    }

    const { data: inserted, error: insertError } = await supabase
      .from('bookings')
      .insert({
        booking_code: bookingData.referenceCode,
        room_id: bookingData.roomId,
        room_number: bookingData.roomNumber,
        guest_name: bookingData.guestName,
        phone: bookingData.guestPhone,
        guest_count: 1,
        check_in_timestamp: checkInDateObj.toISOString(),
        check_out_timestamp: checkOutDateObj.toISOString(),
        check_in_date: checkInDate,
        check_in_time: checkInTime,
        check_out_date: checkOutDate,
        check_out_time: checkOutTime,
        duration: bookingData.duration,
        room_price: bookingData.totalPriceKGS,
        breakfast: bookingData.hasBreakfast,
        breakfast_count: bookingData.breakfastGuestCount || 0,
        breakfast_price: (bookingData.breakfastGuestCount || 0) * 350,
        total_price: bookingData.totalPriceKGS,
        special_requests: bookingData.notes || '',
        status: 'confirmed',
        payment_status: 'pay_at_hotel',
        payment_method: bookingData.paymentMethod || 'cash',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting booking to Supabase:', insertError);
      return { success: false, error: insertError.message };
    }

    return {
      success: true,
      booking: mapDbBookingToBooking(inserted),
    };
  } catch (err: any) {
    console.error('Exception during booking creation in Supabase:', err);
    return { success: false, error: err?.message || 'Database booking failed' };
  }
}

/**
 * Update booking status in Supabase
 */
export async function updateBookingStatusInDb(id: string, status: Booking['status']): Promise<boolean> {
  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Failed to update booking status in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error updating booking status in Supabase:', err);
    return false;
  }
}

/**
 * Delete booking from Supabase
 */
export async function deleteBookingFromDb(id: string): Promise<boolean> {
  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete booking in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error deleting booking in Supabase:', err);
    return false;
  }
}

/**
 * Update room details or 12h pricing in Supabase
 */
export async function updateRoomInDb(room: Room): Promise<boolean> {
  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('rooms')
      .update({
        name_ru: room.name.ru,
        price_12h: room.price12h,
        price_24h: room.price24hWithoutBreakfast,
        is_active: room.isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', room.id);

    if (error) {
      console.error('Failed to update room in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error updating room in Supabase:', err);
    return false;
  }
}

/**
 * Realtime subscription to bookings
 */
export function subscribeToBookings(onUpdate: (bookings: Booking[]) => void) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('realtime_bookings')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bookings' },
      async () => {
        const fresh = await fetchBookingsFromDb();
        onUpdate(fresh);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Realtime subscription to rooms
 */
export function subscribeToRooms(onUpdate: (rooms: Room[]) => void) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('realtime_rooms')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'rooms' },
      async () => {
        const fresh = await fetchRoomsFromDb();
        onUpdate(fresh);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
