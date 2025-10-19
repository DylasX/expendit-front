# Quickstart Guide: Unit Testing in Expendit Front

**Date**: 2025-10-19  
**Branch**: `001-unit-testing-suite`

## Table of Contents

1. [Setup](#setup)
2. [Running Tests](#running-tests)
3. [Writing Your First Test](#writing-your-first-test)
4. [Common Patterns](#common-patterns)
5. [Troubleshooting](#troubleshooting)

---

## Setup

### 1. Install Dependencies

```bash
pnpm add -D msw@^2.x @testing-library/user-event@^14.x @vitest/coverage-v8@^3.2.4
```

### 2. Create vitest.config.ts

The configuration file should already exist. If not, create it at the project root:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{spec}.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 3. Verify vitest.setup.ts

The setup file should already exist with basic configuration. Verify it includes:

```typescript
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

afterEach(() => {
  cleanup();
});
```

---

## Running Tests

### Run all tests
```bash
pnpm test
```

### Run tests in watch mode
```bash
pnpm test:watch
```

### Run tests with coverage
```bash
pnpm test:cov
```

### Run specific test file
```bash
pnpm vitest src/components/Button.spec.tsx
```

### Run tests matching a pattern
```bash
pnpm vitest --grep "Button"
```

### Run tests in UI mode
```bash
pnpm vitest --ui
```

---

## Writing Your First Test

### Step 1: Create a Test File

For a component at `src/components/Button.tsx`, create `src/components/Button.spec.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('should render button with label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
});
```

### Step 2: Run the Test

```bash
pnpm test
```

### Step 3: Add More Tests

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('should render button with label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
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
});
```

---

## Common Patterns

### Testing a Page Component

```typescript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('Home Page', () => {
  it('should render page title', () => {
    renderWithRouter(<Home />);
    expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument();
  });

  it('should render navigation', () => {
    renderWithRouter(<Home />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
```

### Testing a Form

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('should submit form with valid data', async () => {
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

  it('should show validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);
    
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });
});
```

### Testing a Utility Function

```typescript
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('should format positive numbers', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format negative numbers', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should handle null/undefined', () => {
    expect(formatCurrency(null as any)).toBe('$0.00');
    expect(formatCurrency(undefined as any)).toBe('$0.00');
  });
});
```

### Testing an API Hook with MSW

First, set up MSW handlers in `src/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'John Doe',
      email: 'john@example.com',
    });
  }),
];
```

Then create the server in `src/mocks/server.ts`:

```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

Add to `vitest.setup.ts`:

```typescript
import { server } from './src/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

Now test your hook:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { useGetUser } from './useGetUser';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useGetUser', () => {
  it('should fetch user successfully', async () => {
    const { result } = renderHook(() => useGetUser(1), {
      wrapper: createWrapper(),
    });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    });
  });

  it('should handle 404 error', async () => {
    server.use(
      http.get('/api/users/:id', () => {
        return HttpResponse.json(
          { error: 'Not found' },
          { status: 404 }
        );
      })
    );
    
    const { result } = renderHook(() => useGetUser(999), {
      wrapper: createWrapper(),
    });
    
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
```

### Testing a Custom Hook

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should increment count', () => {
    const { result } = renderHook(() => useCounter(0));
    
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
});
```

---

## Troubleshooting

### Issue: "act" warnings

**Problem**: You see warnings about updates not being wrapped in `act()`.

**Solution**: Use `waitFor` or `findBy*` queries for async operations:

```typescript
// ❌ Bad
await user.click(button);
expect(screen.getByText('Loading...')).toBeInTheDocument();

// ✅ Good
await user.click(button);
await waitFor(() => {
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

// ✅ Even better
await user.click(button);
expect(await screen.findByText('Loading...')).toBeInTheDocument();
```

### Issue: Tests timeout

**Problem**: Tests hang and eventually timeout.

**Solution**: 
1. Check for missing `await` on async operations
2. Use `waitFor` with a timeout
3. Ensure MSW handlers are returning responses

```typescript
await waitFor(
  () => {
    expect(result.current.isSuccess).toBe(true);
  },
  { timeout: 5000 }
);
```

### Issue: Cannot find element

**Problem**: `screen.getByRole` or `screen.getByText` throws an error.

**Solution**:
1. Use `screen.debug()` to see the rendered HTML
2. Use `screen.logTestingPlaygroundURL()` to get query suggestions
3. Try `queryBy*` instead of `getBy*` to check if element exists

```typescript
// Debug the rendered output
screen.debug();

// Get query suggestions
screen.logTestingPlaygroundURL();

// Check if element exists without throwing
const element = screen.queryByRole('button');
expect(element).not.toBeInTheDocument();
```

### Issue: Mock not working

**Problem**: vi.mock() or MSW handler not being used.

**Solution**:
1. Ensure vi.mock() is at the top level (not inside describe/it)
2. For MSW, verify server.listen() is called in beforeAll
3. Reset mocks between tests

```typescript
// ✅ Correct placement
vi.mock('./api');

describe('MyComponent', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('should work', () => {
    // test code
  });
});
```

### Issue: Coverage not reaching 90%

**Problem**: Coverage report shows < 90% coverage.

**Solution**:
1. Check which lines are uncovered with `pnpm test:cov`
2. Open `coverage/index.html` in a browser to see visual report
3. Add tests for uncovered branches and error cases

```bash
# Generate coverage report
pnpm test:cov

# Open HTML report
open coverage/index.html
```

### Issue: Flaky tests

**Problem**: Tests pass sometimes and fail other times.

**Solution**:
1. Avoid using timers (setTimeout) - use `waitFor` instead
2. Reset all mocks and state between tests
3. Don't rely on test execution order
4. Use `vi.useFakeTimers()` for time-dependent code

```typescript
describe('MyComponent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should work with timers', () => {
    render(<MyComponent />);
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(screen.getByText('Done')).toBeInTheDocument();
  });
});
```

---

## Next Steps

1. ✅ Setup complete
2. → Write tests for existing components
3. → Achieve 90% coverage
4. → Set up CI/CD integration
5. → Review test patterns documentation in `contracts/test-patterns.md`

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
