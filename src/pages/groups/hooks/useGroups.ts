import { Group } from '@/pages/groups/types/group';
import { protectedApi } from '@/shared/services/request';
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchGroups = async ({ pageParam }: { pageParam: number }) => {
  const { data } = await protectedApi.get(`/groups?page=${pageParam}`);
  return data;
};

const useGroups = () => {
  const {
    data: data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['groups'],
    // staleTime: 1000 * 60 * 5,
    queryFn: fetchGroups,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextPageUrl
        ? lastPage.meta.currentPage + 1
        : undefined;
    },
    refetchOnWindowFocus: true,
  });

  const groups = data?.pages.map(({ data }) => data).flat() as Group[];

  return {
    groups,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useGroups;
