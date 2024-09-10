import { protectedApi } from '@/shared/services/request';
import { useQuery } from '@tanstack/react-query';

const useGroup = (groupId: number) => {
  const fetchGroup = async () => {
    const { data } = await protectedApi.get(`/groups/${groupId}`);
    return data;
  };

  return useQuery({
    queryKey: ['group', groupId],
    queryFn: fetchGroup,
    enabled: !!groupId,
    retry: 0,
  });
};

export default useGroup;
