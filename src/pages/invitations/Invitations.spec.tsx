import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Invitations from './Invitations';
import { StatusEnum } from '@/pages/invitations/types/invitation';

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
vi.mock('@/pages/invitations/components/InvitationForm', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="invitation-form">
      <button onClick={onClose}>Close Form</button>
    </div>
  ),
}));
vi.mock('@/shared/components/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));
vi.mock('iconsax-react', () => ({
  TickCircle: ({ className }: any) => (
    <div data-testid="tick-icon" className={className}>
      Tick
    </div>
  ),
  CloseCircle: ({ className }: any) => (
    <div data-testid="close-icon" className={className}>
      Close
    </div>
  ),
}));

vi.mock('@/shared/services/request', () => ({
  protectedApi: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

import { useUser } from '@/pages/login/hooks/useUser';
import { protectedApi } from '@/shared/services/request';

const mockUseUser = useUser as ReturnType<typeof vi.fn>;
const mockGet = protectedApi.get as ReturnType<typeof vi.fn>;


describe('Invitations', () => {
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
    myCredit: [{ amount: '50' }],
    myDebt: [{ amount: '20' }],
  };

  const mockInvitations = [
    {
      id: 1,
      status: StatusEnum.PENDING,
      inviterUserId: 2,
      inviteeUserId: 1,
      inviter: { fullName: 'John Doe' },
      invitee: { fullName: 'Test User' },
      group: { name: 'Test Group' },
    },
    {
      id: 2,
      status: StatusEnum.ACCEPTED,
      inviterUserId: 1,
      inviteeUserId: 3,
      inviter: { fullName: 'Test User' },
      invitee: { fullName: 'Jane Smith' },
      group: { name: 'Another Group' },
    },
  ];

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Invitations />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('should render header with user credit and debt', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockInvitations,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText(/Owes You: \$50/)).toBeInTheDocument();
      expect(screen.getByText(/You Owe: \$20/)).toBeInTheDocument();
    });
  });

  it('should render loader initially', () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockImplementation(() => new Promise(() => {}));

    renderComponent();

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render invitations list after loading', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockInvitations,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Group')).toBeInTheDocument();
      expect(screen.getByText('Another Group')).toBeInTheDocument();
    });
  });

  it('should open drawer when "New invitation" button is clicked', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockInvitations,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Group')).toBeInTheDocument();
    });

    const newInvitationButton = screen.getByRole('button', {
      name: /New invitation/i,
    });
    await user.click(newInvitationButton);

    await waitFor(() => {
      expect(screen.getByTestId('drawer')).toBeInTheDocument();
      expect(screen.getByTestId('invitation-form')).toBeInTheDocument();
    });
  });

  it('should show accept/reject buttons for pending invitations to current user', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockInvitations,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('tick-icon')).toBeInTheDocument();
      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    });
  });

  it('should show status for non-pending invitations', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockInvitations,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('accepted')).toBeInTheDocument();
    });
  });

  it('should show "No invitations yet" when invitations array is empty', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: [],
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No invitations yet.')).toBeInTheDocument();
    });
  });

  it('should format invitation text with "You" for current user', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockInvitations,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    renderComponent();

    await waitFor(() => {
      const invitationTexts = screen.getAllByText(/invited/);
      expect(invitationTexts.length).toBeGreaterThan(0);
    });
  });

  it('should show "Load More" when hasNextPage is true', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockInvitations,
        meta: { currentPage: 1, nextPageUrl: 'http://api.com/page2' },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });
  });

  it('should display error message when error occurs', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockRejectedValue(new Error('Failed to load invitations'));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(/Error: Failed to load invitations/)
      ).toBeInTheDocument();
    });
  });

  it('should handle accept invitation action', async () => {
    const mockPost = vi.fn().mockResolvedValue({ data: {} });
    vi.mocked(protectedApi.post).mockImplementation(mockPost);
    
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockInvitations,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('tick-icon')).toBeInTheDocument();
    });

    const acceptButton = screen.getByTestId('tick-icon').closest('button');
    await user.click(acceptButton!);

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('user/invitation/1');
    });
  });

  it('should handle reject invitation action', async () => {
    const mockDelete = vi.fn().mockResolvedValue({ data: {} });
    vi.mocked(protectedApi.delete).mockImplementation(mockDelete);
    
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockInvitations,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    });

    const rejectButton = screen.getByTestId('close-icon').closest('button');
    await user.click(rejectButton!);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('user/invitation/1');
    });
  });

  it('should close drawer when onClose is called', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet.mockResolvedValue({
      data: {
        data: mockInvitations,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Group')).toBeInTheDocument();
    });

    const newInvitationButton = screen.getByRole('button', {
      name: /New invitation/i,
    });
    await user.click(newInvitationButton);

    await waitFor(() => {
      expect(screen.getByTestId('drawer')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('Close Form');
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
    });
  });

  it('should show "Loading more..." when fetching next page', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });
    mockGet
      .mockResolvedValueOnce({
        data: {
          data: mockInvitations,
          meta: { currentPage: 1, nextPageUrl: 'http://api.com/page2' },
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: [],
          meta: { currentPage: 2, nextPageUrl: null },
        },
      });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });
  });

  it('should handle user with no credit', async () => {
    mockUseUser.mockReturnValue({ 
      data: { ...mockUser, myCredit: [] } 
    });
    mockGet.mockResolvedValue({
      data: {
        data: mockInvitations,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Owes You: \$0/)).toBeInTheDocument();
    });
  });

  it('should handle user with no debt', async () => {
    mockUseUser.mockReturnValue({ 
      data: { ...mockUser, myDebt: [] } 
    });
    mockGet.mockResolvedValue({
      data: {
        data: mockInvitations,
        meta: { currentPage: 1, nextPageUrl: null },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/You Owe: \$0/)).toBeInTheDocument();
    });
  });
});
