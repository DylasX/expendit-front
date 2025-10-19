import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

// Mock useUser hook
const mockUseUser = vi.fn();
vi.mock('@/pages/login/hooks/useUser', () => ({
  useUser: () => mockUseUser(),
}));

// Mock ImageDefault component
vi.mock('@/shared/components/ImageDefault', () => ({
  default: ({ name, size, color }: { name: string; size: number; color?: string }) => (
    <div data-testid="image-default" data-name={name} data-size={size} data-color={color}>
      {name}
    </div>
  ),
}));

describe('Header', () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({
      data: {
        fullName: 'John Doe',
        color: '#FF5733',
      },
      isLoading: false,
    });
  });

  it('should render welcome message with user name', () => {
    render(<Header owesYou={100} youOwe={50} />);

    expect(screen.getByText(/Welcome John Doe/i)).toBeInTheDocument();
  });

  it('should render tagline', () => {
    render(<Header owesYou={100} youOwe={50} />);

    expect(screen.getByText('Make your expenses simple')).toBeInTheDocument();
  });

  it('should render balance label', () => {
    render(<Header owesYou={100} youOwe={50} />);

    expect(screen.getByText('Balance')).toBeInTheDocument();
  });

  it('should calculate and display positive balance correctly', () => {
    render(<Header owesYou={150} youOwe={50} />);

    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('should calculate and display negative balance correctly', () => {
    render(<Header owesYou={50} youOwe={150} />);

    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('should display balance in green when positive', () => {
    const { container } = render(<Header owesYou={150} youOwe={50} />);

    const balance = container.querySelector('.text-emerald-500');
    expect(balance).toBeInTheDocument();
    expect(balance).toHaveTextContent('$100');
  });

  it('should display balance in red when negative', () => {
    const { container } = render(<Header owesYou={50} youOwe={150} />);

    const balance = container.querySelector('.text-red-500');
    expect(balance).toBeInTheDocument();
    expect(balance).toHaveTextContent('$100');
  });

  it('should display "You owe" amount', () => {
    render(<Header owesYou={100} youOwe={75} />);

    expect(screen.getByText('You owe')).toBeInTheDocument();
    expect(screen.getByText('$75')).toBeInTheDocument();
  });

  it('should display "Owes you" amount', () => {
    render(<Header owesYou={125} youOwe={50} />);

    expect(screen.getByText('Owes you')).toBeInTheDocument();
    expect(screen.getByText('$125')).toBeInTheDocument();
  });

  it('should render ImageDefault component with user data', () => {
    render(<Header owesYou={100} youOwe={50} />);

    const imageDefault = screen.getByTestId('image-default');
    expect(imageDefault).toBeInTheDocument();
    expect(imageDefault).toHaveAttribute('data-name', 'John Doe');
    expect(imageDefault).toHaveAttribute('data-size', '10');
    expect(imageDefault).toHaveAttribute('data-color', '#FF5733');
  });

  it('should handle zero balance', () => {
    render(<Header owesYou={50} youOwe={50} />);

    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  it('should handle user with no name', () => {
    mockUseUser.mockReturnValue({
      data: {
        fullName: undefined,
        color: '#FF5733',
      },
      isLoading: false,
    });

    render(<Header owesYou={100} youOwe={50} />);

    const imageDefault = screen.getByTestId('image-default');
    expect(imageDefault).toHaveAttribute('data-name', 'User');
  });

  it('should handle loading state', () => {
    mockUseUser.mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(<Header owesYou={100} youOwe={50} />);

    // Component should still render with default values
    expect(screen.getByText('Balance')).toBeInTheDocument();
  });
});
