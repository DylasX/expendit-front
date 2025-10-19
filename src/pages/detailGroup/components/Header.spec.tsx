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

describe('DetailGroup Header', () => {
  const mockGroup = {
    id: 1,
    name: 'Test Group',
    color: '#FF5733',
    balanceTotal: 100,
    balances: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({
      data: {
        fullName: 'John Doe',
        color: '#0000FF',
      },
    });
  });

  it('should render back button', () => {
    render(
      <MemoryRouter>
        <Header group={mockGroup} />
      </MemoryRouter>
    );

    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('should navigate to groups page when back is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Header group={mockGroup} />
      </MemoryRouter>
    );

    await user.click(screen.getByText('Back'));
    expect(mockNavigate).toHaveBeenCalledWith('/groups');
  });

  it('should render group name', () => {
    render(
      <MemoryRouter>
        <Header group={mockGroup} />
      </MemoryRouter>
    );

    const groupNames = screen.getAllByText('Test Group');
    expect(groupNames.length).toBeGreaterThan(0);
  });

  it('should render group image with correct props', () => {
    render(
      <MemoryRouter>
        <Header group={mockGroup} />
      </MemoryRouter>
    );

    const images = screen.getAllByTestId('image-default');
    const groupImage = images.find(img => img.getAttribute('data-name') === 'Test Group');
    
    expect(groupImage).toHaveAttribute('data-size', '16');
    expect(groupImage).toHaveAttribute('data-color', '#FF5733');
  });

  it('should display positive balance in primary color', () => {
    render(
      <MemoryRouter>
        <Header group={mockGroup} />
      </MemoryRouter>
    );

    const balanceText = screen.getByText('$100');
    expect(balanceText).toHaveClass('text-primary-400');
  });

  it('should display negative balance in red', () => {
    const negativeGroup = { ...mockGroup, balanceTotal: -50 };
    render(
      <MemoryRouter>
        <Header group={negativeGroup} />
      </MemoryRouter>
    );

    const balanceText = screen.getByText('$50');
    expect(balanceText).toHaveClass('text-red-400');
  });

  it('should render settle up button', () => {
    render(
      <MemoryRouter>
        <Header group={mockGroup} />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /settle up/i })).toBeInTheDocument();
  });

  it('should render user image', () => {
    render(
      <MemoryRouter>
        <Header group={mockGroup} />
      </MemoryRouter>
    );

    const images = screen.getAllByTestId('image-default');
    const userImage = images.find(img => img.getAttribute('data-name') === 'John Doe');
    
    expect(userImage).toBeInTheDocument();
  });

  it('should handle zero balance', () => {
    const zeroGroup = { ...mockGroup, balanceTotal: 0 };
    render(
      <MemoryRouter>
        <Header group={zeroGroup} />
      </MemoryRouter>
    );

    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  it('should render arrow left icon', () => {
    render(
      <MemoryRouter>
        <Header group={mockGroup} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('arrow-left')).toBeInTheDocument();
  });
});
