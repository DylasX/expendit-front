import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { protectedApi } from '@/shared/services/request';
import { Group } from '@/pages/groups/types/group';
import { useInView } from 'react-intersection-observer';
import Header from '@/shared/components/Header';
import { useUser } from '@/pages/login/hooks/useUser';

const Groups: React.FC = () => {
  const { ref, inView } = useInView();
  const { data: user } = useUser();

  //TODO: add searh group and sorting modal

  const renderOwesYou = (group: Group) =>
    group.balances.length
      ? group.balances.map((balance) => (
          <span key={balance.id + 'balance'}>
            {parseFloat(balance.amount) > 0 ? (
              balance.debtUserRelated === user?.id ? (
                <p>{`You owe to ${balance.user.fullName}`}</p>
              ) : (
                <p>{`${balance.debtUser.fullName} owes to you`}</p>
              )
            ) : (
              ''
            )}
          </span>
        ))
      : 'With no debts';

  const fetchGroups = async ({ pageParam }: { pageParam: number }) => {
    const { data } = await protectedApi.get(`/groups?page=${pageParam}`);
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
    queryKey: ['groups'],
    queryFn: fetchGroups,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextPageUrl
        ? lastPage.meta.currentPage + 1
        : undefined;
    },
  });

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const groups = data?.pages.map(({ data }) => data).flat() as Group[];

  return (
    <main className='max-h-[90vh] overflow-y-auto scrollbar-hide'>
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
      />
      <hr className='my-4 border border-gray-100' />
      <section className='flex flex-col bg-white  rounded-lg mt-4 w-full'>
        <div className='p-5 text-lg font-semibold text-left w-full mb-5'>
          Groups
          <p className='mt-1 text-sm font-light text-gray-500 '>
            Sorted by most recent activity.
          </p>
        </div>
        <ul className='flex-1 divide-y  divide-gray-200 p-4'>
          {groups?.map((group: Group) => (
            <li key={group.id + 'group'} className='pb-3 pt-3 sm:pb-4'>
              <div className='flex items-center space-x-4 rtl:space-x-reverse'>
                <div className='flex-shrink-0'>
                  <img
                    className='w-8 h-8 rounded-full'
                    src='https://flowbite.com/docs/images/people/profile-picture-1.jpg'
                    alt='Neil image'
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-normal  truncate '>{group.name}</p>
                  <span className='text-xs text-gray-500 truncate font-light '>
                    {renderOwesYou(group)}
                  </span>
                </div>
                <div
                  className={`inline-flex items-center text-base font-normal ${
                    group.balanceTotal < 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {/* check if amount is - to change color */}
                  {`$${Math.abs(group.balanceTotal) || 0}`}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <button
        ref={ref}
        className='text-xs flex m-auto text-gray-500'
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'No more groups to load'}
      </button>
    </main>
  );
};

export default Groups;
