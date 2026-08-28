import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Room, Booking, HotelSettings, Review, GalleryItem, Language, StayDuration } from '../types';
import { initialRooms, initialBookings, initialHotelSettings, initialReviews, initialGallery } from '../data/initialData';
import { translations } from '../i18n/translations';
import {
  fetchRoomsFromDb,
  fetchBookingsFromDb,
  createBookingInDb,
  updateBookingStatusInDb,
  deleteBookingFromDb,
  updateRoomInDb,
  subscribeToBookings,
  subscribeToRooms,
} from '../lib/supabase';

export interface QuickBookingParams {
  date: string;
  time: string;
  duration: StayDuration;
}

interface HotelContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['ru'];
  rooms: Room[];
  bookings: Booking[];
  settings: HotelSettings;
  reviews: Review[];
  gallery: GalleryItem[];
  selectedRoomForBooking: Room | null;
  setSelectedRoomForBooking: (room: Room | null) => void;
  quickBookingParams: QuickBookingParams | null;
  setQuickBookingParams: (params: QuickBookingParams | null) => void;
  
  // Actions
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  addBookingAsync: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<{ success: boolean; booking?: Booking; error?: string }>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  updateRoom: (room: Room) => Promise<void>;
  updateRoom12hPrice: (roomId: string, price12h: number | null) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'date' | 'status' | 'isVerified'>) => void;
  updateReviewStatus: (id: string, status: 'approved' | 'pending') => void;
  updateSettings: (newSettings: Partial<HotelSettings>) => void;
  resetToDefaults: () => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('bishkek_hotel_lang');
    return (saved === 'ky' || saved === 'ru' || saved === 'en') ? saved : 'ru';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [quickBookingParams, setQuickBookingParams] = useState<QuickBookingParams | null>(null);

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('bishkek_hotel_rooms');
    if (saved) {
      try {
        const parsed: Room[] = JSON.parse(saved);
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return initialRooms;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('bishkek_hotel_bookings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialBookings;
  });

  const [settings, setSettings] = useState<HotelSettings>(() => {
    const saved = localStorage.getItem('bishkek_hotel_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialHotelSettings;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('bishkek_hotel_reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialReviews;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('bishkek_hotel_gallery');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialGallery;
  });

  // Initial fetch from Supabase + Realtime subscriptions
  useEffect(() => {
    let isMounted = true;

    fetchRoomsFromDb().then((dbRooms) => {
      if (isMounted && dbRooms && dbRooms.length > 0) {
        setRooms(dbRooms);
      }
    });

    fetchBookingsFromDb().then((dbBookings) => {
      if (isMounted && dbBookings) {
        setBookings(dbBookings);
      }
    });

    // Realtime subscriptions
    const unsubBookings = subscribeToBookings((updatedBookings) => {
      if (isMounted && updatedBookings) {
        setBookings(updatedBookings);
      }
    });

    const unsubRooms = subscribeToRooms((updatedRooms) => {
      if (isMounted && updatedRooms) {
        setRooms(updatedRooms);
      }
    });

    return () => {
      isMounted = false;
      unsubBookings();
      unsubRooms();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('bishkek_hotel_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('bishkek_hotel_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('bishkek_hotel_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('bishkek_hotel_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('bishkek_hotel_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('bishkek_hotel_gallery', JSON.stringify(gallery));
  }, [gallery]);

  const addBookingAsync = useCallback(async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const result = await createBookingInDb(bookingData, bookings);
    if (result.success && result.booking) {
      setBookings((prev) => [result.booking!, ...prev.filter((b) => b.id !== result.booking!.id)]);
    }
    return result;
  }, [bookings]);

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const tempId = `bk-${Date.now()}`;
    const newBooking: Booking = {
      ...bookingData,
      id: tempId,
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);

    // Persist in Supabase in background
    createBookingInDb(bookingData, bookings).then((res) => {
      if (res.success && res.booking) {
        setBookings((prev) => [res.booking!, ...prev.filter((b) => b.id !== tempId && b.id !== res.booking!.id)]);
      }
    });

    return newBooking;
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    await updateBookingStatusInDb(id, status);
  };

  const deleteBooking = async (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    await deleteBookingFromDb(id);
  };

  const updateRoom = async (updatedRoom: Room) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === updatedRoom.id ? updatedRoom : r))
    );
    await updateRoomInDb(updatedRoom);
  };

  const updateRoom12hPrice = async (roomId: string, price12h: number | null) => {
    const current = rooms.find((r) => r.id === roomId);
    if (current) {
      const updated: Room = { ...current, price12h };
      setRooms((prev) =>
        prev.map((r) => (r.id === roomId ? updated : r))
      );
      await updateRoomInDb(updated);
    }
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'status' | 'isVerified'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isVerified: true,
      status: 'approved',
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const updateReviewStatus = (id: string, status: 'approved' | 'pending') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const updateSettings = (newSettings: Partial<HotelSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetToDefaults = () => {
    setRooms(initialRooms);
    setBookings(initialBookings);
    setSettings(initialHotelSettings);
    setReviews(initialReviews);
    setGallery(initialGallery);
    localStorage.removeItem('bishkek_hotel_rooms');
    localStorage.removeItem('bishkek_hotel_bookings');
    localStorage.removeItem('bishkek_hotel_settings');
    localStorage.removeItem('bishkek_hotel_reviews');
    localStorage.removeItem('bishkek_hotel_gallery');
  };

  const t = translations[language];

  return (
    <HotelContext.Provider
      value={{
        language,
        setLanguage,
        t,
        rooms,
        bookings,
        settings,
        reviews,
        gallery,
        selectedRoomForBooking,
        setSelectedRoomForBooking,
        quickBookingParams,
        setQuickBookingParams,
        addBooking,
        addBookingAsync,
        updateBookingStatus,
        deleteBooking,
        updateRoom,
        updateRoom12hPrice,
        addReview,
        updateReviewStatus,
        updateSettings,
        resetToDefaults,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};


export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
