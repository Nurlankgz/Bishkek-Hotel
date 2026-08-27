import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, Booking, HotelSettings, Review, GalleryItem, Language, StayDuration } from '../types';
import { initialRooms, initialBookings, initialHotelSettings, initialReviews, initialGallery } from '../data/initialData';
import { translations } from '../i18n/translations';

export interface QuickBookingParams {
  date: string;
  time: string;
  duration: StayDuration;
}

interface HotelContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['ru'];
  activeTab: string;
  setActiveTab: (tab: string) => void;
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
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  deleteBooking: (id: string) => void;
  updateRoom: (room: Room) => void;
  updateRoom12hPrice: (roomId: string, price12h: number | null) => void;
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

  const [activeTab, setActiveTabState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash.includes('admin') || pathname.includes('/admin') || search.includes('admin')) {
        return 'admin';
      }
      if (hash.includes('spec') || pathname.includes('/spec') || search.includes('spec')) {
        return 'spec';
      }
    }
    return 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#/admin') {
        setActiveTabState('admin');
      } else if (hash === '#spec' || hash === '#/spec') {
        setActiveTabState('spec');
      } else if (['#home', '#rooms', '#booking', '#about', '#contact', '#gallery', '#reviews', '#location', '#faq'].includes(hash)) {
        setActiveTabState('home');
        const sectionId = hash.replace('#', '');
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [quickBookingParams, setQuickBookingParams] = useState<QuickBookingParams | null>(null);

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('bishkek_hotel_rooms');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
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

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setActiveTab = (tab: string) => {
    if (tab === 'admin') {
      setActiveTabState('admin');
      window.location.hash = 'admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'spec') {
      setActiveTabState('spec');
      window.location.hash = 'spec';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTabState('home');
      if (tab === 'home') {
        window.history.replaceState(null, '', window.location.pathname);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.location.hash = tab;
        setTimeout(() => {
          const el = document.getElementById(tab);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 50);
      }
    }
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: `b-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const updateRoom = (updatedRoom: Room) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === updatedRoom.id ? updatedRoom : r))
    );
  };

  const updateRoom12hPrice = (roomId: string, price12h: number | null) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, price12h } : r))
    );
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
        activeTab,
        setActiveTab,
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
