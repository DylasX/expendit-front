import BottomNavigator from '@/shared/components/BottomNavigator';
import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <section className='min-h-screen bg-white'>
      <BottomNavigator />
      <Outlet />
    </section>
  );
};

export default MainLayout;
