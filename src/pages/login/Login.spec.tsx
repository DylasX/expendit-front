import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';

// Mock dependencies
vi.mock('@/pages/login/hooks/useUser');
vi.mock('@/pages/login/components/LoginForm', () => ({
  default: ({ switchTabs, setIsLoading }: any) => (
    <div data-testid="login-form">
      <button onClick={switchTabs}>Switch to Register</button>
      <button onClick={() => setIsLoading(true)}>Set Loading</button>
    </div>
  ),
}));
vi.mock('@/pages/login/components/RegisterForm', () => ({
  default: ({ switchTabs, setIsLoading }: any) => (
    <div data-testid="register-form">
      <button onClick={switchTabs}>Switch to Login</button>
      <button onClick={() => setIsLoading(true)}>Set Loading</button>
    </div>
  ),
}));
vi.mock('@/shared/components/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));
vi.mock('@/assets/logo.svg?react', () => ({
  default: ({ className }: any) => (
    <div data-testid="logo" className={className}>
      Logo
    </div>
  ),
}));
vi.mock('@/pages/login/utils/session', () => ({
  getToken: vi.fn(),
  saveToken: vi.fn(),
  removeToken: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { useUser } from '@/pages/login/hooks/useUser';
import * as authStorage from '@/pages/login/utils/session';

const mockUseUser = useUser as ReturnType<typeof vi.fn>;
const mockGetToken = authStorage.getToken as ReturnType<typeof vi.fn>;

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  };

  it('should render logo and tagline', () => {
    mockUseUser.mockReturnValue({ data: null });
    mockGetToken.mockReturnValue(null);

    renderComponent();

    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(
      screen.getByText('Track and share expenses with friends.')
    ).toBeInTheDocument();
  });

  it('should render LoginForm by default', () => {
    mockUseUser.mockReturnValue({ data: null });
    mockGetToken.mockReturnValue(null);

    renderComponent();

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('register-form')).not.toBeInTheDocument();
  });

  it('should switch to RegisterForm when switchTabs is called', async () => {
    mockUseUser.mockReturnValue({ data: null });
    mockGetToken.mockReturnValue(null);

    const user = userEvent.setup();
    renderComponent();

    const switchButton = screen.getByRole('button', {
      name: /Switch to Register/i,
    });
    await user.click(switchButton);

    await waitFor(() => {
      expect(screen.getByTestId('register-form')).toBeInTheDocument();
      expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    });
  });

  it('should switch back to LoginForm from RegisterForm', async () => {
    mockUseUser.mockReturnValue({ data: null });
    mockGetToken.mockReturnValue(null);

    const user = userEvent.setup();
    renderComponent();

    // Switch to register
    const switchToRegister = screen.getByRole('button', {
      name: /Switch to Register/i,
    });
    await user.click(switchToRegister);

    await waitFor(() => {
      expect(screen.getByTestId('register-form')).toBeInTheDocument();
    });

    // Switch back to login
    const switchToLogin = screen.getByRole('button', {
      name: /Switch to Login/i,
    });
    await user.click(switchToLogin);

    await waitFor(() => {
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
      expect(screen.queryByTestId('register-form')).not.toBeInTheDocument();
    });
  });

  it('should show loader when isLoading is true', async () => {
    mockUseUser.mockReturnValue({ data: null });
    mockGetToken.mockReturnValue(null);

    const user = userEvent.setup();
    renderComponent();

    const setLoadingButton = screen.getByRole('button', {
      name: /Set Loading/i,
    });
    await user.click(setLoadingButton);

    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  it('should navigate to home when user is authenticated', () => {
    mockUseUser.mockReturnValue({ data: { id: 1, fullName: 'Test User' } });
    mockGetToken.mockReturnValue('valid-token');

    renderComponent();

    waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should not navigate when user is not authenticated', () => {
    mockUseUser.mockReturnValue({ data: null });
    mockGetToken.mockReturnValue(null);

    renderComponent();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should not navigate when token is missing', () => {
    mockUseUser.mockReturnValue({ data: { id: 1, fullName: 'Test User' } });
    mockGetToken.mockReturnValue(null);

    renderComponent();

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
