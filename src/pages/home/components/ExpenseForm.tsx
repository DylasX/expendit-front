import useGroup from '@/pages/groups/hooks/group';
import { Group } from '@/pages/groups/types/group';
import { DollarCircle, Message } from 'iconsax-react';
import React from 'react';
import { useInView } from 'react-intersection-observer';

interface ExpenseFormProps {
  onClose: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = () => {
  const [selectedGroup, setSelectedGroup] = React.useState({} as Group);
  const { ref, inView } = useInView();
  const { groups, isFetchingNextPage, hasNextPage, fetchNextPage } = useGroup();

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <section className='p-4'>
      <h2 className='text-lg font-semibold text-zinc-700 mb-4'>New expense </h2>
      <div className='flex flex-col bg-opacity-10 rounded-2xl w-full animate-fade-up'>
        {!selectedGroup.id ? (
          <>
            <h3 className='text-sm font-extralight text-gray-500 mb-1'>
              Select a group
            </h3>
            <ul className='flex flex-col flex-wrap mt-4'>
              {groups.length === 0 && (
                <li className='text-center text-xs text-gray-500 mt-4'>
                  No groups yet.
                </li>
              )}
              {groups?.map((group: Group, index: number) => (
                <li
                  key={group.id + group.name + index}
                  className='bg-white rounded-xl mb-4'
                >
                  <a
                    className='flex flex-row justify-start items-center'
                    href='#'
                    onClick={() => setSelectedGroup(group)}
                  >
                    <span
                      className={`rounded-full p-2 text-white w-10 h-10 flex items-center justify-center text-2xl`}
                      style={{ backgroundColor: group.color }}
                    >
                      {group.emoji}
                    </span>
                    <span className='text-md font-light ml-4 text-zinc-500'>
                      {group.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {groups.length ? (
              <span
                ref={ref}
                className='block text-xs font-extralight text-center  text-zinc-400 mb-2'
              >
                {isFetchingNextPage
                  ? 'Loading more...'
                  : hasNextPage
                  ? 'Scroll to load more'
                  : 'No more groups'}
              </span>
            ) : (
              ''
            )}
          </>
        ) : (
          <section>
            <div className='flex flex-col items-center mt-4'>
              <span
                className={`rounded-full p-2 text-white w-16 h-16 flex items-center justify-center text-5xl animate-fade-up`}
                style={{ backgroundColor: selectedGroup.color }}
              >
                {selectedGroup.emoji}
              </span>
              <span className='capitalize font-light text-md'>
                {selectedGroup.name}
              </span>
              <hr className='my-4 border-t border-gray-100 w-full' />
            </div>
            <div>
              <form className='max-w-sm mx-auto'>
                <label
                  htmlFor='description'
                  className='block mb-2 text-sm font-light text-gray-900 dark:text-white'
                >
                  Description
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none'>
                    <Message className='w-5 h-5 text-gray-400' />
                  </div>
                  <input
                    type='text'
                    id='description'
                    className='bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5  '
                    placeholder='Coffee with friends'
                  />
                </div>
                <label
                  htmlFor='amount'
                  className='block mb-2 text-sm font-light text-gray-900 dark:text-white'
                >
                  Amount
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none'>
                    <DollarCircle className='w-5 h-5 text-gray-400' />
                  </div>
                  <input
                    type='text'
                    id='amount'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5  '
                    placeholder='10.000'
                  />
                </div>
              </form>
            </div>
          </section>
        )}
      </div>
    </section>
  );
};

export default ExpenseForm;
