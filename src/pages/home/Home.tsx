import Content from '@/pages/home/components/Content';
import Header from '@/pages/home/components/Header';
import React from 'react';

const Home: React.FC = () => {
  return (
    <main className='max-h-[90vh] overflow-y-auto scrollbar-hide'>
      <Header />
      <hr className='my-4 border border-gray-100' />
      <Content />
    </main>
  );
};

export default Home;
