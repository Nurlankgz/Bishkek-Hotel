-- ====================================================================
-- Bishkek Hotel — Complete Supabase PostgreSQL Database Schema
-- Migration: 20260828_init_hotel_schema.sql
-- ====================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. Create Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
  id TEXT PRIMARY KEY,
  room_number INTEGER NOT NULL UNIQUE,
  name_ky TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'standard',
  floor INTEGER NOT NULL DEFAULT 1,
  price_12h INTEGER NOT NULL,             -- Rooms 1-2: 2,500 KGS | Rooms 3-11: 2,800 KGS
  price_24h INTEGER NOT NULL DEFAULT 5000,-- All rooms: 5,000 KGS
  capacity_adults INTEGER NOT NULL DEFAULT 2,
  capacity_max INTEGER NOT NULL DEFAULT 3,
  size INTEGER NOT NULL DEFAULT 22,
  bed_type_ky TEXT NOT NULL,
  bed_type_ru TEXT NOT NULL,
  bed_type_en TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  amenities TEXT[] NOT NULL DEFAULT '{}',
  description_ky TEXT NOT NULL DEFAULT '',
  description_ru TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'available',
  featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT NOT NULL UNIQUE,
  room_id TEXT NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
  room_number INTEGER NOT NULL,
  guest_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 1,
  
  -- Exact Timestamps (Asia/Bishkek UTC+6)
  check_in_timestamp TIMESTAMPTZ NOT NULL,
  check_out_timestamp TIMESTAMPTZ NOT NULL,
  
  -- Formatted date/time for display and quick filtering
  check_in_date DATE NOT NULL,
  check_in_time TIME NOT NULL,
  check_out_date DATE NOT NULL,
  check_out_time TIME NOT NULL,
  duration TEXT NOT NULL CHECK (duration IN ('12h', '24h')),
  
  -- Pricing in Kyrgyz Som (KGS)
  room_price INTEGER NOT NULL,
  breakfast BOOLEAN NOT NULL DEFAULT false,
  breakfast_count INTEGER NOT NULL DEFAULT 0,
  breakfast_price INTEGER NOT NULL DEFAULT 0,
  total_price INTEGER NOT NULL,
  special_requests TEXT DEFAULT '',
  
  -- Booking & Payment Statuses
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pay_at_hotel' CHECK (payment_status IN ('pending', 'paid', 'pay_at_hotel')),
  payment_method TEXT DEFAULT 'cash',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create Index on Bookings for high performance range queries
CREATE INDEX IF NOT EXISTS idx_bookings_room_dates 
ON public.bookings (room_id, check_in_timestamp, check_out_timestamp)
WHERE status IN ('pending', 'confirmed', 'checked_in');

CREATE INDEX IF NOT EXISTS idx_bookings_code 
ON public.bookings (booking_code);

