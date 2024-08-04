import Content from '@/pages/home/components/Content';
import Header from '@/pages/home/components/Header';
import React from 'react';

const Home: React.FC = () => {
  return (
    <main className='max-h-[90vh] overflow-y-auto scrollbar-hide'>
      <Header />
      <Content />
    </main>
  );
};

export default Home;
