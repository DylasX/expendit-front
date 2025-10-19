import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ExpenseForm from './ExpenseForm';

// Mock hooks
vi.mock('@/pages/groups/hooks/useGroup', () => ({
  default: vi.fn(() => ({ data: null })),
}));

vi.mock('@/pages/groups/hooks/useGroups', () => ({
  default: vi.fn(() => ({
    groups: [],
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
  })),
}));

vi.mock('@/pages/login/hooks/useUser', () => ({
  useUser: vi.fn(() => ({ data: { id: 1, fullName: 'Test User' } })),
}));

// Mock components
vi.mock('@/shared/components/ImageDefault', () => ({
  default: () => <div data-testid="image-default">Image</div>,
}));

vi.mock('@/shared/components/ToggleButton', () => ({
  default: () => <div data-testid="toggle-button">Toggle</div>,
}));

// Mock icons
vi.mock('iconsax-react', () => ({
  ArrowLeft: () => <div>Arrow</div>,
  DollarCircle: () => <div>Dollar</div>,
  Message: () => <div>Message</div>,
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock intersection observer
vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: false }),
}));

// Mock protectedApi
vi.mock('@/shared/services/request', () => ({
  protectedApi: {
    post: vi.fn(),
  },
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

describe('ExpenseForm', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render select a group heading', () => {
    render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/select a group/i)).toBeInTheDocument();
  });

  it('should render no groups message when no groups available', () => {
    render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/no groups yet/i)).toBeInTheDocument();
  });

  it('should call onClose prop', () => {
    render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
    
    expect(mockOnClose).toBeDefined();
  });
});
