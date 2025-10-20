import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Capacitor
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    getPlatform: vi.fn(() => 'web'),
  },
}));

// Mock StatusBar
vi.mock('@capacitor/status-bar', () => ({
  StatusBar: {
    setBackgroundColor: vi.fn(),
  },
}));

// Mock child components
vi.mock('@/shared/interceptors/Auth', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-interceptor">{children}</div>,
}));

vi.mock('@/shared/router/Router', () => ({
  default: () => <div data-testid="app-router">Router Content</div>,
}));

vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => <div data-testid="react-query-devtools">DevTools</div>,
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('app-router')).toBeInTheDocument();
  });

  it('should render AuthInterceptor wrapper', () => {
    render(<App />);
    expect(screen.getByTestId('auth-interceptor')).toBeInTheDocument();
  });

  it('should render ReactQueryDevtools', () => {
    render(<App />);
    expect(screen.getByTestId('react-query-devtools')).toBeInTheDocument();
  });

  it('should render AppRouter inside AuthInterceptor', () => {
    render(<App />);
    const authInterceptor = screen.getByTestId('auth-interceptor');
    const appRouter = screen.getByTestId('app-router');
    expect(authInterceptor).toContainElement(appRouter);
  });

  it('should not call StatusBar.setBackgroundColor on web platform', async () => {
    const { Capacitor } = await import('@capacitor/core');
    const { StatusBar } = await import('@capacitor/status-bar');
    
    vi.mocked(Capacitor.getPlatform).mockReturnValue('web');
    
    render(<App />);
    
    expect(StatusBar.setBackgroundColor).not.toHaveBeenCalled();
  });

  it('should call StatusBar.setBackgroundColor on mobile platform', async () => {
    const { Capacitor } = await import('@capacitor/core');
    const { StatusBar } = await import('@capacitor/status-bar');
    
    vi.mocked(Capacitor.getPlatform).mockReturnValue('android');
    
    render(<App />);
    
    expect(StatusBar.setBackgroundColor).toHaveBeenCalledWith({ color: '#27272a' });
  });
});
