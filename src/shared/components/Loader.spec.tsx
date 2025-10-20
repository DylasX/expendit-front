import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

// Mock Logo SVG
vi.mock('@/assets/logo.svg?react', () => ({
  default: ({ className, color }: { className?: string; color?: string }) => (
    <svg data-testid="logo" className={className} data-color={color}>
      Logo
    </svg>
  ),
}));

describe('Loader', () => {
  it('should render loader container', () => {
    const { container } = render(<Loader />);
    
    const loaderContainer = container.querySelector('.loader-container');
    expect(loaderContainer).toBeInTheDocument();
  });

  it('should render logo', () => {
    render(<Loader />);
    
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('should render loading spinner', () => {
    render(<Loader />);
    
    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
  });

  it('should have accessible loading text', () => {
    render(<Loader />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should have sr-only class on loading text', () => {
    const { container } = render(<Loader />);
    
    const loadingText = container.querySelector('.sr-only');
    expect(loadingText).toHaveTextContent('Loading...');
  });

  it('should have full screen height', () => {
    const { container } = render(<Loader />);
    
    const loaderContainer = container.querySelector('.loader-container');
    expect(loaderContainer).toHaveClass('h-screen');
  });

  it('should have correct z-index', () => {
    const { container } = render(<Loader />);
    
    const loaderContainer = container.querySelector('.loader-container');
    expect(loaderContainer).toHaveClass('z-50');
  });

  it('should center content with flex', () => {
    const { container } = render(<Loader />);
    
    const loaderContainer = container.querySelector('.loader-container');
    expect(loaderContainer).toHaveClass('flex', 'items-center', 'justify-center', 'flex-col');
  });

  it('should position logo absolutely', () => {
    render(<Loader />);
    
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveClass('absolute', 'bottom-1/2');
  });

  it('should have correct logo size', () => {
    render(<Loader />);
    
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveClass('w-60', 'h-60');
  });

  it('should set logo color to white', () => {
    render(<Loader />);
    
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveAttribute('data-color', '#fff');
  });

  it('should position spinner absolutely', () => {
    render(<Loader />);
    
    const status = screen.getByRole('status');
    expect(status).toHaveClass('absolute', 'bottom-[55%]');
  });

  it('should have spinner with animation class', () => {
    const { container } = render(<Loader />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should have correct spinner size', () => {
    const { container } = render(<Loader />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  it('should have aria-hidden on spinner svg', () => {
    const { container } = render(<Loader />);
    
    const spinner = container.querySelector('svg.animate-spin');
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });
});
