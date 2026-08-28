export type Language = 'ky' | 'ru' | 'en';

export type StayDuration = '12h' | '24h';

export interface Room {
  id: string;
  roomNumber: number; // 1 to 11
  name: {
    ky: string;
    ru: string;
    en: string;
  };
  type: 'Standard' | 'Comfort' | 'Deluxe' | 'Junior Suite';
  capacity: number;
  bedType: {
    ky: string;
    ru: string;
    en: string;
  };
  price12h: number | null; // null if "Price to be determined"
  price24hWithoutBreakfast: number;
  price24hWithBreakfast: number;
  amenities: string[];
  image: string;
  description: {
    ky: string;
    ru: string;
    en: string;
  };
  sizeM2: number;
  floor: number;
  isActive: boolean;
}

export interface Booking {
  id: string;
  referenceCode: string;
  roomId: string;
  roomNumber: number;
  guestName: string;
  guestPhone: string;
  checkInDateTime: string; // ISO string e.g. '2026-08-27T18:30:00'
  duration: StayDuration;
  checkOutDateTime: string; // ISO string calculated
  hasBreakfast: boolean;
  breakfastGuestCount?: number;
  totalPriceKGS: number;
  status: 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
  paymentMethod?: 'cash' | 'mbank' | 'optima' | 'card';
}

export interface Review {
  id: string;
  guestName: string;
  guestLocation: string;
  rating: number; // 1-5
  date: string;
  comment: {
    ky: string;
    ru: string;
    en: string;
  };
  stayType: string;
  isVerified: boolean;
  status: 'approved' | 'pending';
}

export interface GalleryItem {
  id: string;
  title: {
    ky: string;
    ru: string;
    en: string;
  };
  category: 'all' | 'exterior' | 'reception' | 'rooms' | 'bathroom' | 'breakfast' | 'lobby';
  image: string;
  caption?: string;
}

export interface HotelSettings {
  name: string;
  address: {
    ky: string;
    ru: string;
    en: string;
  };
  intersectionNote: {
    ky: string;
    ru: string;
    en: string;
  };
  phones: string[];
  whatsapp: string;
  email?: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  defaultBreakfastPriceKGS: number;
  default24hBasePriceKGS: number;
  checkInNoticeMinutes: number;
  cleaningBufferMinutes: number; // e.g. 30 mins buffer between stays
  currency: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  action?: {
    type: 'book_now' | 'view_rooms' | 'call_hotel' | 'open_map' | 'calculate_time';
    payload?: any;
    label: string;
  };
}

export interface FAQItem {
  id: string;
  question: {
    ky: string;
    ru: string;
    en: string;
  };
  answer: {
    ky: string;
    ru: string;
    en: string;
  };
  category: 'stay_logic' | 'pricing' | 'location' | 'amenities' | 'payment';
}
