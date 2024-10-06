import { protectedApi } from '@/shared/services/request';
import { useQuery } from '@tanstack/react-query';

const useExpense = (expenseId: number) => {
  const fetchExpense = async () => {
    const { data } = await protectedApi.get(`/expenses/${expenseId}`);
    return data;
  };

  return useQuery({
    queryKey: ['expense', expenseId],
    queryFn: fetchExpense,
    enabled: !!expenseId,
    retry: 0,
  });
};

export default useExpense;
