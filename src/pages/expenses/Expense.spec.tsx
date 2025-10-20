import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ExpenseDetail from './Expense';

// Mock dependencies
vi.mock('@/pages/expenses/hooks/useExpense');
vi.mock('@/pages/expenses/components/Header', () => ({
  default: ({ expense }: { expense: any }) => (
    <div data-testid="header">Header: {expense.description}</div>
  ),
}));
vi.mock('@/shared/components/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));
vi.mock('@/shared/components/ImageDefault', () => ({
  default: ({ name, color }: { name: string; color: string }) => (
    <div data-testid="image-default" data-name={name} data-color={color}>
      {name}
    </div>
  ),
}));

import useExpense from '@/pages/expenses/hooks/useExpense';

const mockUseExpense = useExpense as ReturnType<typeof vi.fn>;

describe('ExpenseDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockExpenseData = {
    id: 1,
    ownerUserId: 1,
    groupId: 1,
    amount: '100',
    description: 'Test Expense',
    divisionStrategy: 'equal',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    amountByUser: '50',
    color: '#FF0000',
    group: {
      id: 1,
      name: 'Test Group',
      color: '#00FF00',
    },
    owner: {
      id: 1,
      fullName: 'John Doe',
      color: '#0000FF',
    },
    users: [
      {
        id: 1,
        fullName: 'John Doe',
        color: '#0000FF',
        amount: '0',  // Payer has amount=0
      },
      {
        id: 2,
        fullName: 'Jane Smith',
        color: '#FF00FF',
        amount: '50',  // Non-payer owes 50
      },
    ],
  };

  const renderComponent = (expenseId = '1') => {
    return render(
      <MemoryRouter initialEntries={[`/expense/${expenseId}`]}>
        <Routes>
          <Route path="/expense/:id" element={<ExpenseDetail />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should render loader when loading', () => {
    mockUseExpense.mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
    });

    renderComponent();

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render header with expense data', async () => {
    mockUseExpense.mockReturnValue({
      data: mockExpenseData,
      isLoading: false,
      isSuccess: true,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText(/Test Expense/)).toBeInTheDocument();
    });
  });

  it('should render list of users with amounts', async () => {
    mockUseExpense.mockReturnValue({
      data: mockExpenseData,
      isLoading: false,
      isSuccess: true,
    });

    renderComponent();

    await waitFor(() => {
      const johnDoeElements = screen.getAllByText('John Doe');
      const janeSmithElements = screen.getAllByText('Jane Smith');
      expect(johnDoeElements.length).toBeGreaterThan(0);
      expect(janeSmithElements.length).toBeGreaterThan(0);
    });
  });

  it('should show "Paid" label for positive amounts', async () => {
    mockUseExpense.mockReturnValue({
      data: mockExpenseData,
      isLoading: false,
      isSuccess: true,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Paid')).toBeInTheDocument();
    });
  });

  it('should show "Owes" label for negative amounts', async () => {
    mockUseExpense.mockReturnValue({
      data: mockExpenseData,
      isLoading: false,
      isSuccess: true,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Owes')).toBeInTheDocument();
    });
  });

  it('should render correct amount values', async () => {
    mockUseExpense.mockReturnValue({
      data: mockExpenseData,
      isLoading: false,
      isSuccess: true,
    });

    renderComponent();

    await waitFor(() => {
      const amounts = screen.getAllByText(/\$50/);
      expect(amounts.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should render ImageDefault for each user', async () => {
    mockUseExpense.mockReturnValue({
      data: mockExpenseData,
      isLoading: false,
      isSuccess: true,
    });

    renderComponent();

    await waitFor(() => {
      const images = screen.getAllByTestId('image-default');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('data-name', 'John Doe');
      expect(images[1]).toHaveAttribute('data-name', 'Jane Smith');
    });
  });

  it('should apply correct CSS classes for positive amounts', async () => {
    mockUseExpense.mockReturnValue({
      data: mockExpenseData,
      isLoading: false,
      isSuccess: true,
    });

    renderComponent();

    await waitFor(() => {
      const paidLabel = screen.getByText('Paid');
      const paidContainer = paidLabel.closest('.text-primary-500');
      expect(paidContainer).toBeInTheDocument();
    });
  });

  it('should apply correct CSS classes for negative amounts', async () => {
    mockUseExpense.mockReturnValue({
      data: mockExpenseData,
      isLoading: false,
      isSuccess: true,
    });

    renderComponent();

    await waitFor(() => {
      const owesLabel = screen.getByText('Owes');
      const owesContainer = owesLabel.closest('.text-red-500');
      expect(owesContainer).toBeInTheDocument();
    });
  });
});
