import { DirectboxNotif, Profile2User, Receipt } from 'iconsax-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const BottomNavigator: React.FC = () => {
  const location = useLocation();

  // Function to determine if a link is active
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className='box fixed bottom-0 left-0 z-50 bg-white h-16 w-full'>
      <div className='grid h-full grid-cols-3 w-1/2 mx-auto font-medium'>
        <Link
          to='/groups'
          className={`inline-flex flex-col items-center justify-center px-5 ${
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
            <Profile2User
              size='22'
              variant='Broken'
              className='text-zinc-700'
            />
          )}{' '}
        </Link>
        <Link
          to='/'
          className={`inline-flex flex-col items-center justify-center px-5 ${
            isActiveLink('/') ? 'active' : ''
          }`}
        >
          {isActiveLink('/') ? (
            <Receipt size='24' variant='Bold' className='text-primary-400' />
          ) : (
            <Receipt size='22' variant='Broken' className='text-zinc-700' />
          )}{' '}
        </Link>
        <Link
          to='/invitations'
          className={`inline-flex flex-col items-center justify-center px-5 ${
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
              className='text-zinc-700'
            />
          )}
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigator;
