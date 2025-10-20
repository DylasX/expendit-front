# Phase 1 Data Model: Unit Testing Suite for Expendit Front

**Date**: 2025-10-19  
**Status**: Complete  
**Branch**: `001-unit-testing-suite`

## Test Data Entities

### 1. Test Suite Entity

**Purpose**: Represents a collection of related test cases for a single source file.

**Fields**:
- `name`: string - Name of the test file (e.g., "Button.spec.tsx")
- `sourceFile`: string - Path to source file being tested
- `testCases`: TestCase[] - Array of test cases
- `coverage`: CoverageMetrics - Coverage statistics
- `duration`: number - Execution time in milliseconds

**Validation Rules**:
- `name` must match pattern `*.spec.ts` or `*.spec.tsx`
- `sourceFile` must exist and be a valid TypeScript/TSX file
- `testCases` must have at least 1 test case
- `coverage.lines` must be >= 90%
- `duration` must be < 5000ms for unit tests

**Relationships**:
- Contains many TestCase entities
- References one source file
- Aggregated into overall project coverage

---

### 2. Test Case Entity

**Purpose**: Represents a single test verifying specific behavior.

**Fields**:
- `name`: string - Test description (e.g., "should render button with correct label")
- `type`: 'unit' | 'integration' - Test classification
- `status`: 'pass' | 'fail' | 'skip' - Current status
- `duration`: number - Execution time in milliseconds
- `assertions`: Assertion[] - Array of assertions
- `setup`: string - Setup code (mocks, fixtures)
- `teardown`: string - Cleanup code

**Validation Rules**:
- `name` must be descriptive and start with "should" or describe behavior
- `type` must be either 'unit' or 'integration'
- `status` must be one of the allowed values
- `duration` must be < 1000ms for unit tests
- `assertions` must have at least 1 assertion

**Relationships**:
- Belongs to one TestSuite
- Contains many Assertion entities
- May use Mock entities

---

### 3. Assertion Entity

**Purpose**: Represents a single assertion within a test case.

**Fields**:
- `type`: 'expect' | 'mock' | 'spy' - Assertion type
- `target`: string - What is being asserted (e.g., "component.textContent")
- `matcher`: string - Assertion matcher (e.g., "toBe", "toContain", "toHaveBeenCalled")
- `expected`: any - Expected value
- `actual`: any - Actual value (populated at runtime)

**Validation Rules**:
- `type` must be one of the allowed values
- `target` must be a valid JavaScript expression
- `matcher` must be a valid Vitest/jest-dom matcher
- `expected` must match the type expected by matcher

**Common Matchers**:
- `toBe`, `toEqual`, `toStrictEqual`
- `toBeInTheDocument`, `toHaveTextContent` (jest-dom)
- `toHaveBeenCalled`, `toHaveBeenCalledWith` (mocks)
- `toHaveAccessibleName`, `toHaveAccessibleDescription` (a11y)

**Relationships**:
- Belongs to one TestCase

---

### 4. Mock Entity

**Purpose**: Represents a mocked dependency (API, function, module).

**Fields**:
- `name`: string - Mock identifier (e.g., "fetchUser")
- `type`: 'function' | 'module' | 'http' - Mock type
- `implementation`: string - Mock implementation code
- `callCount`: number - Number of times called
- `callArgs`: any[][] - Arguments passed to mock
- `returnValue`: any - Value returned by mock

**Validation Rules**:
- `name` must be a valid identifier
- `type` must be one of the allowed values
- `implementation` must be valid JavaScript
- `callCount` must be >= 0
- `callArgs` must be an array of arrays

**Mock Types**:
- **function**: vi.fn() or vi.spyOn()
- **module**: vi.mock('module-name')
- **http**: MSW request handlers

**Relationships**:
- Used by TestCase entities
- Can mock external dependencies (API, utilities, modules)

---

### 5. Coverage Metrics Entity

**Purpose**: Represents code coverage statistics for a test suite.

**Fields**:
- `lines`: number - Percentage of lines covered (0-100)
- `statements`: number - Percentage of statements covered (0-100)
- `functions`: number - Percentage of functions covered (0-100)
- `branches`: number - Percentage of branches covered (0-100)
- `uncoveredLines`: string[] - List of uncovered line numbers
- `uncoveredBranches`: string[] - List of uncovered branch descriptions

**Validation Rules**:
- All percentages must be between 0 and 100
- `lines` must be >= 90% (minimum threshold)
- `statements` must be >= 90%
- `functions` must be >= 90%
- `branches` must be >= 90%
- `uncoveredLines` must be an array of valid line numbers

**Relationships**:
- Belongs to one TestSuite
- Aggregated into overall project coverage

---

### 6. Test Configuration Entity

**Purpose**: Represents Vitest and testing library configuration.

**Fields**:
- `environment`: 'jsdom' | 'node' - Test environment
- `globals`: boolean - Use global test functions (describe, it, expect)
- `coverage`: CoverageConfig - Coverage configuration
- `setupFiles`: string[] - Setup files to run before tests
- `testMatch`: string[] - Glob patterns for test files
- `timeout`: number - Test timeout in milliseconds

**Validation Rules**:
- `environment` must be 'jsdom' for component tests
- `globals` should be true for consistency
- `coverage.lines` must be >= 90
- `coverage.statements` must be >= 90
- `coverage.functions` must be >= 90
- `coverage.branches` must be >= 90
- `setupFiles` must reference existing files
- `testMatch` must include `**/*.spec.ts` and `**/*.spec.tsx`
- `timeout` must be >= 5000ms

**Relationships**:
- Applies to all TestSuite entities in project
- Defined in vitest.config.ts

---

### 7. Component Test Data Entity

**Purpose**: Represents test data for React component testing.

