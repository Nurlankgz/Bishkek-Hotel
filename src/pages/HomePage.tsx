import React, { useEffect } from 'react';
import { Hero } from '../components/Hero';
import { StayLogicBanner } from '../components/StayLogicBanner';
import { HomeRoomsPreview } from '../components/HomeRoomsPreview';
import { ReviewsSection } from '../components/ReviewsSection';

export const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Bishkek Hotel — 24/7 Мейманкана';
  }, []);

  return (
    <main>
      <Hero />
      <StayLogicBanner />
      <HomeRoomsPreview />
      <ReviewsSection />
    </main>
  );
};

