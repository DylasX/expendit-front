import ExpenseForm from '@/pages/home/components/ExpenseForm';
import { Expense } from '@/pages/home/types/expense';
import { useUser } from '@/pages/login/hooks/useUser';
import Drawer from '@/shared/components/Drawer';
import Header from '@/shared/components/Header';
import ImageDefault from '@/shared/components/ImageDefault';
import Loader from '@/shared/components/Loader';
import { protectedApi } from '@/shared/services/request';
import { useInfiniteQuery } from '@tanstack/react-query';
import { formatDistance } from 'date-fns';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { data: user } = useUser();
  const [open, setOpen] = React.useState(false);
  const { ref, inView } = useInView();
  const navigate = useNavigate();

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

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load expenses';
    if (errorMessage.includes('CancelledError')) {
      return null;
    }
    return <div>Error: {errorMessage}</div>;
  }

  const expenses = data?.pages.map(({ data }) => data).flat() as Expense[];

  const onClose = () => {
    setOpen(false);
  };
  return (
    <main
      className={`overflow-y-auto scrollbar-hide h-screen ${
        open ? 'fixed' : 'block'
      }`}
    >
      <Header
        owesYou={
          user?.myCredit?.reduce(
            (acc, acum) => acc + parseFloat(acum.amount),
            0
          ) || 0
        }
        youOwe={
          user?.myDebt?.reduce(
            (acc, acum) => acc + parseFloat(acum.amount),
            0
          ) || 0
        }
      />{' '}
      {isLoading ? (
        <Loader />
      ) : (
        <section className='bg-zinc-500/10 rounded-2xl w-full min-h-[70%] animate-fade-up animate-duration-300'>
          <div className='p-5 text-lg font-semibold text-left w-full  text-gray-50'>
            <div className='flex flex-row justify-between'>
              <h2>Expenses</h2>
              <button
                onClick={() => setOpen(true)}
                className='text-sm text-primary-400 flex flex-row items-center'
              >
                New expense
              </button>
            </div>
            <p className='mt-1 text-xs font-medium text-gray-50 '>
              Most recent expenses.
            </p>
          </div>
          <ul className='p-4 mb-5'>
            {expenses.length === 0 && (
              <li className='text-center text-xs text-gray-50 mt-4'>
                No expenses yet.
              </li>
            )}
            {expenses.map((expense, index) => (
              <li key={index} className='pb-3  p-4 mb-3 bg-zinc-800 rounded-xl'>
                <a
                  onClick={() => navigate(`/expense/${expense.id}`)}
                  className='flex items-center space-x-4'
                >
                  <div className='flex-shrink-0'>
                    <ImageDefault
                      name={expense.description}
                      color={expense.color}
                    />
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
                </a>
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
      )}
      <Drawer isFullScreen={true} open={open} onClose={onClose}>
        <ExpenseForm onClose={onClose} />
      </Drawer>
    </main>
  );
};

export default Home;
