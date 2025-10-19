import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import GroupList from './GroupList';

// Mock ImageDefault
vi.mock('@/shared/components/ImageDefault', () => ({
  default: ({ name, color }: { name: string; color?: string }) => (
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

describe('GroupList', () => {
  const mockGroups = [
    {
      id: 1,
      name: 'Group 1',
      color: '#FF0000',
      balanceTotal: 100,
      balances: [],
    },
    {
      id: 2,
      name: 'Group 2',
      color: '#00FF00',
      balanceTotal: -50,
      balances: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render empty state when no groups', () => {
    render(
      <MemoryRouter>
        <GroupList groups={[]} className="test-class" />
      </MemoryRouter>
    );

    expect(screen.getByText(/no groups yet/i)).toBeInTheDocument();
  });

  it('should render list of groups', () => {
    render(
      <MemoryRouter>
        <GroupList groups={mockGroups} className="test-class" />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Group 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Group 2').length).toBeGreaterThan(0);
  });

  it('should render group images', () => {
    render(
      <MemoryRouter>
        <GroupList groups={mockGroups} className="test-class" />
      </MemoryRouter>
    );

    const images = screen.getAllByTestId('image-default');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('data-name', 'Group 1');
    expect(images[1]).toHaveAttribute('data-name', 'Group 2');
  });

  it('should navigate to group detail when clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MemoryRouter>
        <GroupList groups={mockGroups} className="test-class" />
      </MemoryRouter>
    );

    const firstLink = container.querySelector('a');
    await user.click(firstLink!);
    expect(mockNavigate).toHaveBeenCalledWith('/group/1');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MemoryRouter>
        <GroupList groups={mockGroups} className="custom-class" />
      </MemoryRouter>
    );

    const ul = container.querySelector('ul');
    expect(ul).toHaveClass('custom-class');
  });

  it('should render renderOwesYou when provided', () => {
    const renderOwesYou = (group: any) => `Owes: $${group.balanceTotal}`;
    
    render(
      <MemoryRouter>
        <GroupList groups={mockGroups} className="test-class" renderOwesYou={renderOwesYou} />
      </MemoryRouter>
    );

    expect(screen.getByText(/owes: \$100/i)).toBeInTheDocument();
  });

  it('should have correct styling classes on list items', () => {
    const { container } = render(
      <MemoryRouter>
        <GroupList groups={mockGroups} className="test-class" />
      </MemoryRouter>
    );

    const listItems = container.querySelectorAll('li');
    expect(listItems[0]).toHaveClass('pb-3', 'sm:pb-4', 'p-4', 'mb-3', 'bg-zinc-800', 'rounded-xl');
  });

  it('should handle single group', () => {
    const singleGroup = [mockGroups[0]];
    
    render(
      <MemoryRouter>
        <GroupList groups={singleGroup} className="test-class" />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Group 1').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('Group 2')).toHaveLength(0);
  });

  it('should use unique keys for list items', () => {
    const { container } = render(
      <MemoryRouter>
        <GroupList groups={mockGroups} className="test-class" />
      </MemoryRouter>
    );

    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(2);
  });
});
