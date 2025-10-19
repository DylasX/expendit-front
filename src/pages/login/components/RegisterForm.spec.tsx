import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegisterForm from './RegisterForm';

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

describe('RegisterForm', () => {
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
          <RegisterForm
            switchTabs={mockSwitchTabs}
            setIsLoading={mockSetIsLoading}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('should render email, fullname, and password fields', () => {
    renderComponent();

    expect(document.getElementById('email')).toBeInTheDocument();
    expect(document.getElementById('fullName')).toBeInTheDocument();
    expect(document.getElementById('password')).toBeInTheDocument();
  });

  it('should render register button', () => {
    renderComponent();

    expect(
      screen.getByRole('button', { name: /Register/i })
    ).toBeInTheDocument();
  });

  it('should render "Already have an account? Login" link', () => {
    renderComponent();

    expect(
      screen.getByText(/Already have an account\? Login/i)
    ).toBeInTheDocument();
  });

  it('should allow typing in email field', async () => {
    const user = userEvent.setup();
    renderComponent();

    const emailInputs = screen.getAllByPlaceholderText('user1@example.com');
    const emailInput = emailInputs[0];
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should allow typing in fullname field', async () => {
    const user = userEvent.setup();
    renderComponent();

    const fullnameInput = document.getElementById('fullName') as HTMLInputElement;
    await user.type(fullnameInput, 'John Doe');

    expect(fullnameInput).toHaveValue('John Doe');
  });

  it('should allow typing in password field', async () => {
    const user = userEvent.setup();
    renderComponent();

    const passwordInput = screen.getByPlaceholderText('password');
    await user.type(passwordInput, 'password123');

    expect(passwordInput).toHaveValue('password123');
  });

  it('should call switchTabs when "Already have an account? Login" is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const loginLink = screen.getByText(/Already have an account\? Login/i);
    await user.click(loginLink);

    expect(mockSwitchTabs).toHaveBeenCalled();
  });

  it('should submit form with valid credentials', async () => {
    mockPost.mockResolvedValue({
      data: { token: { token: 'test-token' } },
    });

    const user = userEvent.setup();
    renderComponent();

    const emailInputs = screen.getAllByPlaceholderText('user1@example.com');
    const emailInput = emailInputs[0];
    const fullnameInput = document.getElementById('fullName') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('password');
    const registerButton = screen.getByRole('button', { name: /Register/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(fullnameInput, 'John Doe');
    await user.type(passwordInput, 'password123');
    await user.click(registerButton);

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        fullName: 'John Doe',
        password: 'password123',
      });
    });
  });

  it('should save token and navigate on successful registration', async () => {
    mockPost.mockResolvedValue({
      data: { token: { token: 'test-token' } },
    });

    const user = userEvent.setup();
    renderComponent();

    const emailInputs = screen.getAllByPlaceholderText('user1@example.com');
    const emailInput = emailInputs[0];
    const fullnameInput = document.getElementById('fullName') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('password');
    const registerButton = screen.getByRole('button', { name: /Register/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(fullnameInput, 'John Doe');
    await user.type(passwordInput, 'password123');
    await user.click(registerButton);

    await waitFor(() => {
      expect(mockSaveToken).toHaveBeenCalledWith('test-token');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should display error message on registration failure', async () => {
    mockPost.mockRejectedValue({
      response: {
        data: {
          errors: [{ message: 'Email already exists' }],
        },
      },
    });

    const user = userEvent.setup();
    renderComponent();

    const emailInputs = screen.getAllByPlaceholderText('user1@example.com');
    const emailInput = emailInputs[0];
    const fullnameInput = document.getElementById('fullName') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('password');
    const registerButton = screen.getByRole('button', { name: /Register/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(fullnameInput, 'John Doe');
    await user.type(passwordInput, 'password123');
    await user.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  it('should disable register button when mutation is pending', async () => {
    mockPost.mockImplementation(() => new Promise(() => {}));

    const user = userEvent.setup();
    renderComponent();

    const emailInputs = screen.getAllByPlaceholderText('user1@example.com');
    const emailInput = emailInputs[0];
    const fullnameInput = document.getElementById('fullName') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('password');
    const registerButton = screen.getByRole('button', { name: /Register/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(fullnameInput, 'John Doe');
    await user.type(passwordInput, 'password123');
    await user.click(registerButton);

    await waitFor(() => {
      expect(registerButton).toBeDisabled();
    });
  });

  it('should render icons for email, fullname, and password fields', () => {
    renderComponent();

    expect(screen.getAllByTestId('user-tag-icon')).toHaveLength(2);
    expect(screen.getByTestId('key-icon')).toBeInTheDocument();
  });
});
