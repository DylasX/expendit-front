# Phase 0 Research: Unit Testing Suite for Expendit Front

**Date**: 2025-10-19  
**Status**: Complete  
**Branch**: `001-unit-testing-suite`

## Research Findings

### 1. Test Runner Selection: Vitest

**Decision**: Use **Vitest 3.2.4** as the primary test runner (already installed).

**Rationale**:
- Native ESM support with TypeScript out-of-the-box
- Drop-in Jest replacement with faster execution
- Excellent Vite integration (project already uses Vite 7.1.10)
- Superior watch mode performance for development workflow
- Built-in coverage reporting with v8
- Already installed in project dependencies

**Alternatives Considered**:
- Jest: Slower, requires additional configuration for ESM/TypeScript
- Playwright: Overkill for unit tests, better for E2E
- Mocha: Requires additional setup for assertions and mocking

**Evidence**: Vitest is the standard for modern React + TypeScript projects with Vite. Project already has vitest.setup.ts configured.

---

### 2. Component Testing Library: React Testing Library

**Decision**: Use **React Testing Library 16.3.0** for component testing (already installed).

**Rationale**:
- Encourages testing user behavior, not implementation details
- Excellent accessibility testing support (ARIA queries)
- Works seamlessly with Vitest and jsdom
- Large ecosystem and community support
- Aligns with constitution's accessibility principle (Principle IV)
- Already installed in project devDependencies

**Alternatives Considered**:
- Enzyme: Deprecated, encourages implementation-detail testing
- Testing Library alternatives: RTL is the standard for React

**Evidence**: React Testing Library is the industry standard for React component testing. Project already has @testing-library/react@16.3.0 and @testing-library/jest-dom@6.9.1 installed.

---

### 3. DOM Environment: jsdom

**Decision**: Use **jsdom 27.0.1** as the DOM environment for Vitest (already installed).

**Rationale**:
- Lightweight JavaScript implementation of web standards
- Sufficient for component unit tests
- Faster than Puppeteer/Playwright for unit tests
- Standard choice for Jest/Vitest projects
- Supports all necessary DOM APIs for React components
- Already installed in project

**Alternatives Considered**:
- happy-dom: Faster but less mature
- Puppeteer: Overkill for unit tests, better for E2E

**Evidence**: jsdom is the standard for React unit testing environments. Project already has jsdom@27.0.1 installed.

---

### 4. HTTP Mocking Strategy: MSW (Mock Service Worker)

**Decision**: Use **MSW (Mock Service Worker)** for HTTP mocking in tests (needs installation).

**Rationale**:
- Intercepts requests at the network level (not library-specific)
- Works with Axios 1.12.2, Fetch, React Query 5.90.5 seamlessly
- Enables realistic async testing patterns
- Supports error scenarios and edge cases
- Can be reused for E2E tests later
- Recommended by React Query documentation

**Alternatives Considered**:
- vi.mock() + manual mocks: Works but less realistic
- Nock: Node.js specific, less flexible
- Mock Adapter: Library-specific, less portable

**Evidence**: MSW is recommended by React Query and React Testing Library communities for testing API integrations.

**Action Required**: Install msw@^2.x as devDependency.

---

### 5. Async Testing Patterns

**Decision**: Use **waitFor()**, **findBy*** queries, and **renderHook()** from React Testing Library for async operations.

**Rationale**:
- Handles React state updates and side effects correctly
- Prevents "act" warnings in tests
- Works with React Query's async queries
- Supports timeout configuration for flaky tests
- Recommended by React Testing Library documentation

**Patterns**:
- `waitFor()` for async state changes
- `screen.findBy*()` queries for async elements (built-in waitFor)
- `renderHook()` for custom hook testing
- `act()` for manual state updates (usually automatic)

**Evidence**: These are the recommended patterns in React Testing Library v16+.

---

### 6. Form Testing with Formik + Zod

**Decision**: Test Formik forms with user interactions + Zod schema validation separately.

**Rationale**:
- Test form rendering, validation display, and submission separately
- Mock form submission handlers with vi.fn()
- Test Zod schemas independently with direct function calls
- Prevents tight coupling between form UI and validation logic
- Aligns with constitution's Data Integrity principle (Principle V)
- Project uses Formik 2.4.6 and Zod 4.1.12

