import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Header from './Header';

// Mock useUser hook
const mockUseUser = vi.fn();
vi.mock('@/pages/login/hooks/useUser', () => ({
  useUser: () => mockUseUser(),
}));

// Mock ImageDefault
vi.mock('@/shared/components/ImageDefault', () => ({
  default: ({ name, size, color }: { name: string; size: number; color?: string }) => (
    <div data-testid="image-default" data-name={name} data-size={size} data-color={color}>
      {name}
    </div>
  ),
}));

// Mock iconsax-react
vi.mock('iconsax-react', () => ({
  ArrowLeft: ({ className }: { className?: string }) => (
    <div data-testid="arrow-left" className={className}>Arrow</div>
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

describe('Expense Header', () => {
  const mockExpense = {
    id: 1,
    description: 'Dinner at Restaurant',
    amount: '150.50',
    color: '#FF5733',
    ownerUserId: 1,
    groupId: 1,
    divisionStrategy: 'equal',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    amountByUser: '75.25',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({
      data: {
        fullName: 'Jane Smith',
        color: '#00FF00',
      },
    });
  });

  it('should render back button', () => {
    render(
      <MemoryRouter>
        <Header expense={mockExpense} />
      </MemoryRouter>
    );

    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('should navigate back when back button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Header expense={mockExpense} />
      </MemoryRouter>
    );

    await user.click(screen.getByText('Back'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should render expense description', () => {
    render(
      <MemoryRouter>
        <Header expense={mockExpense} />
      </MemoryRouter>
    );

    const descriptions = screen.getAllByText('Dinner at Restaurant');
    expect(descriptions.length).toBeGreaterThan(0);
  });

  it('should render expense image with correct props', () => {
    render(
      <MemoryRouter>
        <Header expense={mockExpense} />
      </MemoryRouter>
    );

    const images = screen.getAllByTestId('image-default');
    const expenseImage = images.find(img => img.getAttribute('data-name') === 'Dinner at Restaurant');
    
    expect(expenseImage).toHaveAttribute('data-size', '16');
    expect(expenseImage).toHaveAttribute('data-color', '#FF5733');
  });

  it('should display expense amount', () => {
    render(
      <MemoryRouter>
        <Header expense={mockExpense} />
      </MemoryRouter>
    );

    expect(screen.getByText('$150.5')).toBeInTheDocument();
  });

  it('should display total amount label', () => {
    render(
      <MemoryRouter>
        <Header expense={mockExpense} />
      </MemoryRouter>
    );

    expect(screen.getByText(/total amount:/i)).toBeInTheDocument();
  });

  it('should render user image', () => {
    render(
      <MemoryRouter>
        <Header expense={mockExpense} />
      </MemoryRouter>
    );

    const images = screen.getAllByTestId('image-default');
    const userImage = images.find(img => img.getAttribute('data-name') === 'Jane Smith');
    
    expect(userImage).toBeInTheDocument();
  });

  it('should handle zero amount', () => {
    const zeroExpense = { ...mockExpense, amount: '0' };
    render(
      <MemoryRouter>
        <Header expense={zeroExpense} />
      </MemoryRouter>
    );

    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  it('should render arrow left icon', () => {
    render(
      <MemoryRouter>
        <Header expense={mockExpense} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('arrow-left')).toBeInTheDocument();
  });

  it('should handle invalid amount gracefully', () => {
    const invalidExpense = { ...mockExpense, amount: 'invalid' };
    render(
      <MemoryRouter>
        <Header expense={invalidExpense} />
      </MemoryRouter>
    );

    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  it('should use default user name when user is not loaded', () => {
    mockUseUser.mockReturnValue({
      data: null,
    });

    render(
      <MemoryRouter>
        <Header expense={mockExpense} />
      </MemoryRouter>
    );

    const images = screen.getAllByTestId('image-default');
    const userImage = images.find(img => img.getAttribute('data-name') === 'User');
    
    expect(userImage).toBeInTheDocument();
  });
});
