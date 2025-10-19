import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReactDOM from 'react-dom/client';

// Mock ReactDOM
vi.mock('react-dom/client', () => ({
  default: {
    createRoot: vi.fn(() => ({
      render: vi.fn(),
    })),
  },
}));

// Mock App component
vi.mock('./App.tsx', () => ({
  default: () => <div>App</div>,
}));

// Mock CSS imports
vi.mock('@fontsource-variable/nunito', () => ({}));
vi.mock('./index.css', () => ({}));

describe('main', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    // Setup DOM
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('should call ReactDOM.createRoot with root element', async () => {
    await import('./main');
    
    const rootElement = document.getElementById('root');
    expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootElement);
  });

  it('should render App in StrictMode', async () => {
    const mockRender = vi.fn();
    vi.mocked(ReactDOM.createRoot).mockReturnValue({
      render: mockRender,
      unmount: vi.fn(),
    } as any);

    await import('./main');
    
    expect(mockRender).toHaveBeenCalled();
  });
});
