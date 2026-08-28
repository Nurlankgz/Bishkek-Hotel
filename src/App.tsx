/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HotelProvider } from './context/HotelContext';
import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatbotWidget } from './components/ChatbotWidget';
import { MobileActionBar } from './components/MobileActionBar';

import { HomePage } from './pages/HomePage';
import { RoomsPage } from './pages/RoomsPage';
import { BookingPage } from './pages/BookingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { SpecPage } from './pages/SpecPage';

export default function App() {
  return (
    <BrowserRouter>
      <HotelProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-[#0F1115] text-[#E0E0E0] selection:bg-[#C5A059] selection:text-[#0F1115] flex flex-col pb-24 md:pb-0">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/spec" element={<SpecPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
          <ChatbotWidget />
          <MobileActionBar />
        </div>
      </HotelProvider>
    </BrowserRouter>
  );
}
