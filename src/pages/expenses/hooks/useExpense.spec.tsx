import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useExpense from './useExpense';

vi.mock('@/shared/services/request', () => ({
  protectedApi: {
    get: vi.fn(),
  },
}));

import { protectedApi } from '@/shared/services/request';

const mockGet = protectedApi.get as ReturnType<typeof vi.fn>;

describe('useExpense', () => {
  const mockExpenseData = {
    id: 1,
    description: 'Test Expense',
    amount: '100',
    ownerUserId: 1,
    groupId: 1,
    color: '#FF0000',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it('should fetch expense data successfully', async () => {
    mockGet.mockResolvedValue({ data: mockExpenseData });

    const { result } = renderHook(() => useExpense(1), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockExpenseData);
    expect(mockGet).toHaveBeenCalledWith('/expenses/1');
  });

  it('should not fetch when expenseId is 0', () => {
    const { result } = renderHook(() => useExpense(0), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('should handle fetch error', async () => {
    mockGet.mockRejectedValue(new Error('Failed to fetch expense'));

    const { result } = renderHook(() => useExpense(1), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });

  it('should have retry disabled', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useExpense(1), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it('should be enabled only when expenseId is truthy', () => {
    const { result: result1 } = renderHook(() => useExpense(0), { wrapper: createWrapper() });
    expect(result1.current.isLoading).toBe(false);

    const { result: result2 } = renderHook(() => useExpense(1), { wrapper: createWrapper() });
    expect(result2.current.isLoading).toBe(true);
  });
});
