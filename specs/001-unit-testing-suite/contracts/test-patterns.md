# Test Patterns Contract

**Status**: Phase 1 Design  
**Date**: 2025-10-19

## Component Testing Patterns

### Basic Component Test

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button Component', () => {
  it('should render button with correct label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button label="Click me" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should have correct accessibility attributes', () => {
    render(<Button label="Submit form" aria-label="Submit the registration form" />);
    expect(screen.getByRole('button')).toHaveAccessibleName('Submit the registration form');
  });
});
```

### Component with Props Validation

```typescript
describe('Card Component', () => {
  it('should render with required props', () => {
    render(<Card title="Test Title" content="Test Content" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render optional image when provided', () => {
    render(<Card title="Test" content="Content" image="/test.jpg" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/test.jpg');
  });

  it('should not render image when not provided', () => {
    render(<Card title="Test" content="Content" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
```

### Component with Conditional Rendering

```typescript
describe('Alert Component', () => {
  it('should render success variant with green styling', () => {
    render(<Alert variant="success" message="Success!" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-green-500');
    expect(alert).toHaveTextContent('Success!');
  });

  it('should render error variant with red styling', () => {
    render(<Alert variant="error" message="Error!" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-red-500');
    expect(alert).toHaveTextContent('Error!');
  });

  it('should not render when message is empty', () => {
    render(<Alert variant="success" message="" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
```

### Component with User Interactions

```typescript
describe('Dropdown Component', () => {
  it('should toggle dropdown on button click', async () => {
    const user = userEvent.setup();
    render(<Dropdown label="Select option" options={['Option 1', 'Option 2']} />);
    
    // Initially closed
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    
    // Click to open
    await user.click(screen.getByRole('button', { name: /select option/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    // Click to close
    await user.click(screen.getByRole('button', { name: /select option/i }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('should call onChange when option is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Dropdown label="Select" options={['A', 'B']} onChange={handleChange} />);
    
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('option', { name: 'A' }));
    
    expect(handleChange).toHaveBeenCalledWith('A');
  });
});
```

## Form Testing Patterns

### Formik Form with Validation

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('should display validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);
    
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should display error for invalid email format', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);
    
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('should call onSubmit with form data when valid', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<LoginForm onSubmit={handleSubmit} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
```

### Zod Schema Validation

```typescript
import { z } from 'zod';
import { userSchema } from './schemas';

describe('User Schema', () => {
  it('should validate correct user data', () => {
    const validUser = {
      email: 'test@example.com',
      name: 'John Doe',
      age: 25,
    };
    
    expect(() => userSchema.parse(validUser)).not.toThrow();
  });

  it('should reject invalid email', () => {
    const invalidUser = {
      email: 'not-an-email',
      name: 'John Doe',
      age: 25,
    };
    
    expect(() => userSchema.parse(invalidUser)).toThrow();
  });

  it('should reject age below minimum', () => {
    const invalidUser = {
      email: 'test@example.com',
      name: 'John Doe',
      age: 17,
    };
    
    expect(() => userSchema.parse(invalidUser)).toThrow(/age must be at least 18/i);
  });
});
```

## API Testing Patterns

### React Query Hook with MSW

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { useGetUser } from './useGetUser';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useGetUser', () => {
  it('should fetch user data successfully', async () => {
    server.use(
      http.get('/api/users/1', () => {
        return HttpResponse.json({
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        });
      })
    );
    
    const { result } = renderHook(() => useGetUser(1), {
      wrapper: createWrapper(),
    });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    });
  });

  it('should handle error response', async () => {
    server.use(
      http.get('/api/users/1', () => {
        return HttpResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      })
    );
    
    const { result } = renderHook(() => useGetUser(1), {
      wrapper: createWrapper(),
    });
    
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });

  it('should handle network error', async () => {
    server.use(
      http.get('/api/users/1', () => {
        return HttpResponse.error();
      })
    );
    
    const { result } = renderHook(() => useGetUser(1), {
      wrapper: createWrapper(),
    });
    
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
```

### Axios Request with Mock

```typescript
import { vi } from 'vitest';
import axios from 'axios';
import { fetchUserData } from './api';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('fetchUserData', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return user data on success', async () => {
    const mockData = { id: 1, name: 'John' };
    mockedAxios.get.mockResolvedValue({ data: mockData });
    
    const result = await fetchUserData(1);
    
    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/users/1');
  });

  it('should throw error on failure', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));
    
    await expect(fetchUserData(1)).rejects.toThrow('Network error');
  });
});
```

## Utility Function Testing Patterns

### Pure Function Tests

```typescript
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('should format positive numbers correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format negative numbers correctly', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should round to 2 decimal places', () => {
    expect(formatCurrency(1234.567)).toBe('$1,234.57');
  });

  it('should handle edge cases', () => {
    expect(formatCurrency(null as any)).toBe('$0.00');
    expect(formatCurrency(undefined as any)).toBe('$0.00');
    expect(formatCurrency(NaN)).toBe('$0.00');
  });
});
```

### Async Utility Function

```typescript
import { delay } from './delay';

describe('delay', () => {
  it('should resolve after specified time', async () => {
    const start = Date.now();
    await delay(100);
    const end = Date.now();
    
    expect(end - start).toBeGreaterThanOrEqual(100);
  });

  it('should handle zero delay', async () => {
    await expect(delay(0)).resolves.toBeUndefined();
  });
});
```

## Custom Hook Testing Patterns

### Hook with State

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('should increment count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('should decrement count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });

  it('should reset count', () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.increment();
      result.current.increment();
    });
    
    expect(result.current.count).toBe(12);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.count).toBe(10);
  });
});
```

### Hook with Side Effects

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('key')).toBe(JSON.stringify('updated'));
  });

  it('should load value from localStorage on mount', () => {
    localStorage.setItem('key', JSON.stringify('stored'));
    
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    
    expect(result.current[0]).toBe('stored');
  });
});
```

## Router Testing Patterns

### Component with Navigation

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from './Navigation';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('Navigation', () => {
  it('should render navigation links', () => {
    renderWithRouter(<Navigation />);
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('should highlight active link', () => {
    renderWithRouter(<Navigation />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveClass('active');
  });
});
```

## Accessibility Testing Patterns

### ARIA Attributes

```typescript
describe('Modal Component', () => {
  it('should have correct ARIA attributes', () => {
    render(<Modal isOpen={true} title="Test Modal" onClose={vi.fn()} />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby');
  });

  it('should trap focus within modal', async () => {
    const user = userEvent.setup();
    render(<Modal isOpen={true} title="Test" onClose={vi.fn()} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    closeButton.focus();
    
    await user.keyboard('{Tab}');
    
    // Focus should stay within modal
    expect(document.activeElement).not.toBe(document.body);
  });

  it('should close on Escape key', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<Modal isOpen={true} title="Test" onClose={handleClose} />);
    
    await user.keyboard('{Escape}');
    
    expect(handleClose).toHaveBeenCalled();
  });
});
```

## Error Boundary Testing

```typescript
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should render error UI when error occurs', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    
    spy.mockRestore();
  });
});
```

## Best Practices

1. **Use user-centric queries**: Prefer `getByRole`, `getByLabelText`, `getByText` over `getByTestId`
2. **Test behavior, not implementation**: Focus on what users see and do
3. **Avoid testing implementation details**: Don't test state or props directly
4. **Use async utilities**: Always use `waitFor`, `findBy*` for async operations
5. **Clean up after tests**: Use `afterEach(cleanup)` and reset mocks
6. **Mock external dependencies**: Use MSW for HTTP, vi.mock() for modules
7. **Test accessibility**: Include ARIA and keyboard navigation tests
8. **Keep tests isolated**: Each test should be independent
9. **Use descriptive test names**: Describe what the test verifies
10. **Follow AAA pattern**: Arrange, Act, Assert
