import {
  Add,
  DirectboxNotif,
  Profile2User,
  Receipt1,
  User,
} from 'iconsax-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

const BottomNavigator: React.FC = () => {
  const location = useLocation();

  const classMargin = Capacitor.getPlatform() !== 'web' ? 'mb-4' : '';

  // Function to determine if a link is active
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`box fixed bottom-0 left-0 z-50 bg-zinc-800 ${
        Capacitor.getPlatform() === 'web' ? 'h-16' : 'h-20'
      } w-full`}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom) - 0.5rem',
      }}
    >
      <div className={`grid h-full grid-cols-5 w-full mx-auto font-medium`}>
        <Link
          to='/groups'
          className={`inline-flex flex-col items-center justify-center ${classMargin} px-5 ${
            isActiveLink('/groups') ? 'active' : ''
          }`}
        >
          {isActiveLink('/groups') ? (
            <Profile2User
              size='24'
              variant='Bold'
              className='text-primary-400'
            />
          ) : (
            <Profile2User size='22' variant='Broken' className='text-gray-50' />
          )}{' '}
        </Link>
        <Link
          to='/'
          className={`inline-flex flex-col items-center justify-center ${classMargin} px-5 ${
            isActiveLink('/') ? 'active' : ''
          }`}
        >
          {isActiveLink('/') ? (
            <Receipt1 size='24' variant='Bold' className='text-primary-400' />
          ) : (
            <Receipt1 size='22' variant='Broken' className='text-gray-50' />
          )}{' '}
        </Link>
        <Link
          to='/add'
          className={`inline-flex flex-col items-center justify-center ${classMargin} px-5 ${
            isActiveLink('/add') ? 'active' : ''
          }`}
        >
          {isActiveLink('/add') ? (
            <Add size='32' className='text-primary-400' />
          ) : (
            <Add size='30' variant='Broken' className='text-gray-50' />
          )}
        </Link>
        <Link
          to='/invitations'
          className={`inline-flex flex-col items-center justify-center ${classMargin} px-5 ${
            isActiveLink('/invitations') ? 'active' : ''
          }`}
        >
          {isActiveLink('/invitations') ? (
            <DirectboxNotif
              size='24'
              variant='Bold'
              className='text-primary-400'
            />
          ) : (
            <DirectboxNotif
              size='22'
              variant='Broken'
              className='text-gray-50'
            />
          )}
        </Link>
        <Link
          to='/profile'
          className={`inline-flex flex-col items-center justify-center ${classMargin} px-5 ${
            isActiveLink('/profile') ? 'active' : ''
          }`}
        >
          {isActiveLink('/profile') ? (
            <User size='24' variant='Bold' className='text-primary-400' />
          ) : (
            <User size='22' variant='Broken' className='text-gray-50' />
          )}
        </Link>
        {/* //TODO: Create an add Button to handle with a drawer or modal what the user want to create to have the possibility to create a new group, expense or invitation */}
      </div>
    </div>
  );
};

export default BottomNavigator;
