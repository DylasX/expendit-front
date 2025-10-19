import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useGroup from './useGroup';

vi.mock('@/shared/services/request', () => ({
  protectedApi: {
    get: vi.fn(),
  },
}));

import { protectedApi } from '@/shared/services/request';

const mockGet = protectedApi.get as ReturnType<typeof vi.fn>;

describe('useGroup', () => {
  const mockGroupData = {
    id: 1,
    name: 'Test Group',
    color: '#FF0000',
    balanceTotal: 100,
    balances: [],
    users: [],
    expenses: [],
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

  it('should fetch group data successfully', async () => {
    mockGet.mockResolvedValue({ data: mockGroupData });

    const { result } = renderHook(() => useGroup(1), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockGroupData);
    expect(mockGet).toHaveBeenCalledWith('/groups/1');
  });

  it('should not fetch when groupId is 0', () => {
    const { result } = renderHook(() => useGroup(0), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('should handle fetch error', async () => {
    mockGet.mockRejectedValue(new Error('Failed to fetch group'));

    const { result } = renderHook(() => useGroup(1), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });

  it('should have retry disabled', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useGroup(1), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it('should be enabled only when groupId is truthy', () => {
    const { result: result1 } = renderHook(() => useGroup(0), { wrapper: createWrapper() });
    expect(result1.current.isLoading).toBe(false);

    const { result: result2 } = renderHook(() => useGroup(1), { wrapper: createWrapper() });
    expect(result2.current.isLoading).toBe(true);
  });
});
