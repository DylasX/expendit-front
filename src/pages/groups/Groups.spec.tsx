import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Groups from './Groups';

// Mock dependencies
vi.mock('@/pages/groups/hooks/useGroups');
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
vi.mock('@/pages/groups/components/GroupForm', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="group-form">
      <button onClick={onClose}>Close Form</button>
    </div>
  ),
}));
vi.mock('@/pages/groups/components/GroupList', () => ({
  default: ({ groups, renderOwesYou }: any) => (
    <div data-testid="group-list">
      {groups.map((group: any) => (
        <div key={group.id} data-testid={`group-${group.id}`}>
          {group.name}
          <div>{renderOwesYou(group)}</div>
        </div>
      ))}
    </div>
  ),
}));
vi.mock('@/shared/components/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

import useGroups from '@/pages/groups/hooks/useGroups';
import { useUser } from '@/pages/login/hooks/useUser';

const mockUseGroups = useGroups as ReturnType<typeof vi.fn>;
const mockUseUser = useUser as ReturnType<typeof vi.fn>;

describe('Groups', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUser = {
    id: 1,
    fullName: 'Test User',
    myCredit: [{ amount: '50' }, { amount: '30' }],
    myDebt: [{ amount: '20' }, { amount: '10' }],
  };

  const mockGroups = [
    {
      id: 1,
      name: 'Group 1',
      color: '#FF0000',
      balanceTotal: 100,
      balances: [
        {
          id: 1,
          amount: '50',
          debtUserRelated: 2,
          user: { fullName: 'John Doe' },
          debtUser: { fullName: 'Jane Smith' },
        },
      ],
    },
    {
      id: 2,
      name: 'Group 2',
      color: '#00FF00',
      balanceTotal: 0,
      balances: [],
    },
  ];

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Groups />
      </MemoryRouter>
    );
  };

  it('should render loader when loading', () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockUseGroups.mockReturnValue({
      groups: [],
      isLoading: true,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    renderComponent();

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render header with user credit and debt', () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isLoading: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    renderComponent();

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText(/Owes You: \$80/)).toBeInTheDocument();
    expect(screen.getByText(/You Owe: \$30/)).toBeInTheDocument();
  });

  it('should render groups list', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isLoading: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('group-list')).toBeInTheDocument();
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2')).toBeInTheDocument();
    });
  });

  it('should open drawer when "New group" button is clicked', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isLoading: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    const user = userEvent.setup();
    renderComponent();

    const newGroupButton = screen.getByRole('button', { name: /New group/i });
    await user.click(newGroupButton);

    await waitFor(() => {
      expect(screen.getByTestId('drawer')).toBeInTheDocument();
      expect(screen.getByTestId('group-form')).toBeInTheDocument();
    });
  });

  it('should close drawer when onClose is called', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isLoading: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    const user = userEvent.setup();
    renderComponent();

    const newGroupButton = screen.getByRole('button', { name: /New group/i });
    await user.click(newGroupButton);

    await waitFor(() => {
      expect(screen.getByTestId('drawer')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /Close Form/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
    });
  });

  it('should display error message when error occurs', () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockUseGroups.mockReturnValue({
      groups: [],
      isLoading: false,
      error: new Error('Failed to load groups'),
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    renderComponent();

    expect(screen.getByText(/Error: Failed to load groups/)).toBeInTheDocument();
  });

  it('should show "Load More" when hasNextPage is true', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isLoading: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });
  });

  it('should show "Loading more..." when fetching next page', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isLoading: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: true,
      isFetchingNextPage: true,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Loading more...')).toBeInTheDocument();
    });
  });

  it('should show "No more groups to load" when no more pages', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isLoading: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No more groups to load')).toBeInTheDocument();
    });
  });

  it('should render "Settled up" for groups with no balances', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isLoading: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Settled up')).toBeInTheDocument();
    });
  });
});
