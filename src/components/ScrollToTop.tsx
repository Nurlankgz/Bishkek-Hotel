import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeTitles: Record<string, string> = {
  '/': 'Bishkek Hotel — 24/7 Мейманкана',
  '/rooms': 'Бөлмөлөр — Bishkek Hotel',
  '/booking': 'Брондоо — Bishkek Hotel',
  '/about': 'Отел жөнүндө — Bishkek Hotel',
  '/contact': 'Байланыш — Bishkek Hotel',
  '/admin': 'Админ-панель — Bishkek Hotel',
  '/spec': 'Техникалык Спецификация — Bishkek Hotel',
};

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.title = routeTitles[pathname] || 'Bishkek Hotel — 24/7 Мейманкана';
  }, [pathname]);

  return null;
};
