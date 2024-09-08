import { useUser } from '@/pages/login/hooks/useUser';
import ImageDefault from '@/shared/components/ImageDefault';
import React from 'react';

type HeaderProps = {
  owesYou: number;
  youOwe: number;
};

const Header: React.FC<HeaderProps> = ({ owesYou, youOwe }) => {
  const queryUser = useUser();

  return (
    <section className='block  bg-zinc-800 pb-6'>
      <div className=' text-zinc-800 p-4 flex-row flex'>
        <div className='text-lg flex-row flex justify-between w-full items-center mb-4'>
          <span className='ml-2 place-content-center text-sm font-light text-gray-50'>
            <h2 className='text-lg font-bold'>
              Welcome {queryUser.data?.fullName}
            </h2>
            <p className='text-xs'>Make your expenses simple</p>
          </span>
          <div
            onClick={() => console.log('redirect to ')}
            className='cursor-pointer'
          >
            <ImageDefault name='John Doe' size={8} />
          </div>
        </div>
      </div>
      <div className='p-4'>
        <h2 className='text-sm font-medium text-gray-50'>Balance</h2>
        <span
          className={`text-lg font-semibold ${
            owesYou - youOwe < 0 ? 'text-red-500' : 'text-emerald-500'
          }`}
        >{`$${Math.abs(owesYou - youOwe)}`}</span>
      </div>
      <div className='flex flex-row min-h-14 w-full gap-8 px-4'>
        <div className='block flex-grow rounded-2xl  shadow-lg'>
          <div className='flex text-zinc-500 flex-col  text-center p-4'>
            <span className='text-sm font-light text-gray-50'>You owe</span>
            <span className='text-lg font-semibold text-primary-400'>{`$${youOwe}`}</span>
          </div>
        </div>
        <div className='block flex-grow rounded-2xl shadow-lg'>
          <div className='flex text-zinc-500 flex-col text-center p-4'>
            <span className='text-sm font-light text-gray-50'>Owes you</span>
            <span className='text-lg font-semibold text-primary-500'>{`$${owesYou}`}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
