import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useHotel } from '../context/HotelContext';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  parentLabel?: string;
  parentPath?: string;
}

export const PageBanner: React.FC<PageBannerProps> = ({
  title,
  subtitle,
  badge,
  badgeIcon,
  parentLabel,
  parentPath = '/',
}) => {
  const { language } = useHotel();

  return (
    <div className="relative bg-[#0F1115] border-b border-[#252936] py-10 sm:py-12 overflow-hidden">
      {/* Subtle ambient gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-4 font-sans">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-[#C5A059] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{language === 'ky' ? 'Башкы бет' : language === 'ru' ? 'Главная' : 'Home'}</span>
          </Link>
          {parentLabel && (
            <>
              <ChevronRight className="w-3 h-3 text-[#4B5563]" />
              <Link
                to={parentPath}
                className="hover:text-[#C5A059] transition-colors"
              >
                {parentLabel}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-[#4B5563]" />
          <span className="text-[#FAF8F5] font-medium">{title}</span>
        </nav>

        {/* Badge */}
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs font-semibold uppercase tracking-widest font-sans mb-3">
            {badgeIcon}
            <span>{badge}</span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAF8F5] font-display">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm sm:text-base text-[#9CA3AF] mt-2 max-w-2xl font-sans leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
