import BottomNavigator from '@/shared/components/BottomNavigator';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <section className='min-h-screen bg-white'>
      <Toaster
        containerStyle={{
          bottom: '70px',
        }}
        position='bottom-right'
        reverseOrder={false}
        toastOptions={{
          style: {
            boxShadow: 'none',
            borderRadius: '5px',
          },
        }}
      />
      <BottomNavigator />
      <Outlet />
    </section>
  );
};

export default MainLayout;
