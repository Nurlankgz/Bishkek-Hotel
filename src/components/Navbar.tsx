import React, { useState, useRef, useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { Language } from '../types';
import { 
  Building2, 
  Calendar, 
  Phone, 
  ShieldCheck, 
  FileCode2, 
  Globe, 
  Menu, 
  X, 
  MapPin, 
  Clock,
  Sparkles,
  ChevronDown,
  Check
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t, activeTab, setActiveTab, settings } = useHotel();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string; flag: string; nativeName: string }[] = [
    { code: 'ky', label: 'KG', flag: '🇰🇬', nativeName: 'Кыргызча' },
    { code: 'ru', label: 'RU', flag: '🇷🇺', nativeName: 'Русский' },
    { code: 'en', label: 'EN', flag: '🇬🇧', nativeName: 'English' },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'home', label: t.navHome },
    { id: 'rooms', label: t.navRooms },
    { id: 'booking', label: t.navBooking },
    { id: 'about', label: t.navAbout },
    { id: 'contact', label: t.navContact },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#14161C]/95 backdrop-blur-md text-[#E0E0E0] border-b border-[#252936] shadow-xl">
      {/* Top utility bar */}
      <div className="bg-[#0F1115] border-b border-[#252936]/80 px-4 py-1.5 text-xs text-[#9CA3AF]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-[#C5A059] font-medium">
              <MapPin className="w-3.5 h-3.5" />
              {settings.address[language]}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[#9CA3AF]">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              {language === 'ky' ? '24/7 Ресепшн' : language === 'ru' ? 'Круглосуточный ресепшн 24/7' : '24/7 Front Desk'}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <a
              href={`tel:${settings.phones[0].replace(/\s/g, '')}`}
              className="flex items-center gap-1 hover:text-[#C5A059] transition-colors font-medium text-[#E0E0E0]"
            >
              <Phone className="w-3 h-3 text-[#C5A059]" />
              {settings.phones[0]}
            </a>
            <span className="text-[#252936]">|</span>
            <a
              href={`tel:${settings.phones[1].replace(/\s/g, '')}`}
              className="hidden md:inline-flex items-center gap-1 hover:text-[#C5A059] transition-colors font-medium text-[#E0E0E0]"
            >
              <Phone className="w-3 h-3 text-[#C5A059]" />
              {settings.phones[1]}
            </a>

            {/* Single Button Language Switcher with Dropdown */}
            <div className="relative ml-2" ref={langDropdownRef}>
              <button
                id="language-selector-btn"
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1F222A] hover:bg-[#252936] text-[#FAF8F5] border border-[#252936] hover:border-[#C5A059]/50 transition-all shadow-xs"
                title={language === 'ky' ? 'Тилди өзгөртүү' : language === 'ru' ? 'Сменить язык' : 'Change language'}
              >
                <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="flex items-center gap-1">
                  <span>{currentLang.flag}</span>
                  <span className="font-bold text-[#FAF8F5]">{currentLang.label}</span>
                </span>
                <ChevronDown className={`w-3 h-3 text-[#9CA3AF] transition-transform duration-200 ${langDropdownOpen ? 'rotate-180 text-[#C5A059]' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-[#14161C] border border-[#252936] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100 backdrop-blur-md">
                  {languages.map((l) => {
                    const isSelected = language === l.code;
                    return (
                      <button
                        key={l.code}
                        id={`lang-opt-${l.code}`}
                        type="button"
                        onClick={() => {
                          setLanguage(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                          isSelected
                            ? 'bg-[#C5A059]/15 text-[#C5A059] font-bold'
                            : 'text-[#E0E0E0] hover:bg-[#1F222A] hover:text-[#FAF8F5]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm">{l.flag}</span>
                          <span>{l.nativeName}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#A6823B] via-[#C5A059] to-[#E2BE78] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-[#0F1115]" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-[#FAF8F5] flex items-center gap-2 font-display">
              <span>Bishkek Hotel</span>
            </div>
            <p className="text-[11px] text-[#C5A059] tracking-wide font-sans font-medium">
              {language === 'ky' ? '24/7 Мейманкана' : language === 'ru' ? 'Отель 24/7' : '24/7 Hotel'}
            </p>
          </div>
        </button>

        {/* Desktop Nav Links - Only 5 clean items */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`px-3.5 py-2 text-sm rounded-lg font-medium transition-all ${
                activeTab === link.id
                  ? 'bg-[#1F222A] text-[#C5A059] border border-[#C5A059]/30 shadow-xs'
                  : 'text-[#9CA3AF] hover:text-[#FAF8F5] hover:bg-[#1F222A]/60'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Quick Book CTA button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleNavClick('booking')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold gold-gradient-btn shadow-md active:scale-95 transition-transform"
          >
            <Calendar className="w-4 h-4 text-[#0F1115]" />
            <span>{t.bookNowBtn}</span>
          </button>
        </div>

        {/* Mobile menu toggle button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => handleNavClick('booking')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold gold-gradient-btn flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t.navBooking}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#1F222A] border border-[#252936] text-[#E0E0E0] hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu - Clean and minimal */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#14161C] border-b border-[#252936] px-4 py-4 space-y-3">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === link.id
                    ? 'bg-[#C5A059] text-[#0F1115] font-bold'
                    : 'text-[#9CA3AF] hover:bg-[#1F222A] hover:text-[#E0E0E0]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#252936] flex items-center justify-between text-xs text-[#9CA3AF]">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{language === 'ky' ? 'Тил:' : language === 'ru' ? 'Язык:' : 'Language:'}</span>
            </div>
            <div className="flex items-center gap-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    language === l.code
                      ? 'bg-[#C5A059] text-[#0F1115] font-bold'
                      : 'bg-[#1F222A] text-[#9CA3AF] hover:text-[#FAF8F5] border border-[#252936]'
                  }`}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#252936] flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>{settings.address[language]}</span>
            <span className="text-[#C5A059] font-medium">0880 334 335</span>
          </div>
        </div>
      )}
    </header>
  );
};
