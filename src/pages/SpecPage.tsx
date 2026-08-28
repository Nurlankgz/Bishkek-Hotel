import React, { useEffect } from 'react';
import { SpecDocViewer } from '../components/SpecDocViewer';

export const SpecPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Техникалык Спецификация — Bishkek Hotel';
  }, []);

  return (
    <main>
      <SpecDocViewer />
    </main>
  );
};
