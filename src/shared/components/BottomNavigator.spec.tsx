import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BottomNavigator from './BottomNavigator';

// Mock Capacitor
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    getPlatform: vi.fn(() => 'web'),
  },
}));

// Mock iconsax-react icons
vi.mock('iconsax-react', () => ({
  Add: ({ className }: { className?: string }) => <div data-testid="icon-add" className={className}>Add</div>,
  DirectboxNotif: ({ className }: { className?: string }) => <div data-testid="icon-invitations" className={className}>Invitations</div>,
  Profile2User: ({ className }: { className?: string }) => <div data-testid="icon-groups" className={className}>Groups</div>,
  Receipt1: ({ className }: { className?: string }) => <div data-testid="icon-home" className={className}>Home</div>,
  User: ({ className }: { className?: string }) => <div data-testid="icon-profile" className={className}>Profile</div>,
}));

describe('BottomNavigator', () => {
  it('should render all navigation links', () => {
    render(
      <MemoryRouter>
        <BottomNavigator />
      </MemoryRouter>
    );

    expect(screen.getByTestId('icon-groups')).toBeInTheDocument();
    expect(screen.getByTestId('icon-home')).toBeInTheDocument();
    expect(screen.getByTestId('icon-add')).toBeInTheDocument();
    expect(screen.getByTestId('icon-invitations')).toBeInTheDocument();
    expect(screen.getByTestId('icon-profile')).toBeInTheDocument();
  });

  it('should have correct links for all navigation items', () => {
    render(
      <MemoryRouter>
        <BottomNavigator />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(5);
    expect(links[0]).toHaveAttribute('href', '/groups');
    expect(links[1]).toHaveAttribute('href', '/');
    expect(links[2]).toHaveAttribute('href', '/add');
    expect(links[3]).toHaveAttribute('href', '/invitations');
    expect(links[4]).toHaveAttribute('href', '/profile');
  });

  it('should highlight active link on home page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <BottomNavigator />
      </MemoryRouter>
    );

    const homeLink = screen.getAllByRole('link')[1];
    expect(homeLink).toHaveClass('active');
  });

  it('should highlight active link on groups page', () => {
    render(
      <MemoryRouter initialEntries={['/groups']}>
        <BottomNavigator />
      </MemoryRouter>
    );

    const groupsLink = screen.getAllByRole('link')[0];
    expect(groupsLink).toHaveClass('active');
  });

  it('should highlight active link on add page', () => {
    render(
      <MemoryRouter initialEntries={['/add']}>
        <BottomNavigator />
      </MemoryRouter>
    );

    const addLink = screen.getAllByRole('link')[2];
    expect(addLink).toHaveClass('active');
  });

  it('should highlight active link on invitations page', () => {
    render(
      <MemoryRouter initialEntries={['/invitations']}>
        <BottomNavigator />
      </MemoryRouter>
    );

    const invitationsLink = screen.getAllByRole('link')[3];
    expect(invitationsLink).toHaveClass('active');
  });

  it('should highlight active link on profile page', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <BottomNavigator />
      </MemoryRouter>
    );

    const profileLink = screen.getAllByRole('link')[4];
    expect(profileLink).toHaveClass('active');
  });

  it('should apply correct height class for web platform', async () => {
    const { Capacitor } = await import('@capacitor/core');
    vi.mocked(Capacitor.getPlatform).mockReturnValue('web');

    const { container } = render(
      <MemoryRouter>
        <BottomNavigator />
      </MemoryRouter>
    );

    const bottomNav = container.querySelector('.box');
    expect(bottomNav).toHaveClass('h-16');
  });

  it('should apply correct height class for mobile platform', async () => {
    const { Capacitor } = await import('@capacitor/core');
    vi.mocked(Capacitor.getPlatform).mockReturnValue('android');

    const { container } = render(
      <MemoryRouter>
        <BottomNavigator />
      </MemoryRouter>
    );

    const bottomNav = container.querySelector('.box');
    expect(bottomNav).toHaveClass('h-20');
  });

  it('should have fixed positioning at bottom', () => {
    const { container } = render(
      <MemoryRouter>
        <BottomNavigator />
      </MemoryRouter>
    );

    const bottomNav = container.querySelector('.box');
    expect(bottomNav).toHaveClass('fixed', 'bottom-0', 'left-0');
  });

  it('should have correct z-index for overlay', () => {
    const { container } = render(
      <MemoryRouter>
        <BottomNavigator />
      </MemoryRouter>
    );

    const bottomNav = container.querySelector('.box');
    expect(bottomNav).toHaveClass('z-50');
  });
});
