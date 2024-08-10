import React from 'react';

const Content: React.FC = () => {
  return (
    <section className='flex flex-col bg-slate-400 bg-opacity-10 rounded-2xl w-full min-h-[80vh]'>
      <div className='p-5 text-lg font-semibold text-left w-full mb-5'>
        Recent expenses.
        <p className='mt-1 text-sm font-light text-gray-500 '>
          Expenses from the last 30 days.
        </p>
      </div>
      <ul className='flex-1 divide-y  divide-gray-200 p-4'>
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index} className='pb-3 sm:pb-4 p-4 mb-3 bg-white rounded-xl'>
            <div className='flex items-center space-x-4 rtl:space-x-reverse'>
              <div className='flex-shrink-0'>
                <img
                  className='w-8 h-8 rounded-full'
                  src='https://flowbite.com/docs/images/people/profile-picture-1.jpg'
                  alt='Neil image'
                />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-normal  truncate '>Ice cream</p>
                <p className='text-sm text-gray-500 truncate font-light '>
                  July 3
                </p>
                <p className='text-xs text-gray-500 truncate font-light '>
                  You weren't included.
                </p>
              </div>
              <div className='inline-flex items-center text-base font-normal  '>
                $320
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Content;
