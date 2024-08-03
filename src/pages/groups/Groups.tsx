import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { protectedApi } from '@/shared/services/request';
import { Group } from '@/pages/groups/types/group';

const Groups: React.FC = () => {
  const fetchGroups = async ({ pageParam }: { pageParam: number }) => {
    // Replace this with your actual API call to fetch groups
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
      console.log(lastPage.meta);
      return lastPage.meta.nextPageUrl
        ? lastPage.meta.currentPage + 1
        : undefined;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const groups = data?.pages.map(({ data }) => data).flat() as Group[];

  return (
    <div>
      <h1>Groups</h1>
      {groups?.map((group: Group) => (
        <div key={group.id}>
          <h2>{group.name}</h2>
          <p>{group.color}</p>
        </div>
      ))}
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'No More Data'}
      </button>
    </div>
  );
};

export default Groups;
