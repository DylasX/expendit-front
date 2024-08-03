import { useQueryClient } from '@tanstack/react-query';
import React, { ReactNode } from 'react';

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const queryClient = useQueryClient();
  return (
    <section className='bg-neutral-100 h-screen'>
      <button
        className='bg-red-500 text-white'
        onClick={() => {
          queryClient.clear();
          localStorage.removeItem('TOKEN-STORAGE');
          window.dispatchEvent(new Event('storage'));
        }}
      >
        Logout Test
      </button>
      <div className=''>{children}</div>
    </section>
  );
};

export default MainLayout;
