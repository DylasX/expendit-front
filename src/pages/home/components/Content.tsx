import { Expense } from '@/pages/home/types/expense';
import { protectedApi } from '@/shared/services/request';
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { formatDistance } from 'date-fns';
import { colors } from '@/shared/utils/color';
import Loader from '@/shared/components/Loader';

const Content: React.FC = () => {
  const { ref, inView } = useInView();

  const formatMoneyPayed = (expense: Expense) => {
    const amountByUser = parseFloat(expense.amountByUser);
    const amountToPay = amountByUser;
    return (
      <div
        className={`flex flex-col text-right ${
          amountToPay < 0 ? 'text-red-400' : 'text-primary-400'
        }`}
      >
        <span className='text-md'>${Math.abs(amountToPay)}</span>
        <span className='text-xs font-bold'>
          {amountToPay > 0 ? `You lent` : `You borrowed`}
        </span>
      </div>
    );
    return expense.amount;
  };

  const fetchExpenses = async ({ pageParam }: { pageParam: number }) => {
    const { data } = await protectedApi.get(`/user/expenses?page=${pageParam}`);
    return data;
  };

  const {
    data: data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['expenses'],
    // staleTime: 1000 * 60 * 5,
    queryFn: fetchExpenses,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextPageUrl
        ? lastPage.meta.currentPage + 1
        : undefined;
    },
    refetchOnWindowFocus: true,
  });

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const expenses = data?.pages.map(({ data }) => data).flat() as Expense[];

  return (
    <section className='flex flex-col bg-zinc-500 bg-opacity-10 rounded-2xl w-full min-h-[80vh] animate-fade-up animate-duration-300'>
      <div className='p-5 text-lg font-semibold text-left w-full  text-gray-50'>
        Expenses
        <p className='mt-1 text-xs font-medium text-gray-50 '>
          Most recent expenses.
        </p>
      </div>
      <ul className='flex-1 p-4 mb-5'>
        {expenses.length === 0 && (
          <li className='text-center text-xs text-gray-50 mt-4'>
            No expenses yet.
          </li>
        )}
        {expenses.map((expense, index) => (
          <li key={index} className='pb-3  p-4 mb-3 bg-zinc-800 rounded-xl'>
            <div className='flex items-center space-x-4'>
              <div className='flex-shrink-0'>
                <span
                  className={`rounded-full p-2 text-white w-10 h-10 flex items-center justify-center text-2xl`}
                  style={{ backgroundColor: colors[index % colors.length] }}
                >
                  {expense.emoji}
                </span>
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-normal truncate text-gray-50'>
                  {expense.description}
                </p>
                <p className='text-xs text-gray-50 truncate font-light '>
                  {formatDistance(new Date(expense.createdAt), new Date())}
                </p>
              </div>
              <div className='inline-flex items-center text-base font-normal'>
                {formatMoneyPayed(expense)}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {expenses.length ? (
        <span
          ref={ref}
          className='block text-xs text-center  text-gray-50 mb-2'
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Load More'
            : 'No more expenses to load'}
        </span>
      ) : (
        ''
      )}
    </section>
  );
};

export default Content;
