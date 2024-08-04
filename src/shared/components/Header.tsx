import { useUser } from '@/pages/login/hooks/useUser';
import React from 'react';

type HeaderProps = {
  owesYou: number;
  youOwe: number;
};

const Header: React.FC<HeaderProps> = ({ owesYou, youOwe }) => {
  const queryUser = useUser();

  return (
    <section className='block bg-white rounded-lg'>
      <div className=' text-zinc-600 p-4 flex-row flex'>
        <div className='text-lg flex-row flex'>
          <img
            className='w-10 h-10 rounded-full'
            src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
            alt='user photo'
          />
          <span className='ml-2 place-content-end  text-sm font-light text-zinc-800'>
            <p className='font-semibold'>Hi {queryUser.data?.fullName}</p>
            <p className='font-extralight text-sm'>
              Make your expenses simple.
            </p>
          </span>
        </div>
      </div>
      <div className='p-4'>
        <h2 className='text-sm font-extralight'>Total Balance</h2>
        <span
          className={`text-lg font-semibold ${
            owesYou - youOwe < 0 ? 'text-red-500' : 'text-green-500'
          }`}
        >{`$${Math.abs(owesYou - youOwe)}`}</span>
      </div>
      <div className='flex flex-row min-h-14 w-full gap-8 px-4 mb-4'>
        <div className='block flex-grow rounded-xl  bg-teal-300 shadow'>
          <div className='flex text-zinc-500 flex-col  text-center p-4'>
            <span className='text-sm font-light text-black'>You owe</span>
            <span className='text-lg font-semibold text-black'>{`$${youOwe}`}</span>
          </div>
        </div>
        <div className='block flex-grow rounded-xl bg-teal-300 shadow'>
          <div className='flex text-zinc-500 flex-col text-center p-4'>
            <span className='text-sm font-light text-black'>Owes you</span>
            <span className='text-lg font-semibold text-black'>{`$${owesYou}`}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
