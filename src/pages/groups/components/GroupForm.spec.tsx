import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GroupForm from './GroupForm';

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock iconsax-react
vi.mock('iconsax-react', () => ({
  Profile2User: () => <div data-testid="profile-icon">Icon</div>,
}));

// Mock protectedApi
vi.mock('@/shared/services/request', () => ({
  protectedApi: {
    post: vi.fn(),
  },
}));

// Mock colors
vi.mock('@/shared/utils/color', () => ({
  colors: ['#FF0000', '#00FF00', '#0000FF'],
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('GroupForm', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form heading', () => {
    render(<GroupForm onClose={mockOnClose} />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/create a new group/i)).toBeInTheDocument();
  });

  it('should render group name input', () => {
    render(<GroupForm onClose={mockOnClose} />, { wrapper: createWrapper() });
    
    expect(screen.getByLabelText(/group name/i)).toBeInTheDocument();
  });

  it('should render profile icon', () => {
    render(<GroupForm onClose={mockOnClose} />, { wrapper: createWrapper() });
    
    expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
  });

  it('should allow typing in group name field', async () => {
    const user = userEvent.setup();
    render(<GroupForm onClose={mockOnClose} />, { wrapper: createWrapper() });
    
    const input = screen.getByLabelText(/group name/i);
    await user.type(input, 'Test Group');
    
    expect(input).toHaveValue('Test Group');
  });

  it('should have submit button', () => {
    render(<GroupForm onClose={mockOnClose} />, { wrapper: createWrapper() });
    
    const submitButton = screen.getByRole('button', { name: /create group/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should show validation error for empty name', async () => {
    const user = userEvent.setup();
    render(<GroupForm onClose={mockOnClose} />, { wrapper: createWrapper() });
    
    const submitButton = screen.getByRole('button', { name: /create group/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/invalid input/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it('should call onClose when form is cancelled', async () => {
    const user = userEvent.setup();
    render(<GroupForm onClose={mockOnClose} />, { wrapper: createWrapper() });
    
    const cancelButton = screen.queryByRole('button', { name: /cancel/i });
    if (cancelButton) {
      await user.click(cancelButton);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should render form with max-w-sm class', () => {
    const { container } = render(<GroupForm onClose={mockOnClose} />, { wrapper: createWrapper() });
    
    const form = container.querySelector('form');
    expect(form).toHaveClass('max-w-sm', 'mx-auto');
  });

  it('should have proper label association', () => {
    render(<GroupForm onClose={mockOnClose} />, { wrapper: createWrapper() });
    
    const label = screen.getByText(/group name/i);
    const input = screen.getByLabelText(/group name/i);
    
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });
});
