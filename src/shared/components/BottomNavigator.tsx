import { Activity, AddSquare, Profile2User, Share, User } from 'iconsax-react';
import React from 'react';
import { Link } from 'react-router-dom';

const BottomNavigator: React.FC = () => {
  //TODO: implement active link
  return (
    <div className='box fixed bottom-0 left-0 z-50 w-full h-16 bg-white rounded-lg shadow-[rgba(0,0,15,0.5)_0px_0px_10px_-6px]'>
      <div className='grid h-full grid-cols-5 mx-auto font-medium'>
        <Link
          to='/groups'
          className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50  group'
          unstable_viewTransition
        >
          <Share size='22' variant='Broken' className='text-teal-400' />
          <span className='text-xs font-light text-zinc-600 group-hover:text-teal-300 '>
            Groups
          </span>
        </Link>
        <Link
          to='/groups'
          className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50  group'
          unstable_viewTransition
        >
          <Profile2User size='22' variant='Broken' className='text-teal-400' />
          <span className='text-xs font-light text-zinc-600 group-hover:text-teal-300 '>
            Friends
          </span>
        </Link>
        <Link
          to='/expenses'
          className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50  group'
          unstable_viewTransition
        >
          <AddSquare size='44' variant='Bold' className='text-teal-400' />
        </Link>
        <Link
          to='/'
          className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50  group'
          unstable_viewTransition
        >
          <Activity size='22' variant='Broken' className='text-teal-400' />
          <span className='text-xs font-light text-zinc-600 group-hover:text-teal-300 '>
            Activity
          </span>
        </Link>
        <Link
          to='/expenses'
          className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50  group'
          unstable_viewTransition
        >
          <User size='22' variant='Broken' className='text-teal-400' />
          <span className='text-xs font-light text-zinc-600 group-hover:text-teal-300 '>
            Account
          </span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigator;
