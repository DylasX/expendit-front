import { protectedApi } from '@/shared/services/request';
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import { useInView } from 'react-intersection-observer';

const Invitations: React.FC = () => {
  const { ref, inView } = useInView();

  const getInvitations = async ({ pageParam }: { pageParam: number }) => {
    const { data } = await protectedApi.get(
      `user/invitations?page=${pageParam}`
    );
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
    queryKey: ['invitations'],
    queryFn: getInvitations,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextPageUrl
        ? lastPage.meta.currentPage + 1
        : undefined;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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

  const invitations = data?.pages.map(({ data }) => data).flat();

  return (
    <div>
      <h1>Invitations Page</h1>
      {/* Add your invitations content here */}
      {invitations?.map((invitation) => (
        <p>{invitation.id}</p>
      ))}
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
    </div>
  );
};

export default Invitations;
