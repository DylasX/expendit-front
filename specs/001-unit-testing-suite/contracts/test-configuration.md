# Test Configuration Contract

**Status**: Phase 1 Design  
**Date**: 2025-10-19

## vitest.config.ts Specification

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Environment
    environment: 'jsdom',
    globals: true,
    
    // File patterns
    include: ['src/**/*.{spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'android', 'ios'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/**/*.d.ts',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        'src/vite-env.d.ts',
        'src/assets/**',
      ],
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
      all: true,
    },
    
    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Setup
    setupFiles: ['./vitest.setup.ts'],
    
    // Reporters
    reporters: ['verbose'],
    
    // Watch mode
    watch: false,
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## vitest.setup.ts Specification

```typescript
import { expect, afterEach, vi, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
global.localStorage = localStorageMock as any;

// Mock sessionStorage
global.sessionStorage = localStorageMock as any;

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

// Suppress console errors in tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('Warning: useLayoutEffect'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

## package.json Scripts

The following scripts are already configured in package.json:

```json
{
  "scripts": {
    "test": "vitest",
    "test:cov": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

## Dependencies to Install

Run the following command to install missing dependencies:

```bash
pnpm add -D msw@^2.x @testing-library/user-event@^14.x @vitest/coverage-v8@^3.2.4
```

### Already Installed Dependencies

✅ vitest@3.2.4  
✅ @testing-library/react@16.3.0  
✅ @testing-library/jest-dom@6.9.1  
✅ @testing-library/dom@10.4.1  
✅ jsdom@27.0.1  
✅ @vitejs/plugin-react@5.0.4  
✅ typescript@5.9.3  

### To Be Installed

⚠️ msw@^2.x - HTTP mocking  
⚠️ @testing-library/user-event@^14.x - User interaction simulation  
⚠️ @vitest/coverage-v8@^3.2.4 - Coverage reporting  

## Environment Variables for Tests

Create `.env.test` (optional):

```env
VITE_API_URL=http://localhost:3000/api
VITE_ENV=test
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm test:cov
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true
```

## Coverage Enforcement

Tests will fail if:
- Line coverage < 90%
- Function coverage < 90%
- Branch coverage < 90%
- Statement coverage < 90%

Override with `--no-coverage` flag if needed during development (not recommended for CI).

## Debugging Tests

### Run single test file
```bash
pnpm vitest src/components/Button.spec.tsx
```

### Run tests matching pattern
```bash
pnpm vitest --grep "Button"
```

### Run tests in UI mode
```bash
pnpm vitest --ui
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "pnpm",
  "runtimeArgs": ["vitest", "--inspect-brk", "--no-coverage", "--run"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## MSW Setup (HTTP Mocking)

### Create MSW Handlers

Create `src/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Example: Mock GET /api/users
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ]);
  }),
  
  // Example: Mock POST /api/login
  http.post('/api/login', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      token: 'mock-token',
      user: body,
    });
  }),
];
```

### Create MSW Server

Create `src/mocks/server.ts`:

```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### Integrate MSW in vitest.setup.ts

Add to `vitest.setup.ts`:

```typescript
import { server } from './src/mocks/server';

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());
```

## Test Utilities

### Create Test Wrapper

Create `src/test-utils/wrapper.tsx`:

```typescript
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Usage in Tests

```typescript
import { render, screen } from '@/test-utils/wrapper';
import MyComponent from './MyComponent';

test('renders with providers', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```
