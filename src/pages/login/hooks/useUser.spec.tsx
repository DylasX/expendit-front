import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUser } from './useUser';

vi.mock('@/shared/services/request', () => ({
  protectedApi: {
    get: vi.fn(),
  },
}));

vi.mock('@/pages/login/utils/session', () => ({
  getToken: vi.fn(),
  saveToken: vi.fn(),
  removeToken: vi.fn(),
}));

import { protectedApi } from '@/shared/services/request';
import * as authStorage from '@/pages/login/utils/session';

const mockGet = protectedApi.get as ReturnType<typeof vi.fn>;
const mockGetToken = authStorage.getToken as ReturnType<typeof vi.fn>;

describe('useUser', () => {
  const mockUserData = {
    id: 1,
    fullName: 'Test User',
    email: 'test@example.com',
    color: '#FF0000',
    myCredit: [],
    myDebt: [],
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

  it('should fetch user data when token exists', async () => {
    mockGetToken.mockReturnValue('valid-token');
    mockGet.mockResolvedValue({ data: mockUserData });

    const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockUserData);
    expect(mockGet).toHaveBeenCalledWith('user');
  });

  it('should not fetch when token does not exist', () => {
    mockGetToken.mockReturnValue(undefined);

    const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('should handle fetch error', async () => {
    mockGetToken.mockReturnValue('valid-token');
    mockGet.mockRejectedValue(new Error('Failed to fetch user'));

    const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });

  it('should be enabled only when token exists', () => {
    mockGetToken.mockReturnValue(undefined);
    const { result: result1 } = renderHook(() => useUser(), { wrapper: createWrapper() });
    expect(result1.current.isLoading).toBe(false);

    mockGetToken.mockReturnValue('valid-token');
    const { result: result2 } = renderHook(() => useUser(), { wrapper: createWrapper() });
    expect(result2.current.isLoading).toBe(true);
  });

  it('should return user with credit and debt data', async () => {
    const userWithBalances = {
      ...mockUserData,
      myCredit: [{ amount: '50', id: 1 }],
      myDebt: [{ amount: '30', id: 2 }],
    };

    mockGetToken.mockReturnValue('valid-token');
    mockGet.mockResolvedValue({ data: userWithBalances });

    const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.myCredit).toHaveLength(1);
    expect(result.current.data?.myDebt).toHaveLength(1);
  });
});
