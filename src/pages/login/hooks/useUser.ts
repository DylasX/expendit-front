import { protectedApi } from '@/shared/services/request';
import { User } from '@/shared/types/user';
import { useQuery } from '@tanstack/react-query';
import * as authStorage from '@/pages/login/utils/session';

export const useUser = () => {
  const fetchUser = async () => {
    const { data } = await protectedApi.get('user');
    return data;
  };

  return useQuery<User>({
    queryKey: ['user'],
    queryFn: () => {
      return fetchUser();
    },
    enabled: authStorage.getToken() ? true : false,
    refetchOnWindowFocus: true,
  });
};
