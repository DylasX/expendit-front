import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthInterceptor from './Auth';

vi.mock('@/pages/login/hooks/useUser');
vi.mock('@/pages/login/utils/session', () => ({
  getToken: vi.fn(),
  removeToken: vi.fn(),
  saveToken: vi.fn(),
}));

import { useUser } from '@/pages/login/hooks/useUser';
import * as authStorage from '@/pages/login/utils/session';

const mockUseUser = useUser as ReturnType<typeof vi.fn>;
const mockGetToken = authStorage.getToken as ReturnType<typeof vi.fn>;

describe('AuthInterceptor', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  const renderComponent = (children: React.ReactNode = <div>Test Child</div>) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthInterceptor>{children}</AuthInterceptor>
      </QueryClientProvider>
    );
  };

  it('should render children', () => {
    mockUseUser.mockReturnValue({
      data: { id: 1, fullName: 'Test User' },
      refetch: vi.fn(),
    });
    mockGetToken.mockReturnValue('test-token');

    const { getByText } = renderComponent(<div>Test Child</div>);

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('should refetch user when token exists but user data is missing', async () => {
    const mockRefetch = vi.fn();
    mockUseUser.mockReturnValue({
      data: null,
      refetch: mockRefetch,
    });
    mockGetToken.mockReturnValue('test-token');

    renderComponent();

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('should not refetch when user data exists', () => {
    const mockRefetch = vi.fn();
    mockUseUser.mockReturnValue({
      data: { id: 1, fullName: 'Test User' },
      refetch: mockRefetch,
    });
    mockGetToken.mockReturnValue('test-token');

    renderComponent();

    expect(mockRefetch).not.toHaveBeenCalled();
  });

  it('should not refetch when no token exists', () => {
    const mockRefetch = vi.fn();
    mockUseUser.mockReturnValue({
      data: null,
      refetch: mockRefetch,
    });
    mockGetToken.mockReturnValue(null);

    renderComponent();

    expect(mockRefetch).not.toHaveBeenCalled();
  });

  it('should clear query client and redirect when storage event fires without token', async () => {
    const mockClear = vi.spyOn(queryClient, 'clear');
    mockUseUser.mockReturnValue({
      data: { id: 1, fullName: 'Test User' },
      refetch: vi.fn(),
    });
    mockGetToken.mockReturnValue(null);

    renderComponent();

    // Simulate storage event
    window.dispatchEvent(new Event('storage'));

    await waitFor(() => {
      expect(mockClear).toHaveBeenCalled();
      expect(window.location.href).toBe('/login');
    });
  });

  it('should not redirect when storage event fires with valid token', () => {
    const mockClear = vi.spyOn(queryClient, 'clear');
    mockUseUser.mockReturnValue({
      data: { id: 1, fullName: 'Test User' },
      refetch: vi.fn(),
    });
    mockGetToken.mockReturnValue('valid-token');

    renderComponent();

    // Simulate storage event
    window.dispatchEvent(new Event('storage'));

    expect(mockClear).not.toHaveBeenCalled();
    expect(window.location.href).toBe('');
  });

  it('should cleanup storage event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    mockUseUser.mockReturnValue({
      data: { id: 1, fullName: 'Test User' },
      refetch: vi.fn(),
    });
    mockGetToken.mockReturnValue('test-token');

    const { unmount } = renderComponent();

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
  });
});
