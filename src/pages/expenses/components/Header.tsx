import { Expense } from '@/pages/home/types/expense';
import { useUser } from '@/pages/login/hooks/useUser';
import ImageDefault from '@/shared/components/ImageDefault';
import { ArrowLeft } from 'iconsax-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  expense: Expense;
}

const Header: React.FC<HeaderProps> = ({ expense }) => {
  const navigate = useNavigate();
  const { data: user } = useUser();

  return (
    <section className='bg-zinc-800 pb-2 min-h-1/4 flex flex-col'>
      <div className=' text-zinc-800 p-4 flex-row flex'>
        <div className='text-lg flex-row flex justify-between w-full items-center mb-4'>
          <span className='ml-2 place-content-center text-sm font-light text-gray-50'>
            <a
              href='#'
              className='flex flex-row items-center gap-1'
              onClick={() => navigate(-1)}
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
            <ImageDefault
              name={user?.fullName || 'User'}
              size={10}
              color={user?.color}
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col w-full animate-fade-up animate-duration-300 mt-4'>
        <span className='m-auto'>
          <ImageDefault
            size={16}
            name={expense.description}
            color={expense.color}
          />
        </span>
        <span>
          <h2 className='text-lg font-medium text-center text-gray-50 mt-2'>
            {expense.description}
          </h2>
        </span>
        <span>
          <p className='text-xs font-light text-center text-gray-50'>
            Total amount:{' '}
            <span className={`text-xs font-bold `}>
              ${Math.abs(parseFloat(expense.amount) || 0)}
            </span>
          </p>
        </span>
      </div>
    </section>
  );
};

export default Header;
