import BottomNavigator from '@/shared/components/BottomNavigator';
import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <section className='bg-white min-h-screen p-3'>
      <BottomNavigator />
      <Outlet />
    </section>
  );
};

export default MainLayout;
