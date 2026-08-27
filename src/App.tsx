/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StayLogicBanner } from './components/StayLogicBanner';
import { RoomsSection } from './components/RoomsSection';
import { BookingWizard } from './components/BookingWizard';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationSection } from './components/LocationSection';
import { ContactSection } from './components/ContactSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { ChatbotWidget } from './components/ChatbotWidget';
import { AdminPanel } from './components/AdminPanel';
import { SpecDocViewer } from './components/SpecDocViewer';

const HotelAppContent: React.FC = () => {
  const { activeTab } = useHotel();

  if (activeTab === 'admin') {
    return (
      <div className="min-h-screen bg-[#0F1115] text-[#E0E0E0] selection:bg-[#C5A059] selection:text-[#0F1115]">
        <Navbar />
        <AdminPanel />
        <ChatbotWidget />
      </div>
    );
  }

  if (activeTab === 'spec') {
    return (
      <div className="min-h-screen bg-[#0F1115] text-[#E0E0E0] selection:bg-[#C5A059] selection:text-[#0F1115]">
        <Navbar />
        <SpecDocViewer />
        <ChatbotWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E0E0E0] selection:bg-[#C5A059] selection:text-[#0F1115]">
      <Navbar />
      <Hero />
      <StayLogicBanner />
      <RoomsSection />
      <BookingWizard />
      <AboutSection />
      <GallerySection />
      <ReviewsSection />
      <LocationSection />
      <ContactSection />
      <FAQSection />
      <Footer />
      <ChatbotWidget />
    </div>
  );
};

export default function App() {
  return (
    <HotelProvider>
      <HotelAppContent />
    </HotelProvider>
  );
}

