import Content from '@/pages/home/components/Content';
import { useUser } from '@/pages/login/hooks/useUser';
import Header from '@/shared/components/Header';
import React from 'react';

const Home: React.FC = () => {
  const { data: user } = useUser();
  return (
    <main className='overflow-y-auto scrollbar-hide'>
      <Header
        owesYou={
          user?.myCredit?.reduce(
            (acc, acum) => acc + parseFloat(acum.amount),
            0
          ) || 0
        }
        youOwe={
          user?.myDebt?.reduce(
            (acc, acum) => acc + parseFloat(acum.amount),
            0
          ) || 0
        }
      />{' '}
      <Content />
    </main>
  );
};

export default Home;
