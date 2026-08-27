import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { GalleryItem } from '../types';
import { Image as ImageIcon, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { gallery, language, t } = useHotel();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: t.catAll },
    { id: 'exterior', label: t.catExterior },
    { id: 'reception', label: t.catReception },
    { id: 'rooms', label: t.catRooms },
    { id: 'bathroom', label: t.catBathroom },
    { id: 'lobby', label: t.catLobby },
  ];

  const filteredItems = gallery.filter((item) =>
    selectedCategory === 'all' ? true : item.category === selectedCategory
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const prevPhoto = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const nextPhoto = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  };

  return (
    <section id="gallery" className="py-20 bg-[#0F1115] text-[#E0E0E0] relative border-b border-[#252936]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-xs font-semibold uppercase tracking-widest mb-2 border border-[#C5A059]/25 font-sans">
            <ImageIcon className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{t.galleryTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#FAF8F5] font-display">
            {t.galleryTitle}
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-2 font-sans">
            {t.gallerySubtitle}
          </p>

          {/* Categories Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#C5A059] text-[#0F1115] font-bold shadow'
                    : 'bg-[#14161C] text-[#9CA3AF] hover:text-[#FAF8F5] border border-[#252936]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer bg-[#14161C] border border-[#252936] shadow-md hover:shadow-2xl hover:border-[#C5A059]/40 transition-all"
            >
              <img
                src={item.image}
                alt={item.title[language]}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115]/90 via-[#0F1115]/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider block">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#FAF8F5] mt-0.5 font-display">
                    {item.title[language]}
                  </h4>
                </div>
                <span className="w-8 h-8 rounded-full bg-[#1F222A]/80 border border-[#252936] text-[#C5A059] flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow">
                  🔍
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#1F222A] text-[#FAF8F5] flex items-center justify-center hover:bg-[#252936] transition-colors z-50 border border-[#252936]"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1F222A] text-[#FAF8F5] flex items-center justify-center hover:bg-[#252936] transition-colors z-50 border border-[#252936]"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1F222A] text-[#FAF8F5] flex items-center justify-center hover:bg-[#252936] transition-colors z-50 border border-[#252936]"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
              <img
                src={filteredItems[lightboxIndex].image}
                alt={filteredItems[lightboxIndex].title[language]}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-[#252936]"
              />
              <div className="text-center mt-3 text-white">
                <h3 className="font-bold text-base font-display text-[#FAF8F5]">{filteredItems[lightboxIndex].title[language]}</h3>
                <p className="text-xs text-[#9CA3AF]">
                  {lightboxIndex + 1} / {filteredItems.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
