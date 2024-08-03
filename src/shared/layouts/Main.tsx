import { useUser } from '@/pages/login/hooks/useUser';
import BottomNavigator from '@/shared/components/BottomNavigator';
import { protectedApi } from '@/shared/services/request';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const queryClient = useQueryClient();
  const userQuery = useUser();

  return (
    <section className='bg-neutral-100 min-h-screen h-full'>
      <button
        className='bg-red-500 text-white'
        onClick={() => {
          protectedApi.post('/auth/logout').then(() => {
            queryClient.clear();
            localStorage.removeItem('TOKEN-STORAGE');
            window.dispatchEvent(new Event('storage'));
          });
        }}
      >
        Logout Test {userQuery.data?.id}
      </button>
      <BottomNavigator />
      <Outlet />
    </section>
  );
};

export default MainLayout;
