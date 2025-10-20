import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRouter from './Router';

// Mock all page components
vi.mock('@/pages/add/Add', () => ({
  default: () => <div>Add Page</div>,
}));

vi.mock('@/pages/detailGroup/DetailGroup', () => ({
  default: () => <div>Detail Group Page</div>,
}));

vi.mock('@/pages/groups/Groups', () => ({
  default: () => <div>Groups Page</div>,
}));

vi.mock('@/pages/home/Home', () => ({
  default: () => <div>Home Page</div>,
}));

vi.mock('@/pages/invitations/Invitations', () => ({
  default: () => <div>Invitations Page</div>,
}));

vi.mock('@/pages/login/Login', () => ({
  default: () => <div>Login Page</div>,
}));

vi.mock('@/pages/profile/Profile', () => ({
  default: () => <div>Profile Page</div>,
}));

vi.mock('@/pages/expenses/Expense', () => ({
  default: () => <div>Expense Detail Page</div>,
}));

// Mock MainLayout
vi.mock('@/shared/layouts/Main', () => ({
  default: () => {
    const { Outlet } = require('react-router-dom');
    return (
      <div data-testid="main-layout">
        <Outlet />
      </div>
    );
  },
}));

// Mock useUser hook
const mockUseUser = vi.fn();
vi.mock('@/pages/login/hooks/useUser', () => ({
  useUser: () => mockUseUser(),
}));

// Mock Logo SVG
vi.mock('@/assets/logo.svg?react', () => ({
  default: () => <svg data-testid="logo">Logo</svg>,
}));

describe('AppRouter', () => {
  describe('Public Routes', () => {
    it('should render login page on /login route', () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('should render 404 page for unknown routes', () => {
      render(
        <MemoryRouter initialEntries={['/unknown-route']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('404')).toBeInTheDocument();
    });
  });

  describe('Protected Routes - Authenticated', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        data: { id: 1, name: 'Test User' },
        isLoading: false,
      });
    });

    it('should render home page on / route when authenticated', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    it('should render groups page on /groups route when authenticated', () => {
      render(
        <MemoryRouter initialEntries={['/groups']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Groups Page')).toBeInTheDocument();
    });

    it('should render invitations page on /invitations route when authenticated', () => {
      render(
        <MemoryRouter initialEntries={['/invitations']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Invitations Page')).toBeInTheDocument();
    });

    it('should render add page on /add route when authenticated', () => {
      render(
        <MemoryRouter initialEntries={['/add']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Add Page')).toBeInTheDocument();
    });

    it('should render profile page on /profile route when authenticated', () => {
      render(
        <MemoryRouter initialEntries={['/profile']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Profile Page')).toBeInTheDocument();
    });

    it('should render detail group page on /group/:id route when authenticated', () => {
      render(
        <MemoryRouter initialEntries={['/group/123']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Detail Group Page')).toBeInTheDocument();
    });

    it('should render expense detail page on /expense/:id route when authenticated', () => {
      render(
        <MemoryRouter initialEntries={['/expense/456']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Expense Detail Page')).toBeInTheDocument();
    });
  });

  describe('Protected Routes - Unauthenticated', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        data: null,
        isLoading: false,
      });
    });

    it('should redirect to /login when accessing / without authentication', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('should redirect to /login when accessing /groups without authentication', () => {
      render(
        <MemoryRouter initialEntries={['/groups']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('should redirect to /login when accessing /profile without authentication', () => {
      render(
        <MemoryRouter initialEntries={['/profile']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  describe('ProtectedRoute Component', () => {
    it('should render children when user is authenticated', () => {
      mockUseUser.mockReturnValue({
        data: { id: 1 },
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={['/']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    it('should navigate to login when user is not authenticated', () => {
      mockUseUser.mockReturnValue({
        data: null,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={['/']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });
});
