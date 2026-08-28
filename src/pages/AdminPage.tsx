import React, { useEffect } from 'react';
import { AdminPanel } from '../components/AdminPanel';

export const AdminPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Админ-панель — Bishkek Hotel';
  }, []);

  return (
    <main>
      <AdminPanel />
    </main>
  );
};
