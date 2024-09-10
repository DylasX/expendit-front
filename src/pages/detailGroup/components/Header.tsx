import { Group } from '@/pages/groups/types/group';
import ImageDefault from '@/shared/components/ImageDefault';
import { ArrowLeft } from 'iconsax-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  group: Group;
}

const Header: React.FC<HeaderProps> = ({ group }) => {
  const navigate = useNavigate();

  return (
    <section className='block  bg-zinc-800 pb-2'>
      <div className=' text-zinc-800 p-4 flex-row flex'>
        <div className='text-lg flex-row flex justify-between w-full items-center mb-4'>
          <span className='ml-2 place-content-center text-sm font-light text-gray-50'>
            <a
              href='#'
              className='flex flex-row items-center gap-1'
              onClick={() => navigate('/groups')}
            >
              <>
                <ArrowLeft size='20' className='text-primary-400' />
                <h2 className='text-lg font-semibold text-gray-50 ml-2'>
                  Back
                </h2>
              </>
            </a>
          </span>
          <div
            onClick={() => console.log('redirect to ')}
            className='cursor-pointer'
          >
            <ImageDefault name='John Doe' size={10} color={group.color} />
          </div>
        </div>
      </div>
      <div className='flex flex-col w-full animate-fade-up animate-duration-300 mt-4'>
        <span className='m-auto'>
          <ImageDefault size={16} name={group.name} color={group.color} />
        </span>
        <span>
          <h2 className='text-lg font-medium text-center text-gray-50 mt-2'>
            {group.name}
          </h2>
        </span>
        <span>
          <p className='text-xs font-light text-center text-gray-50'>
            Total balance:{' '}
            <span
              className={`text-xs font-bold ${
                group.balanceTotal < 0 ? 'text-red-400' : 'text-primary-400'
              }`}
            >
              ${Math.abs(group.balanceTotal || 0)}
            </span>
          </p>
        </span>
        <span className='p-4 flex flex-row gap-4 w-full'>
          <button
            className='bg-primary-400 text-white px-4 py-2 w-auto text-xs rounded-lg'
            type='button'
          >
            Settle up
          </button>
          {/* <button
            className='border-primary-400 border text-primary-400 px-4 py-2 w-auto text-xs rounded-lg'
            type='button'
          >
            Reports
          </button> */}
        </span>
      </div>
    </section>
  );
};

export default Header;
