import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginForm from './LoginForm';

// Mock dependencies
vi.mock('@/shared/services/request', () => ({
  unprotectedApi: {
    post: vi.fn(),
  },
  errorMutationAxios: {},
}));
vi.mock('@/pages/login/utils/session', () => ({
  saveToken: vi.fn(),
  getToken: vi.fn(),
  removeToken: vi.fn(),
}));
vi.mock('iconsax-react', () => ({
  Key: () => <div data-testid="key-icon">Key</div>,
  UserTag: () => <div data-testid="user-tag-icon">UserTag</div>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { unprotectedApi } from '@/shared/services/request';
import * as authStorage from '@/pages/login/utils/session';

const mockPost = unprotectedApi.post as ReturnType<typeof vi.fn>;
const mockSaveToken = authStorage.saveToken as ReturnType<typeof vi.fn>;

describe('LoginForm', () => {
  let queryClient: QueryClient;
  const mockSwitchTabs = vi.fn();
  const mockSetIsLoading = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LoginForm
            switchTabs={mockSwitchTabs}
            setIsLoading={mockSetIsLoading}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('should render email and password fields', () => {
    renderComponent();

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('should render login button', () => {
    renderComponent();

    expect(
      screen.getByRole('button', { name: /Login/i })
    ).toBeInTheDocument();
  });

  it('should render "Create an account" link', () => {
    renderComponent();

    expect(screen.getByText(/Create an account/i)).toBeInTheDocument();
  });

  it('should render "Forgot password?" link', () => {
    renderComponent();

    expect(screen.getByText(/Forgot password?/i)).toBeInTheDocument();
  });

  it('should allow typing in email field', async () => {
    const user = userEvent.setup();
    renderComponent();

    const emailInput = screen.getByPlaceholderText('user1@example.com');
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should allow typing in password field', async () => {
    const user = userEvent.setup();
    renderComponent();

    const passwordInput = screen.getByPlaceholderText('password');
    await user.type(passwordInput, 'password123');

    expect(passwordInput).toHaveValue('password123');
  });

  it('should call switchTabs when "Create an account" is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const createAccountLink = screen.getByText(/Create an account/i);
    await user.click(createAccountLink);

    expect(mockSwitchTabs).toHaveBeenCalled();
  });

  it('should submit form with valid credentials', async () => {
    mockPost.mockResolvedValue({
      data: { token: { token: 'test-token' } },
    });

    const user = userEvent.setup();
    renderComponent();

    const emailInput = screen.getByPlaceholderText('user1@example.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByRole('button', { name: /Login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should save token and navigate on successful login', async () => {
    mockPost.mockResolvedValue({
      data: { token: { token: 'test-token' } },
    });

    const user = userEvent.setup();
    renderComponent();

    const emailInput = screen.getByPlaceholderText('user1@example.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByRole('button', { name: /Login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);

    await waitFor(() => {
      expect(mockSaveToken).toHaveBeenCalledWith('test-token');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should display error message on login failure', async () => {
    mockPost.mockRejectedValue({
      response: {
        data: {
          errors: [{ message: 'Invalid credentials' }],
        },
      },
    });

    const user = userEvent.setup();
    renderComponent();

    const emailInput = screen.getByPlaceholderText('user1@example.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByRole('button', { name: /Login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('should disable login button when mutation is pending', async () => {
    mockPost.mockImplementation(() => new Promise(() => {}));

    const user = userEvent.setup();
    renderComponent();

    const emailInput = screen.getByPlaceholderText('user1@example.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByRole('button', { name: /Login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);

    await waitFor(() => {
      expect(loginButton).toBeDisabled();
    });
  });

  it('should render icons for email and password fields', () => {
    renderComponent();

    expect(screen.getAllByTestId('user-tag-icon')).toHaveLength(1);
    expect(screen.getByTestId('key-icon')).toBeInTheDocument();
  });
});
