import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvitationForm from './InvitationForm';

// Mock dependencies
vi.mock('@/pages/groups/hooks/useGroups');
vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: false }),
}));
vi.mock('@/shared/components/ImageDefault', () => ({
  default: ({ name, color, size }: any) => (
    <div data-testid="image-default" data-name={name} data-color={color}>
      {name}
    </div>
  ),
}));
vi.mock('@/shared/services/request', () => ({
  protectedApi: {
    post: vi.fn(),
  },
}));

import useGroups from '@/pages/groups/hooks/useGroups';
import { protectedApi } from '@/shared/services/request';

const mockUseGroups = useGroups as ReturnType<typeof vi.fn>;
const mockPost = protectedApi.post as ReturnType<typeof vi.fn>;

describe('InvitationForm', () => {
  let queryClient: QueryClient;
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const mockGroups = [
    {
      id: 1,
      name: 'Group 1',
      color: '#FF0000',
    },
    {
      id: 2,
      name: 'Group 2',
      color: '#00FF00',
    },
  ];

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <InvitationForm onClose={mockOnClose} />
      </QueryClientProvider>
    );
  };

  it('should render group selection initially', () => {
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('Select a group')).toBeInTheDocument();
    const group1Texts = screen.getAllByText('Group 1');
    const group2Texts = screen.getAllByText('Group 2');
    expect(group1Texts.length).toBeGreaterThan(0);
    expect(group2Texts.length).toBeGreaterThan(0);
  });

  it('should show "No groups yet" when groups array is empty', () => {
    mockUseGroups.mockReturnValue({
      groups: [],
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('No groups yet.')).toBeInTheDocument();
  });

  it('should show invitation form after selecting a group', async () => {
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    });

    const user = userEvent.setup();
    renderComponent();

    const group1Links = screen.getAllByText('Group 1');
    const group1Link = group1Links[0].closest('a');
    await user.click(group1Link!);

    await waitFor(() => {
      expect(
        screen.getByText('Invite users (emails separated by commas)')
      ).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  it('should display selected group name and image', async () => {
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    });

    const user = userEvent.setup();
    renderComponent();

    const group1Links = screen.getAllByText('Group 1');
    const group1Link = group1Links[0].closest('a');
    await user.click(group1Link!);

    await waitFor(() => {
      const images = screen.getAllByTestId('image-default');
      const selectedGroupImage = images.find(
        (img) => img.getAttribute('data-name') === 'Group 1'
      );
      expect(selectedGroupImage).toBeInTheDocument();
    });
  });

  it('should allow typing in the email textarea', async () => {
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    });

    const user = userEvent.setup();
    renderComponent();

    const group1Links = screen.getAllByText('Group 1');
    const group1Link = group1Links[0].closest('a');
    await user.click(group1Link!);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'test@example.com, test2@example.com');

    expect(textarea).toHaveValue('test@example.com, test2@example.com');
  });

  it('should have submit button', async () => {
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    });

    const user = userEvent.setup();
    renderComponent();

    const group1Links = screen.getAllByText('Group 1');
    const group1Link = group1Links[0].closest('a');
    await user.click(group1Link!);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Invite users/i })
      ).toBeInTheDocument();
    });
  });

  it('should show "Loading more..." when fetching next page', () => {
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isFetchingNextPage: true,
      hasNextPage: true,
      fetchNextPage: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('Loading more...')).toBeInTheDocument();
  });

  it('should show "Scroll to load more" when has next page', () => {
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isFetchingNextPage: false,
      hasNextPage: true,
      fetchNextPage: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('Scroll to load more')).toBeInTheDocument();
  });

  it('should show "No more groups" when no more pages', () => {
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('No more groups')).toBeInTheDocument();
  });

  it('should render ImageDefault for each group', () => {
    mockUseGroups.mockReturnValue({
      groups: mockGroups,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    });

    renderComponent();

    const images = screen.getAllByTestId('image-default');
    expect(images.length).toBeGreaterThanOrEqual(2);
  });
});
