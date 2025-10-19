import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from './Home';

// Mock dependencies
vi.mock('@/pages/login/hooks/useUser');
vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: false }),
}));
vi.mock('@/shared/components/Header', () => ({
  default: ({ owesYou, youOwe }: { owesYou: number; youOwe: number }) => (
    <div data-testid="header">
      Owes You: ${owesYou} | You Owe: ${youOwe}
    </div>
  ),
}));
vi.mock('@/shared/components/Drawer', () => ({
  default: ({ children, open, onClose }: any) =>
    open ? (
      <div data-testid="drawer" onClick={onClose}>
        {children}
      </div>
    ) : null,
}));
vi.mock('@/pages/home/components/ExpenseForm', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="expense-form">
      <button onClick={onClose}>Close Form</button>
    </div>
  ),
}));
vi.mock('@/shared/components/ImageDefault', () => ({
  default: ({ name }: { name: string; color: string }) => (
    <div data-testid="image-default" data-name={name}>
      {name}
    </div>
  ),
}));
vi.mock('@/shared/components/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/shared/services/request', () => ({
  protectedApi: {
    get: vi.fn(),
  },
}));

import { useUser } from '@/pages/login/hooks/useUser';
import { protectedApi } from '@/shared/services/request';

const mockUseUser = useUser as ReturnType<typeof vi.fn>;
const mockGet = protectedApi.get as ReturnType<typeof vi.fn>;

describe('Home', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const mockUser = {
    id: 1,
    fullName: 'Test User',
    myCredit: [{ amount: '50' }, { amount: '30' }],
    myDebt: [{ amount: '20' }, { amount: '10' }],
  };

  const mockExpenses = [
    {
      id: 1,
      description: 'Dinner',
      amount: '100',
      amountByUser: '50',
      color: '#FF0000',
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      description: 'Lunch',
      amount: '50',
      amountByUser: '-25',
      color: '#00FF00',
      createdAt: '2024-01-02T00:00:00Z',
    },
  ];

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('should render header with user credit and debt', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockExpenses,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText(/Owes You: \$80/)).toBeInTheDocument();
      expect(screen.getByText(/You Owe: \$30/)).toBeInTheDocument();
    });
  });

  it('should render loader initially', () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderComponent();

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render expenses list after loading', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockExpenses,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    renderComponent();

    await waitFor(() => {
      const dinnerElements = screen.getAllByText('Dinner');
      const lunchElements = screen.getAllByText('Lunch');
      expect(dinnerElements.length).toBeGreaterThan(0);
      expect(lunchElements.length).toBeGreaterThan(0);
    });
  });

  it('should open drawer when "New expense" button is clicked', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockExpenses,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      const dinnerElements = screen.getAllByText('Dinner');
      expect(dinnerElements.length).toBeGreaterThan(0);
    });

    const newExpenseButton = screen.getByRole('button', {
      name: /New expense/i,
    });
    await user.click(newExpenseButton);

    await waitFor(() => {
      expect(screen.getByTestId('drawer')).toBeInTheDocument();
      expect(screen.getByTestId('expense-form')).toBeInTheDocument();
    });
  });

  it('should close drawer when onClose is called', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockExpenses,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      const dinnerElements = screen.getAllByText('Dinner');
      expect(dinnerElements.length).toBeGreaterThan(0);
    });

    const newExpenseButton = screen.getByRole('button', {
      name: /New expense/i,
    });
    await user.click(newExpenseButton);

    await waitFor(() => {
      expect(screen.getByTestId('drawer')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /Close Form/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
    });
  });

  it('should navigate to expense detail when expense is clicked', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockExpenses,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      const dinnerElements = screen.getAllByText('Dinner');
      expect(dinnerElements.length).toBeGreaterThan(0);
    });

    const dinnerElements = screen.getAllByText('Dinner');
    const expenseItem = dinnerElements[0].closest('a');
    await user.click(expenseItem!);

    expect(mockNavigate).toHaveBeenCalledWith('/expense/1');
  });

  it('should show "You lent" for positive amounts', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockExpenses,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('You lent')).toBeInTheDocument();
    });
  });

  it('should show "You borrowed" for negative amounts', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockExpenses,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('You borrowed')).toBeInTheDocument();
    });
  });

  it('should show "No expenses yet" when expenses array is empty', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: [],
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No expenses yet.')).toBeInTheDocument();
    });
  });

  it('should show "Load More" when hasNextPage is true', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockExpenses,
        meta: { currentPage: 1, nextPageUrl: 'http://api.com/page2' },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });
  });

  it('should show "No more expenses to load" when no more pages', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockExpenses,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No more expenses to load')).toBeInTheDocument();
    });
  });

  it('should handle CancelledError gracefully', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockRejectedValue(new Error('CancelledError'));

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
    });
  });

  it('should display error message for other errors', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockRejectedValue(new Error('Network error'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
    });
  });
});
