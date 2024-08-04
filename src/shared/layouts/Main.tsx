import BottomNavigator from '@/shared/components/BottomNavigator';
import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <section className='bg-neutral-50 min-h-screen p-3'>
      <BottomNavigator />
      <Outlet />
    </section>
  );
};

export default MainLayout;
