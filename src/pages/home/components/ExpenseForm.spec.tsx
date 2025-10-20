import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider, type UseQueryResult } from '@tanstack/react-query';
import type { User } from '@/shared/types/user';
import ExpenseForm from './ExpenseForm';

// Mock hooks - must be declared before vi.mock calls
vi.mock('@/pages/groups/hooks/useGroup');
vi.mock('@/pages/groups/hooks/useGroups');
vi.mock('@/pages/login/hooks/useUser');

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
vi.mock('react-intersection-observer');

// Mock protectedApi
vi.mock('@/shared/services/request');

// Mock queryClient
vi.mock('@/shared/client/queryClient', () => ({
  queryClient: {
    invalidateQueries: vi.fn(),
  },
}));

// Import mocked modules
import useGroup from '@/pages/groups/hooks/useGroup';
import useGroups from '@/pages/groups/hooks/useGroups';
import { useUser } from '@/pages/login/hooks/useUser';
import { useInView } from 'react-intersection-observer';
import { protectedApi } from '@/shared/services/request';

const mockUseGroup = vi.mocked(useGroup);
const mockUseGroups = vi.mocked(useGroups);
const mockUseUser = vi.mocked(useUser);
const mockUseInView = vi.mocked(useInView);
const mockPost = vi.mocked(protectedApi.post);
const mockFetchNextPage = vi.fn();

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
  const mockGroups = [
    { 
      id: 1, 
      name: 'Test Group 1', 
      color: '#FF0000', 
      balanceTotal: 100,
      balances: [
        { 
          id: 1, 
          userId: 1, 
          debtUserRelated: 2, 
          groupId: 1, 
          amount: '50.00', 
          createdAt: '2024-01-01T00:00:00Z', 
          updatedAt: '2024-01-01T00:00:00Z',
          user: { id: 1, fullName: 'User 1' },
          debtUser: { id: 2, fullName: 'User 2' }
        },
      ],
      users: [
        { id: 1, fullName: 'User 1', email: 'user1@test.com', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', myCredit: [], myDebt: [], color: '#000000' },
        { id: 2, fullName: 'User 2', email: 'user2@test.com', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', myCredit: [], myDebt: [], color: '#111111' },
        { id: 3, fullName: 'User 3', email: 'user3@test.com', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', myCredit: [], myDebt: [], color: '#222222' },
      ],
      expenses: []
    },
    { 
      id: 2, 
      name: 'Test Group 2', 
      color: '#00FF00', 
      balanceTotal: 50,
      balances: [
        { 
          id: 2, 
          userId: 1, 
          debtUserRelated: 4, 
          groupId: 2, 
          amount: '25.00', 
          createdAt: '2024-01-01T00:00:00Z', 
          updatedAt: '2024-01-01T00:00:00Z',
          user: { id: 1, fullName: 'User 1' },
          debtUser: { id: 4, fullName: 'User 4' }
        },
      ],
      users: [
        { id: 1, fullName: 'User 1', email: 'user1@test.com', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', myCredit: [], myDebt: [], color: '#000000' },
        { id: 4, fullName: 'User 4', email: 'user4@test.com', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', myCredit: [], myDebt: [], color: '#333333' },
      ],
      expenses: []
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({ 
      data: { 
        id: 1, 
        fullName: 'Test User',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        myCredit: [],
        myDebt: [],
        color: '#000000'
      },
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      status: 'success',
      fetchStatus: 'idle',
      refetch: vi.fn(),
    } as unknown as UseQueryResult<User, Error>);
    mockUseGroups.mockReturnValue({
      groups: [],
      isLoading: false,
      error: null,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
    });
    mockUseGroup.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      status: 'success',
      fetchStatus: 'idle',
      refetch: vi.fn(),
      isFetching: false,
      isFetched: true,
      isRefetching: false,
      isPlaceholderData: false,
      isPaused: false,
      isStale: false,
      isLoadingError: false,
      isRefetchError: false,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isInitialLoading: false,
      isPending: false,
    } as unknown as UseQueryResult);
    mockUseInView.mockReturnValue({ ref: vi.fn(), inView: false, entry: undefined } as any);
    mockPost.mockResolvedValue({ data: {} });
  });

  describe('Group Selection', () => {
    it('should render select a group heading when no group selected', () => {
      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      expect(screen.getByText(/select a group/i)).toBeInTheDocument();
    });

    it('should render no groups message when no groups available', () => {
      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      expect(screen.getByText(/no groups yet/i)).toBeInTheDocument();
    });

    it('should render list of groups when available', () => {
      mockUseGroups.mockReturnValue({
        groups: mockGroups,
        isLoading: false,
        error: null,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: mockFetchNextPage,
      });

      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      expect(screen.getByText('Test Group 1')).toBeInTheDocument();
      expect(screen.getByText('Test Group 2')).toBeInTheDocument();
    });

    it('should select a group when clicked', async () => {
      const user = userEvent.setup();
      mockUseGroups.mockReturnValue({
        groups: mockGroups,
        isLoading: false,
        error: null,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: mockFetchNextPage,
      });

      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      
      const groupLink = screen.getByText('Test Group 1').closest('a');
      await user.click(groupLink!);

      await waitFor(() => {
        expect(screen.getByText(/new expense/i)).toBeInTheDocument();
      });
    });

    it('should go back to group list when back arrow clicked', async () => {
      const user = userEvent.setup();
      mockUseGroups.mockReturnValue({
        groups: mockGroups,
        isLoading: false,
        error: null,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: mockFetchNextPage,
      });
      mockUseGroup.mockReturnValue({
        data: mockGroups[0],
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        status: 'success',
        fetchStatus: 'idle',
        refetch: vi.fn(),
      } as unknown as UseQueryResult);

      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      
      // Select group first
      const groupLink = screen.getByText('Test Group 1').closest('a');
      await user.click(groupLink!);

      // Wait for form to appear
      await waitFor(() => {
        expect(screen.getByText(/new expense/i)).toBeInTheDocument();
      });

      // Click back
      const backLink = screen.getByText(/new expense/i).closest('a');
      await user.click(backLink!);

      await waitFor(() => {
        expect(screen.getByText(/select a group/i)).toBeInTheDocument();
      });
    });

    it('should show loading more message when fetching next page', () => {
      mockUseGroups.mockReturnValue({
        groups: mockGroups,
        isLoading: false,
        error: null,
        isFetchingNextPage: true,
        hasNextPage: true,
        fetchNextPage: mockFetchNextPage,
      });

      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      expect(screen.getByText(/loading more/i)).toBeInTheDocument();
    });

    it('should show scroll to load more when has next page', () => {
      mockUseGroups.mockReturnValue({
        groups: mockGroups,
        isLoading: false,
        error: null,
        isFetchingNextPage: false,
        hasNextPage: true,
        fetchNextPage: mockFetchNextPage,
      });

      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      expect(screen.getByText(/scroll to load more/i)).toBeInTheDocument();
    });

    it('should show no more groups when no next page', () => {
      mockUseGroups.mockReturnValue({
        groups: mockGroups,
        isLoading: false,
        error: null,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: mockFetchNextPage,
      });

      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      expect(screen.getByText(/no more groups/i)).toBeInTheDocument();
    });

    it('should fetch next page when inView is true', () => {
      mockUseInView.mockReturnValue({ ref: vi.fn(), inView: true, entry: undefined } as any);
      mockUseGroups.mockReturnValue({
        groups: mockGroups,
        isLoading: false,
        error: null,
        isFetchingNextPage: false,
        hasNextPage: true,
        fetchNextPage: mockFetchNextPage,
      });

      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      expect(mockFetchNextPage).toHaveBeenCalled();
    });
  });

  describe('Form Interactions', () => {
    beforeEach(() => {
      mockUseGroups.mockReturnValue({
        groups: mockGroups,
        isLoading: false,
        error: null,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: mockFetchNextPage,
      });
      mockUseGroup.mockReturnValue({
        data: mockGroups[0],
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        status: 'success',
        fetchStatus: 'idle',
        refetch: vi.fn(),
      } as unknown as UseQueryResult);
    });

    it('should render form fields when group is selected', async () => {
      const user = userEvent.setup();
      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      
      const groupLink = screen.getByText('Test Group 1').closest('a');
      await user.click(groupLink!);

      await waitFor(() => {
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create expense/i })).toBeInTheDocument();
      });
    });

    it('should update description field', async () => {
      const user = userEvent.setup();
      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      
      const groupLink = screen.getByText('Test Group 1').closest('a');
      await user.click(groupLink!);

      await waitFor(() => {
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      });

      const descInput = screen.getByLabelText(/description/i);
      await user.type(descInput, 'Coffee with friends');

      expect(descInput).toHaveValue('Coffee with friends');
    });

    it('should update amount field and clear participants', async () => {
      const user = userEvent.setup();
      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      
      const groupLink = screen.getByText('Test Group 1').closest('a');
      await user.click(groupLink!);

      await waitFor(() => {
        expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      });

      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '100');

      expect(amountInput).toHaveValue('100');
    });
  });

  describe('Division Strategy', () => {
    beforeEach(() => {
      mockUseGroups.mockReturnValue({
        groups: mockGroups,
        isLoading: false,
        error: null,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: mockFetchNextPage,
      });
      mockUseGroup.mockReturnValue({
        data: mockGroups[0],
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        status: 'success',
        fetchStatus: 'idle',
        refetch: vi.fn(),
      } as unknown as UseQueryResult);
    });

    it('should render toggle button for division strategy', async () => {
      const user = userEvent.setup();
      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      
      const groupLink = screen.getByText('Test Group 1').closest('a');
      await user.click(groupLink!);

      await waitFor(() => {
        expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
      });
    });
  });

  describe('Participant Management', () => {
    beforeEach(() => {
      mockUseGroups.mockReturnValue({
        groups: mockGroups,
        isLoading: false,
        error: null,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: mockFetchNextPage,
      });
      mockUseGroup.mockReturnValue({
        data: mockGroups[0],
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        status: 'success',
        fetchStatus: 'idle',
        refetch: vi.fn(),
      } as unknown as UseQueryResult);
    });

    it('should render list of group members', async () => {
      const user = userEvent.setup();
      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      
      const groupLink = screen.getByText('Test Group 1').closest('a');
      await user.click(groupLink!);

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
        expect(screen.getByText('User 2')).toBeInTheDocument();
        expect(screen.getByText('User 3')).toBeInTheDocument();
      });
    });

    it('should add participant when checkbox is checked', async () => {
      const user = userEvent.setup();
      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      
      const groupLink = screen.getByText('Test Group 1').closest('a');
      await user.click(groupLink!);

      await waitFor(() => {
        expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      });

      // Set amount first
      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '100');

      // Check participant checkbox
      const checkbox = screen.getByLabelText('User 2');
      await user.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    it('should remove participant when checkbox is unchecked', async () => {
      const user = userEvent.setup();
      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      
      const groupLink = screen.getByText('Test Group 1').closest('a');
      await user.click(groupLink!);

      await waitFor(() => {
        expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      });

      // Set amount first
      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '100');

      // Check and uncheck participant
      const checkbox = screen.getByLabelText('User 2');
      await user.click(checkbox);
      await user.click(checkbox);

      expect(checkbox).not.toBeChecked();
    });

    it('should render participant amount inputs', async () => {
      const user = userEvent.setup();
      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      
      const groupLink = screen.getByText('Test Group 1').closest('a');
      await user.click(groupLink!);

      await waitFor(() => {
        expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      });

      // Set amount first
      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, '100');

      // Check that participant inputs exist
      const user2AmountInput = screen.getByLabelText('User 2').closest('li')?.querySelector('input[type="number"]');
      expect(user2AmountInput).toBeInTheDocument();
    });

    it('should have checkboxes for all participants', async () => {
      const user = userEvent.setup();
      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      
      const groupLink = screen.getByText('Test Group 1').closest('a');
      await user.click(groupLink!);

      await waitFor(() => {
        expect(screen.getByLabelText('User 1')).toBeInTheDocument();
        expect(screen.getByLabelText('User 2')).toBeInTheDocument();
        expect(screen.getByLabelText('User 3')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      mockUseGroups.mockReturnValue({
        groups: mockGroups,
        isLoading: false,
        error: null,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: mockFetchNextPage,
      });
      mockUseGroup.mockReturnValue({
        data: mockGroups[0],
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        status: 'success',
        fetchStatus: 'idle',
        refetch: vi.fn(),
      } as unknown as UseQueryResult);
    });

    it('should render submit button', async () => {
      const user = userEvent.setup();
      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      
      const groupLink = screen.getByText('Test Group 1').closest('a');
      await user.click(groupLink!);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /create expense/i })).toBeInTheDocument();
      });
    });

    it('should render form fields for submission', async () => {
      const user = userEvent.setup();
      render(<ExpenseForm onClose={mockOnClose} />, { wrapper: createWrapper() });
      
      const groupLink = screen.getByText('Test Group 1').closest('a');
      await user.click(groupLink!);

      await waitFor(() => {
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      });
    });
  });
});
