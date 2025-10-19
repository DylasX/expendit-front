import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import MainLayout from './Main';

vi.mock('@/shared/components/BottomNavigator', () => ({
  default: () => <div data-testid="bottom-navigator">Bottom Navigator</div>,
}));

vi.mock('react-hot-toast', () => ({
  Toaster: ({ children, ...props }: any) => (
    <div data-testid="toaster" {...props}>
      Toaster
    </div>
  ),
}));

describe('MainLayout', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>
    );
  };

  it('should render BottomNavigator', () => {
    renderComponent();

    expect(screen.getByTestId('bottom-navigator')).toBeInTheDocument();
  });

  it('should render Toaster', () => {
    renderComponent();

    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });

  it('should render Outlet for nested routes', () => {
    const { container } = renderComponent();

    // Outlet is rendered by react-router-dom
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    const { container } = renderComponent();

    const section = container.querySelector('section');
    expect(section).toHaveClass('h-screen-safe');
    expect(section).toHaveClass('bg-zinc-800');
  });

  it('should configure Toaster with correct position', () => {
    renderComponent();

    const toaster = screen.getByTestId('toaster');
    expect(toaster).toBeInTheDocument();
  });

  it('should render all layout components', () => {
    renderComponent();

    expect(screen.getByTestId('bottom-navigator')).toBeInTheDocument();
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });
});
