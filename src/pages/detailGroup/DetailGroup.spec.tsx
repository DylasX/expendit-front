import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DetailGroup from './DetailGroup';

// Mock dependencies
vi.mock('@/pages/groups/hooks/useGroup');
vi.mock('@/pages/detailGroup/components/Header', () => ({
  default: ({ group }: { group: any }) => (
    <div data-testid="header">Header: {group.name}</div>
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

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import useGroup from '@/pages/groups/hooks/useGroup';

const mockUseGroup = useGroup as ReturnType<typeof vi.fn>;

describe('DetailGroup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockGroupData = {
    id: 1,
    name: 'Test Group',
    color: '#FF0000',
    balanceTotal: 100,
    balances: [],
    expenses: [
      {
        id: 1,
        description: 'Dinner',
        amount: '50',
        color: '#00FF00',
      },
      {
        id: 2,
        description: 'Lunch',
        amount: '30',
        color: '#0000FF',
      },
    ],
    users: [
      {
        id: 1,
        fullName: 'John Doe',
        color: '#FF00FF',
      },
      {
        id: 2,
        fullName: 'Jane Smith',
        color: '#FFFF00',
      },
    ],
  };

  const renderComponent = (groupId = '1') => {
    return render(
      <MemoryRouter initialEntries={[`/group/${groupId}`]}>
        <Routes>
          <Route path="/group/:id" element={<DetailGroup />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should render loader when loading', () => {
    mockUseGroup.mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
    });

    renderComponent();

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render header with group data', async () => {
    mockUseGroup.mockReturnValue({
      data: mockGroupData,
      isLoading: false,
      isSuccess: true,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText(/Test Group/)).toBeInTheDocument();
    });
  });

  it('should render expenses tab by default', async () => {
    mockUseGroup.mockReturnValue({
      data: mockGroupData,
      isLoading: false,
      isSuccess: true,
    });

    renderComponent();

    await waitFor(() => {
      const dinnerElements = screen.getAllByText('Dinner');
      const lunchElements = screen.getAllByText('Lunch');
      expect(dinnerElements.length).toBeGreaterThan(0);
      expect(lunchElements.length).toBeGreaterThan(0);
      expect(screen.getByText('$50')).toBeInTheDocument();
      expect(screen.getByText('$30')).toBeInTheDocument();
    });
  });

  it('should switch to members tab when clicked', async () => {
    mockUseGroup.mockReturnValue({
      data: mockGroupData,
      isLoading: false,
      isSuccess: true,
    });

    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      const dinnerElements = screen.getAllByText('Dinner');
      expect(dinnerElements.length).toBeGreaterThan(0);
    });

    const membersButton = screen.getByRole('button', { name: /Members/i });
    await user.click(membersButton);

    await waitFor(() => {
      const johnDoeElements = screen.getAllByText('John Doe');
      const janeSmithElements = screen.getAllByText('Jane Smith');
      expect(johnDoeElements.length).toBeGreaterThan(0);
      expect(janeSmithElements.length).toBeGreaterThan(0);
    });
  });

  it('should navigate to expense detail when expense is clicked', async () => {
    mockUseGroup.mockReturnValue({
      data: mockGroupData,
      isLoading: false,
      isSuccess: true,
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

  it('should show "No expenses" message when expenses array is empty', async () => {
    mockUseGroup.mockReturnValue({
      data: { ...mockGroupData, expenses: [] },
      isLoading: false,
      isSuccess: true,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No expenses.')).toBeInTheDocument();
    });
  });

  it('should highlight active tab', async () => {
    mockUseGroup.mockReturnValue({
      data: mockGroupData,
      isLoading: false,
      isSuccess: true,
    });

    renderComponent();

    await waitFor(() => {
      const expensesButton = screen.getByRole('button', { name: /Expenses/i });
      expect(expensesButton).toHaveClass('text-primary-400');
    });
  });

  it('should render all expenses with correct data', async () => {
    mockUseGroup.mockReturnValue({
      data: mockGroupData,
      isLoading: false,
      isSuccess: true,
    });

    renderComponent();

    await waitFor(() => {
      const images = screen.getAllByTestId('image-default');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('data-name', 'Dinner');
      expect(images[1]).toHaveAttribute('data-name', 'Lunch');
    });
  });

  it('should render all members when members tab is active', async () => {
    mockUseGroup.mockReturnValue({
      data: mockGroupData,
      isLoading: false,
      isSuccess: true,
    });

    const user = userEvent.setup();
    renderComponent();

    const membersButton = screen.getByRole('button', { name: /Members/i });
    await user.click(membersButton);

    await waitFor(() => {
      const images = screen.getAllByTestId('image-default');
      expect(images.length).toBeGreaterThanOrEqual(2);
    });
  });
});