**Fields**:
- `componentName`: string - Name of component being tested
- `props`: Record<string, any> - Default props for testing
- `expectedOutput`: string - Expected rendered HTML/text
- `userInteractions`: UserInteraction[] - Simulated user actions
- `accessibilityChecks`: AccessibilityCheck[] - A11y assertions

**Validation Rules**:
- `componentName` must match actual component name
- `props` must be valid for the component's TypeScript interface
- `expectedOutput` must be valid HTML or text content
- `userInteractions` must be valid user actions (click, type, etc.)
- `accessibilityChecks` must reference valid ARIA attributes

**User Interactions**:
- `click`: userEvent.click(element)
- `type`: userEvent.type(input, 'text')
- `keyboard`: userEvent.keyboard('{Enter}')
- `hover`: userEvent.hover(element)

**Accessibility Checks**:
- `toHaveAccessibleName`
- `toHaveAccessibleDescription`
- `toBeInTheDocument` with role queries
- Keyboard navigation tests

**Relationships**:
- Used by component TestCase entities
- References React component

---

### 8. API Test Data Entity

**Purpose**: Represents test data for API integration testing.

**Fields**:
- `endpoint`: string - API endpoint URL
- `method`: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' - HTTP method
- `requestBody`: any - Request payload
- `responseBody`: any - Expected response
- `statusCode`: number - Expected HTTP status
- `errorScenarios`: ErrorScenario[] - Error cases to test

**Validation Rules**:
- `endpoint` must be a valid URL path
- `method` must be one of the allowed HTTP methods
- `requestBody` must match API schema
- `responseBody` must match Zod schema
- `statusCode` must be a valid HTTP status code (200-599)
- `errorScenarios` must include common errors (timeout, 500, 404, 401)

**Error Scenarios**:
- Network timeout
- 500 Internal Server Error
- 404 Not Found
- 401 Unauthorized
- 400 Bad Request with validation errors

**Relationships**:
- Used by API TestCase entities
- References React Query hooks
- Mocked by MSW handlers

---

### 9. Form Test Data Entity

**Purpose**: Represents test data for Formik form testing.

**Fields**:
- `formName`: string - Name of form component
- `fields`: FormField[] - Form fields
- `validSubmission`: any - Valid form data
- `invalidSubmissions`: InvalidSubmission[] - Invalid data scenarios
- `validationSchema`: string - Zod schema definition

**Validation Rules**:
- `formName` must match actual form component name
- `fields` must have at least 1 field
- `validSubmission` must pass Zod validation schema
- `invalidSubmissions` must fail validation with specific errors
- `validationSchema` must be valid Zod schema code

**Form Fields**:
- `name`: Field identifier
- `type`: input | textarea | select | checkbox | radio
- `label`: Accessible label text
- `validation`: Zod validation rules

**Invalid Submission Scenarios**:
- Required field missing
- Invalid email format
- Password too short
- Number out of range
- Invalid date format

**Relationships**:
- Used by form TestCase entities
- References Formik form components
- References Zod validation schemas

---

### 10. Utility Test Data Entity

**Purpose**: Represents test data for utility function testing.

**Fields**:
- `functionName`: string - Name of utility function
- `testCases`: UtilityTestCase[] - Input/output pairs
- `edgeCases`: EdgeCase[] - Edge case scenarios
- `errorCases`: ErrorCase[] - Error scenarios

**Validation Rules**:
- `functionName` must match actual function name
- `testCases` must have at least 3 cases (normal, boundary, edge)
- `edgeCases` must include null, undefined, empty values
- `errorCases` must include invalid inputs that throw errors

**Test Case Categories**:
- **Normal cases**: Typical valid inputs
- **Boundary cases**: Min/max values, empty strings, zero
- **Edge cases**: null, undefined, NaN, Infinity
- **Error cases**: Invalid types, out-of-range values

**Relationships**:
- Used by utility TestCase entities
- References utility functions in src/utils/ and src/shared/utils/

---

## Test Data Relationships

```
TestSuite (1) ──→ (many) TestCase
TestSuite (1) ──→ (1) CoverageMetrics
TestCase (1) ──→ (many) Assertion
TestCase (1) ──→ (many) Mock
ComponentTestData ──→ TestCase
APITestData ──→ TestCase
FormTestData ──→ TestCase
UtilityTestData ──→ TestCase
TestConfiguration ──→ (all) TestSuite
```

---

## Coverage Thresholds by Category

| Category | Minimum | Target | Priority |
|----------|---------|--------|----------|
| Components (`src/shared/components/`) | 90% | 90% | P1 |
| Pages (`src/pages/`) | 90% | 90% | P1 |
| Utilities (`src/shared/utils/`) | 90% | 90% | P1 |
| API/Services (`src/shared/services/`, `src/shared/client/`) | 90% | 90% | P1 |
| Interceptors (`src/shared/interceptors/`) | 90% | 90% | P1 |
| Layouts (`src/shared/layouts/`) | 90% | 90% | P1 |
| Router (`src/shared/router/`) | 90% | 90% | P1 |
| Types (`src/shared/types/`) | 90% | 90% | P2 |
| **Overall** | **90%** | **90%** | **P1** |

---

## Test File Naming Convention

| Source File | Test File |
|-------------|-----------|
| `Button.tsx` | `Button.spec.tsx` |
| `utils.ts` | `utils.spec.ts` |
| `Home.tsx` | `Home.spec.tsx` |
| `request.ts` | `request.spec.ts` |

---

## Next Steps

1. ✅ Phase 0 Research Complete
2. ✅ Phase 1 Data Model Complete
3. → Create contracts/ directory with test configuration specs
4. → Create quickstart.md with testing patterns
5. → Update agent context
6. → Phase 2: Generate tasks.md with implementation roadmap
