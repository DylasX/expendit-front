import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useGroups from './useGroups';

vi.mock('@/shared/services/request', () => ({
  protectedApi: {
    get: vi.fn(),
  },
}));

import { protectedApi } from '@/shared/services/request';

const mockGet = protectedApi.get as ReturnType<typeof vi.fn>;

describe('useGroups', () => {
  const mockGroupsPage1 = {
    data: [
      { id: 1, name: 'Group 1', color: '#FF0000' },
      { id: 2, name: 'Group 2', color: '#00FF00' },
    ],
    meta: {
      currentPage: 1,
      nextPageUrl: 'http://api.com/groups?page=2',
    },
  };

  const mockGroupsPage2 = {
    data: [{ id: 3, name: 'Group 3', color: '#0000FF' }],
    meta: {
      currentPage: 2,
      nextPageUrl: null,
    },
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

  it('should fetch groups successfully', async () => {
    mockGet.mockResolvedValue({ data: mockGroupsPage1 });

    const { result } = renderHook(() => useGroups(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.groups).toHaveLength(2);
    expect(result.current.groups[0].name).toBe('Group 1');
    expect(result.current.groups[1].name).toBe('Group 2');
  });

  it('should handle fetch error', async () => {
    mockGet.mockRejectedValue(new Error('Failed to fetch groups'));

    const { result } = renderHook(() => useGroups(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.error).toBeDefined());

    expect(result.current.groups).toBeUndefined();
  });

  it('should fetch next page when fetchNextPage is called', async () => {
    mockGet
      .mockResolvedValueOnce({ data: mockGroupsPage1 })
      .mockResolvedValueOnce({ data: mockGroupsPage2 });

    const { result } = renderHook(() => useGroups(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.groups).toHaveLength(2));

    expect(result.current.hasNextPage).toBe(true);

    result.current.fetchNextPage();

    await waitFor(() => expect(result.current.groups).toHaveLength(3));

    expect(result.current.groups[2].name).toBe('Group 3');
    expect(result.current.hasNextPage).toBe(false);
  });

  it('should flatten pages correctly', async () => {
    mockGet
      .mockResolvedValueOnce({ data: mockGroupsPage1 })
      .mockResolvedValueOnce({ data: mockGroupsPage2 });

    const { result } = renderHook(() => useGroups(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.groups).toHaveLength(2));

    result.current.fetchNextPage();

    await waitFor(() => expect(result.current.groups).toHaveLength(3));

    expect(result.current.groups.map((g) => g.id)).toEqual([1, 2, 3]);
  });

  it('should set hasNextPage to false when no more pages', async () => {
    mockGet.mockResolvedValue({
      data: mockGroupsPage1.data,
      meta: {
        currentPage: 1,
        nextPageUrl: null,
      },
    });

    const { result } = renderHook(() => useGroups(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.hasNextPage).toBe(false));
  });

  it('should handle empty groups list', async () => {
    mockGet.mockResolvedValue({
      data: {
        data: [],
        meta: {
          currentPage: 1,
          nextPageUrl: null,
        },
      },
    });

    const { result } = renderHook(() => useGroups(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.groups).toBeDefined();
    expect(result.current.groups).toHaveLength(0);
    expect(result.current.hasNextPage).toBe(false);
  });

  it('should call API with correct page parameter', async () => {
    mockGet
      .mockResolvedValueOnce({ data: mockGroupsPage1 })
      .mockResolvedValueOnce({ data: mockGroupsPage2 });

    const { result } = renderHook(() => useGroups(), { wrapper: createWrapper() });

    await waitFor(() => expect(mockGet).toHaveBeenCalledWith('/groups?page=1'));

    result.current.fetchNextPage();

    await waitFor(() => expect(mockGet).toHaveBeenCalledWith('/groups?page=2'));
  });
});
