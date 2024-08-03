import { Activity, AddSquare, Profile2User, Share, User } from 'iconsax-react';
import React from 'react';
import { Link } from 'react-router-dom';

const BottomNavigator: React.FC = () => {
  //TODO: implement active link
  return (
    <div className='fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t-1 border-gray-500 rounded-lg'>
      <div className='grid h-full grid-cols-5 mx-auto font-medium'>
        <Link
          to='/groups'
          className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50  group'
          unstable_viewTransition
        >
          <Share size='22' variant='Broken' className='text-indigo-400' />
          <span className='text-xs font-light text-zinc-400 group-hover:text-indigo-300 '>
            Groups
          </span>
        </Link>
        <Link
          to='/groups'
          className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50  group'
          unstable_viewTransition
        >
          <Profile2User
            size='22'
            variant='Broken'
            className='text-indigo-400'
          />
          <span className='text-xs font-light text-zinc-400 group-hover:text-indigo-300 '>
            Friends
          </span>
        </Link>
        <Link
          to='/expenses'
          className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50  group'
          unstable_viewTransition
        >
          <AddSquare size='44' variant='Bold' className='text-indigo-400' />
        </Link>
        <Link
          to='/'
          className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50  group'
          unstable_viewTransition
        >
          <Activity size='22' variant='Broken' className='text-indigo-400' />
          <span className='text-xs font-light text-zinc-400 group-hover:text-indigo-300 '>
            Activity
          </span>
        </Link>
        <Link
          to='/expenses'
          className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50  group'
          unstable_viewTransition
        >
          <User size='22' variant='Broken' className='text-indigo-400' />
          <span className='text-xs font-light text-zinc-400 group-hover:text-indigo-300 '>
            Account
          </span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigator;