**Pattern**:
```typescript
// Test Zod schema independently
const schema = z.object({ email: z.string().email() });
expect(() => schema.parse({ email: 'invalid' })).toThrow();

// Test Formik form UI
render(<MyForm onSubmit={vi.fn()} />);
await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
await userEvent.click(screen.getByRole('button', { name: /submit/i }));
```

**Evidence**: Recommended approach in Formik and Zod documentation.

---

### 7. React Query Testing

**Decision**: Mock API responses with MSW, test hook behavior with renderHook().

**Rationale**:
- MSW intercepts React Query requests at network level
- renderHook() from React Testing Library enables hook testing
- Supports cache invalidation and retry logic testing
- Enables realistic async patterns
- Project uses @tanstack/react-query@5.90.5

**Pattern**:
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';

test('fetches data', async () => {
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  
  const { result } = renderHook(() => useGetUser(), { wrapper });
  
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
```

**Evidence**: Recommended in React Query testing documentation.

---

### 8. Coverage Targets

**Decision**: Set minimum coverage thresholds by category.

**Rationale**:
- Components: 90% (UI logic is critical)
- Pages: 90% (user-facing, critical paths)
- Utilities: 90% (pure functions should be fully tested)
- API layer: 90% (data integrity is critical per Principle V)
- Interceptors/Layouts/Router: 90% (infrastructure code)
- Types: 90% (type utilities need validation)
- Overall: 90% (high bar for quality)

**Enforcement**:
- Vitest coverage thresholds in vitest.config.ts
- CI/CD will fail if coverage drops below thresholds
- Coverage reports generated on every test run

**Evidence**: Aligns with constitution's Test-First Development principle (Principle III). User specified 90% targets in spec.md.

---

### 9. Test File Organization

**Decision**: Colocate test files with source files (`.spec.ts`/`.spec.tsx` naming).

**Rationale**:
- Improves discoverability (test is right next to source)
- Encourages test maintenance alongside code changes
- Simplifies imports (same directory)
- Matches industry standard for React projects
- Easier to delete tests when removing features
- User explicitly requested this structure

**Structure**:
```
src/
├── components/
│   ├── Button.tsx
│   └── Button.spec.tsx
├── utils/
│   ├── format.ts
│   └── format.spec.ts
```

**Evidence**: Standard practice in modern React projects (Next.js, Remix, etc.). User confirmed this requirement.

---

### 10. CI Integration

**Decision**: Run tests on every PR, enforce coverage thresholds, generate reports.

**Rationale**:
- Prevents untested code from being merged
- Makes test quality visible to reviewers
- Catches regressions early
- Aligns with constitution's Test-First Development principle (Principle III)
- Supports development workflow (Principle: Development Workflow)

**Implementation**:
- Use existing CI system (GitHub Actions or similar)
- Run `pnpm test:cov` on every PR
- Fail if coverage drops below 90% thresholds
- Comment coverage report on PR

**Evidence**: Standard practice for maintaining code quality. Already have test scripts in package.json.

---

## Technical Stack Summary

| Component | Technology | Version | Status |
|-----------|-----------|---------|--------|
| Test Runner | Vitest | 3.2.4 | ✅ Installed |
| Component Testing | React Testing Library | 16.3.0 | ✅ Installed |
| Jest DOM Matchers | @testing-library/jest-dom | 6.9.1 | ✅ Installed |
| DOM Testing | @testing-library/dom | 10.4.1 | ✅ Installed |
| DOM Environment | jsdom | 27.0.1 | ✅ Installed |
| HTTP Mocking | MSW | 2.x | ⚠️ Needs Installation |
| User Event | @testing-library/user-event | 14.x | ⚠️ Needs Installation |
| Coverage | @vitest/coverage-v8 | 3.x | ⚠️ Needs Installation |
| Language | TypeScript | 5.9.3 | ✅ Installed |
| React | React | 19.2.0 | ✅ Installed |
| Form Library | Formik | 2.4.6 | ✅ Installed |
| Validation | Zod | 4.1.12 | ✅ Installed |
| API Client | React Query | 5.90.5 | ✅ Installed |
| HTTP Client | Axios | 1.12.2 | ✅ Installed |

---

## Dependencies to Install

```bash
pnpm add -D msw@^2.x @testing-library/user-event@^14.x @vitest/coverage-v8@^3.2.4
```

---

## Next Steps

1. ✅ Phase 0 Research Complete
2. → Phase 1: Generate data-model.md, contracts/, quickstart.md
3. → Phase 1: Update agent context
4. → Phase 2: Generate tasks.md with implementation roadmap
