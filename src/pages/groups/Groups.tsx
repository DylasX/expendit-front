import { Group } from '@/pages/groups/types/group';
import { useInView } from 'react-intersection-observer';
import Header from '@/shared/components/Header';
import { useUser } from '@/pages/login/hooks/useUser';
import React from 'react';
import Drawer from '@/shared/components/Drawer';
import GroupForm from '@/pages/groups/components/GroupForm';
import useGroup from '@/pages/groups/hooks/group';
import GroupList from '@/pages/groups/components/GroupList';

const Groups: React.FC = () => {
  const { ref, inView } = useInView();
  const { data: user } = useUser();
  const [open, setOpen] = React.useState(false);
  const {
    error,
    fetchNextPage,
    groups,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGroup();

  const renderOwesYou = (group: Group) =>
    group.balances?.length
      ? group.balances.map((balance) => (
          <span key={balance.id + 'balance'}>
            {parseFloat(balance.amount) > 0 ? (
              balance.debtUserRelated === user?.id ? (
                <p>{`You owe to ${balance.user.fullName}`}</p>
              ) : (
                <p>{`${balance.debtUser.fullName} owes to you`}</p>
              )
            ) : (
              'Settled up'
            )}
          </span>
        ))
      : `Settled up`;

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

  const onClose = () => {
    setOpen(false);
  };

  return (
    <main className='overflow-y-auto scrollbar-hide'>
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
        openDrawer={() => setOpen(true)}
      />
      <section className='flex flex-col bg-slate-400 bg-opacity-10 rounded-2xl w-full min-h-[75vh] animate-fade-up'>
        <div className='p-5 text-lg font-semibold text-left w-full mb-5'>
          Groups
          <p className='mt-1 text-sm font-light text-gray-500 '>
            Sorted by most recent activity.
          </p>
        </div>
        <GroupList
          groups={groups}
          renderOwesYou={renderOwesYou}
          className='p-4'
        />
        {groups.length ? (
          <span
            ref={ref}
            className='block text-xs text-center  text-gray-500 mb-2'
          >
            {isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
              ? 'Load More'
              : 'No more groups to load'}
          </span>
        ) : (
          ''
        )}
      </section>
      <Drawer isFullScreen={true} open={open} onClose={onClose}>
        <GroupForm onClose={onClose} />
      </Drawer>
    </main>
  );
};

export default Groups;
