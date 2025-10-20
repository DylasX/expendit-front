import BottomNavigator from '@/shared/components/BottomNavigator';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <section className='h-screen-safe bg-zinc-800'>
      <Toaster
        containerStyle={{
          bottom: '70px',
        }}
        position='bottom-right'
        reverseOrder={false}
        toastOptions={{
          duration: 1500,
          style: {
            boxShadow: 'none',
            borderRadius: '5px',
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <BottomNavigator />
      <Outlet />
    </section>
  );
};

export default MainLayout;
