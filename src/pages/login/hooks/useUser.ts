import { protectedApi } from '@/shared/services/request';
import { User } from '@/shared/types/user';
import { useQuery } from '@tanstack/react-query';

export enum QUERY_KEYS {
  USER = 'user',
}

export const useUser = () => {
  const fetchUser = async () => {
    const { data } = await protectedApi.get('user');
    return data;
  };

  return useQuery<User>({
    queryKey: [QUERY_KEYS.USER],
    queryFn: () => {
      return fetchUser();
    },
    enabled: false,
  });
};