-- 5. Seed the 11 Verified Rooms
INSERT INTO public.rooms (
  id, room_number, name_ky, name_ru, name_en, category, floor, 
  price_12h, price_24h, capacity_adults, capacity_max, size, 
  bed_type_ky, bed_type_ru, bed_type_en, description_ky, description_ru, description_en,
  images, amenities, status, featured, is_active
) VALUES
('room-1', 1, 'Стандарт №1', 'Стандарт №1', 'Standard Room #1', 'Standard', 1, 2500, 5000, 2, 2, 20, '1 чоң керебет (Double)', '1 двуспальная кровать', '1 Queen-size Bed', '12 сааттык (2 500 сом) жана 24 сааттык (5 000 сом) туруу жеткиликтүү.', 'Доступно проживание на 12 часов (2 500 сом) и на 24 часа (5 000 сом).', 'Available for 12-hour (2,500 KGS) and 24-hour (5,000 KGS) stays.', ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80'], ARRAY['wifi', 'tv', 'ac', 'bathroom', 'kettle', 'toiletries'], 'available', true, true),
('room-2', 2, 'Стандарт №2', 'Стандарт №2', 'Standard Room #2', 'Standard', 1, 2500, 5000, 2, 2, 20, '1 чоң керебет (Double)', '1 двуспальная кровать', '1 Queen-size Bed', '12 сааттык (2 500 сом) жана 24 сааттык (5 000 сом) туруу жеткиликтүү.', 'Доступно проживание на 12 часов (2 500 сом) и на 24 часа (5 000 сом).', 'Available for 12-hour (2,500 KGS) and 24-hour (5,000 KGS) stays.', ARRAY['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80'], ARRAY['wifi', 'tv', 'ac', 'bathroom', 'kettle', 'toiletries'], 'available', false, true),
('room-3', 3, 'Комфорт №3', 'Комфорт №3', 'Comfort Room #3', 'Comfort', 1, 2800, 5000, 2, 3, 24, '1 чоң керебет (Double) + Диван', '1 двуспальная кровать + диван', '1 King-size Bed + Sofa', '12 сааттык (2 800 сом) жана 24 сааттык (5 000 сом) туруу жеткиликтүү.', 'Доступно проживание на 12 часов (2 800 сом) и на 24 часа (5 000 сом).', 'Available for 12-hour (2,800 KGS) and 24-hour (5,000 KGS) stays.', ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80'], ARRAY['wifi', 'tv', 'ac', 'bathroom', 'kettle', 'fridge', 'toiletries', 'desk'], 'available', true, true),
('room-4', 4, 'Комфорт №4', 'Комфорт №4', 'Comfort Room #4', 'Comfort', 1, 2800, 5000, 2, 3, 24, '1 чоң керебет (Double)', '1 двуспальная кровать', '1 King-size Bed', '12 сааттык (2 800 сом) жана 24 сааттык (5 000 сом) туруу жеткиликтүү.', 'Доступно проживание на 12 часов (2 800 сом) и на 24 часа (5 000 сом).', 'Available for 12-hour (2,800 KGS) and 24-hour (5,000 KGS) stays.', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80'], ARRAY['wifi', 'tv', 'ac', 'bathroom', 'kettle', 'fridge', 'toiletries'], 'available', false, true),
('room-5', 5, 'Комфорт №5', 'Комфорт №5', 'Comfort Room #5', 'Comfort', 2, 2800, 5000, 2, 2, 22, '1 чоң керебет (Double)', '1 двуспальная кровать', '1 King-size Bed', '12 сааттык (2 800 сом) жана 24 сааттык (5 000 сом) туруу жеткиликтүү.', 'Доступно проживание на 12 часов (2 800 сом) и на 24 часа (5 000 сом).', 'Available for 12-hour (2,800 KGS) and 24-hour (5,000 KGS) stays.', ARRAY['https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=900&q=80'], ARRAY['wifi', 'tv', 'ac', 'bathroom', 'kettle', 'toiletries', 'balcony'], 'available', false, true),
('room-6', 6, 'Делюкс №6', 'Делюкс №6', 'Deluxe Room #6', 'Deluxe', 2, 2800, 5000, 2, 3, 28, '1 падышалык керебет (King)', '1 королевская двуспальная кровать', '1 Super King Bed', '12 сааттык (2 800 сом) жана 24 сааттык (5 000 сом) туруу жеткиликтүү.', 'Доступно проживание на 12 часов (2 800 сом) и на 24 часа (5 000 сом).', 'Available for 12-hour (2,800 KGS) and 24-hour (5,000 KGS) stays.', ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80'], ARRAY['wifi', 'tv', 'ac', 'bathroom', 'kettle', 'fridge', 'toiletries', 'safe', 'roomservice'], 'available', true, true),
('room-7', 7, 'Делюкс №7', 'Делюкс №7', 'Deluxe Room #7', 'Deluxe', 2, 2800, 5000, 2, 3, 28, '1 падышалык керебет (King)', '1 королевская двуспальная кровать', '1 Super King Bed', '12 сааттык (2 800 сом) жана 24 сааттык (5 000 сом) туруу жеткиликтүү.', 'Доступно проживание на 12 часов (2 800 сом) и на 24 часа (5 000 сом).', 'Available for 12-hour (2,800 KGS) and 24-hour (5,000 KGS) stays.', ARRAY['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80'], ARRAY['wifi', 'tv', 'ac', 'bathroom', 'kettle', 'fridge', 'toiletries', 'safe', 'balcony'], 'available', false, true),
('room-8', 8, 'Жайлуу №8', 'Комфорт №8', 'Comfort Room #8', 'Comfort', 2, 2800, 5000, 2, 2, 24, '1 чоң керебет (Double)', '1 двуспальная кровать', '1 Double Bed', '12 сааттык (2 800 сом) жана 24 сааттык (5 000 сом) туруу жеткиликтүү.', 'Доступно проживание на 12 часов (2 800 сом) и на 24 часа (5 000 сом).', 'Available for 12-hour (2,800 KGS) and 24-hour (5,000 KGS) stays.', ARRAY['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80'], ARRAY['wifi', 'tv', 'ac', 'bathroom', 'kettle', 'toiletries'], 'available', false, true),
('room-9', 9, 'Жайлуу №9', 'Комфорт №9', 'Comfort Room #9', 'Comfort', 2, 2800, 5000, 2, 2, 24, '1 чоң керебет (Double)', '1 двуспальная кровать', '1 Double Bed', '12 сааттык (2 800 сом) жана 24 сааттык (5 000 сом) туруу жеткиликтүү.', 'Доступно проживание на 12 часов (2 800 сом) и на 24 часа (5 000 сом).', 'Available for 12-hour (2,800 KGS) and 24-hour (5,000 KGS) stays.', ARRAY['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'], ARRAY['wifi', 'tv', 'ac', 'bathroom', 'kettle', 'toiletries', 'desk'], 'available', false, true),
('room-10', 10, 'Кенен №10', 'Комфорт №10', 'Comfort Room #10', 'Comfort', 2, 2800, 5000, 2, 3, 26, '2 өзүнчө керебет (Twin) же 1 чоң керебет', '2 раздельные кровати или 1 большая', 'Twin Beds or 1 King Bed', '12 сааттык (2 800 сом) жана 24 сааттык (5 000 сом) туруу жеткиликтүү.', 'Доступно проживание на 12 часов (2 800 сом) и на 24 часа (5 000 сом).', 'Available for 12-hour (2,800 KGS) and 24-hour (5,000 KGS) stays.', ARRAY['https://images.unsplash.com/photo-1587985064135-0366536eab42?auto=format&fit=crop&w=900&q=80'], ARRAY['wifi', 'tv', 'ac', 'bathroom', 'kettle', 'fridge', 'toiletries'], 'available', false, true),
('room-11', 11, 'Жайлуу №11', 'Комфорт №11', 'Comfort Room #11', 'Comfort', 2, 2800, 5000, 2, 2, 25, '1 чоң керебет (Double)', '1 двуспальная кровать', '1 Double Bed', '12 сааттык (2 800 сом) жана 24 сааттык (5 000 сом) туруу жеткиликтүү.', 'Доступно проживание на 12 часов (2 800 сом) и на 24 часа (5 000 сом).', 'Available for 12-hour (2,800 KGS) and 24-hour (5,000 KGS) stays.', ARRAY['https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=900&q=80'], ARRAY['wifi', 'tv', 'ac', 'bathroom', 'kettle', 'toiletries'], 'available', false, true)
ON CONFLICT (id) DO UPDATE SET
  price_12h = EXCLUDED.price_12h,
  price_24h = EXCLUDED.price_24h,
  description_ky = EXCLUDED.description_ky,
  description_ru = EXCLUDED.description_ru,
  description_en = EXCLUDED.description_en,
  updated_at = now();

-- 6. Atomic Double-Booking Check & Creation RPC Function
CREATE OR REPLACE FUNCTION public.create_booking_atomic(
  p_booking_code TEXT,
  p_room_id TEXT,
  p_room_number INTEGER,
  p_guest_name TEXT,
  p_phone TEXT,
  p_guest_count INTEGER,
  p_check_in_timestamp TIMESTAMPTZ,
  p_check_out_timestamp TIMESTAMPTZ,
  p_check_in_date DATE,
  p_check_in_time TIME,
  p_check_out_date DATE,
  p_check_out_time TIME,
  p_duration TEXT,
  p_room_price INTEGER,
  p_breakfast BOOLEAN,
  p_breakfast_count INTEGER,
  p_breakfast_price INTEGER,
  p_total_price INTEGER,
  p_special_requests TEXT DEFAULT '',
  p_payment_method TEXT DEFAULT 'cash'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_conflict_count INTEGER;
  v_booking_id UUID;
  v_inserted_record JSONB;
BEGIN
  -- Strict lock to prevent race conditions during overlap evaluation
  PERFORM pg_advisory_xact_lock(hashtext(p_room_id));

  -- Check for existing overlapping active bookings
  -- Condition: existing.start < new.end AND existing.end > new.start
  SELECT COUNT(*)
  INTO v_conflict_count
  FROM public.bookings
  WHERE room_id = p_room_id
    AND status IN ('pending', 'confirmed', 'checked_in')
    AND check_in_timestamp < p_check_out_timestamp
    AND check_out_timestamp > p_check_in_timestamp;

  IF v_conflict_count > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'COLLISION_DETECTED',
      'message', 'Room is already booked for the selected time interval.'
    );
  END IF;

  -- Insert the new booking
  INSERT INTO public.bookings (
    booking_code,
    room_id,
    room_number,
    guest_name,
    phone,
    guest_count,
    check_in_timestamp,
    check_out_timestamp,
    check_in_date,
    check_in_time,
    check_out_date,
    check_out_time,
    duration,
    room_price,
    breakfast,
    breakfast_count,
    breakfast_price,
    total_price,
    special_requests,
    status,
    payment_status,
    payment_method,
    created_at,
    updated_at
  ) VALUES (
    p_booking_code,
    p_room_id,
    p_room_number,
    p_guest_name,
    p_phone,
    p_guest_count,
    p_check_in_timestamp,
    p_check_out_timestamp,
    p_check_in_date,
    p_check_in_time,
    p_check_out_date,
    p_check_out_time,
    p_duration,
    p_room_price,
    p_breakfast,
    p_breakfast_count,
    p_breakfast_price,
    p_total_price,
    p_special_requests,
    'confirmed',
    'pay_at_hotel',
    p_payment_method,
    now(),
    now()
  )
  RETURNING id, to_jsonb(public.bookings.*) INTO v_booking_id, v_inserted_record;

  RETURN jsonb_build_object(
    'success', true,
    'id', v_booking_id,
    'booking', v_inserted_record
  );
END;
$$;

-- 7. Function to check room availability across all rooms
CREATE OR REPLACE FUNCTION public.check_room_availability(
  p_room_id TEXT,
  p_check_in_timestamp TIMESTAMPTZ,
  p_check_out_timestamp TIMESTAMPTZ,
  p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_conflict_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.bookings
    WHERE room_id = p_room_id
      AND status IN ('pending', 'confirmed', 'checked_in')
      AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
      AND check_in_timestamp < p_check_out_timestamp
      AND check_out_timestamp > p_check_in_timestamp
  ) INTO v_conflict_exists;

  RETURN NOT v_conflict_exists;
END;
$$;

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies
-- Rooms: Public read access to active rooms
CREATE POLICY "Public read active rooms" ON public.rooms
FOR SELECT TO public
USING (is_active = true);

-- Rooms: Authenticated Admin manage rooms
CREATE POLICY "Admin manage rooms" ON public.rooms
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Bookings: Public can create bookings (anon or authenticated)
CREATE POLICY "Public insert bookings" ON public.bookings
FOR INSERT TO public
WITH CHECK (true);

-- Bookings: Read access (Public can read bookings or via RPC)
CREATE POLICY "Public read bookings for availability check" ON public.bookings
FOR SELECT TO public
USING (true);

-- Bookings: Admin manage all bookings
CREATE POLICY "Admin update delete bookings" ON public.bookings
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- 10. Enable Supabase Realtime for instant room availability across devices
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
