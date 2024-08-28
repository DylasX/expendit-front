import { useUser } from '@/pages/login/hooks/useUser';
import {
  Profile2User,
  ReceiptAdd,
  SmsNotification,
  UserOctagon,
} from 'iconsax-react';
import React from 'react';
import { useLocation } from 'react-router-dom';

type HeaderProps = {
  owesYou: number;
  youOwe: number;
  openDrawer: () => void;
};

const Header: React.FC<HeaderProps> = ({ owesYou, youOwe, openDrawer }) => {
  const location = useLocation();
  const queryUser = useUser();

  const renderIcon = () => {
    if (location.pathname === '/groups') {
      return (
        <div className='bg-primary-400 absolute right-[55px] rounded-full p-1'>
          <Profile2User size='22' className='text-zinc-800 ' variant='Bold' />
        </div>
      );
    }
    if (location.pathname === '/') {
      return (
        <div className='bg-primary-400 absolute right-[55px] rounded-full p-1'>
          <ReceiptAdd size='22' className='text-zinc-800 ' variant='Bold' />
        </div>
      );
    }
    return (
      <div className='bg-primary-400 absolute right-[55px] rounded-full p-1'>
        <SmsNotification size='22' className='text-zinc-800 ' variant='Bold' />
      </div>
    );
  };

  return (
    <section className='block  bg-zinc-800 pb-6'>
      <div className=' text-zinc-800 p-4 flex-row flex'>
        <div className='text-lg flex-row flex'>
          <span className='w-8 h-8 rounded-full bg-primary-400 flex justify-center items-center'>
            <UserOctagon size='22' className='text-zinc-800 ' variant='Bold' />
          </span>
          <span className='ml-2 place-content-center text-sm font-light text-gray-50'>
            <p className='font-medium'>{queryUser.data?.fullName}</p>
          </span>
        </div>
        <button
          className='ml-auto relative bg-slate-400 bg-opacity-10 flex flex-row items-center w-26 rounded-2xl p-2 px-4'
          onClick={openDrawer}
        >
          {renderIcon()}
          <span className='text-gray-50 text-xs font-medium ml-4 text-left'>
            {'New'}
          </span>
        </button>
      </div>
      <div className='p-4'>
        <h2 className='text-sm font-medium text-gray-50'>Total Balance</h2>
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
