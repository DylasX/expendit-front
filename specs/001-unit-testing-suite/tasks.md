# Implementation Tasks: Unit Testing Suite for Expendit Front

**Branch**: `001-unit-testing-suite`  
**Date**: 2025-10-19  
**Status**: Ready for Implementation

## Overview

This document provides a complete task breakdown for implementing comprehensive unit test coverage across the Expendit Front application. Tasks are organized by user story to enable independent implementation and testing.

**Total Tasks**: 66  
**Estimated Duration**: 8-10 days  
**MVP Scope**: User Story 1 (Component Tests) - 25 tasks

---

## Phase 1: Setup & Configuration

**Goal**: Configure test infrastructure and tooling

**Tasks**:

- [X] T001 Create vitest.config.ts with jsdom environment and coverage thresholds in project root
- [X] T002 [P] Create MSW handlers file in src/mocks/handlers.ts for API mocking
- [X] T003 [P] Create MSW server setup in src/mocks/server.ts
- [X] T004 Update vitest.setup.ts to integrate MSW server (beforeAll, afterEach, afterAll)
- [X] T005 [P] Create test utilities wrapper in src/test-utils/wrapper.tsx with QueryClient and Router providers
- [X] T006 [P] Create .github/workflows/test.yml for CI integration (if using GitHub Actions)
- [X] T007 Verify all dependencies installed (msw@2.11.5, @testing-library/user-event@14.6.1, @vitest/coverage-v8@3.2.4)

**Completion Criteria**:
- ✅ `pnpm test` runs successfully
- ✅ `pnpm test:cov` generates coverage report
- ✅ vitest.config.ts enforces 90% coverage thresholds
- ✅ MSW server intercepts HTTP requests in tests

---

## Phase 2: Foundational Tests

**Goal**: Establish test patterns and foundational infrastructure tests

**Tasks**:

- [X] T008 [P] Create test for src/App.tsx in src/App.spec.tsx
- [X] T009 [P] Create test for src/main.tsx in src/main.spec.tsx
- [X] T010 [P] Create test for src/shared/client/queryClient.ts in src/shared/client/queryClient.spec.ts
- [X] T011 [P] Create test for src/shared/router/Router.tsx in src/shared/router/Router.spec.tsx

**Completion Criteria**:
- ✅ All foundational tests pass
- ✅ Test patterns established for components, utilities, and hooks
- ✅ MSW integration verified

---

## Phase 3: User Story 1 - Component Unit Test Coverage (P1)

**Goal**: Establish comprehensive unit tests for all React components

**Independent Test**: Run `pnpm test src/shared/components src/pages` and verify 90% coverage for all component files

### Shared Components Tests

- [X] T012 [P] [US1] Create test for src/shared/components/BottomNavigator.tsx in src/shared/components/BottomNavigator.spec.tsx
- [X] T013 [P] [US1] Create test for src/shared/components/Drawer.tsx in src/shared/components/Drawer.spec.tsx
- [X] T014 [P] [US1] Create test for src/shared/components/Dropdown.tsx in src/shared/components/Dropdown.spec.tsx
- [X] T015 [P] [US1] Create test for src/shared/components/Header.tsx in src/shared/components/Header.spec.tsx
- [X] T016 [P] [US1] Create test for src/shared/components/Icon.tsx in src/shared/components/Icon.spec.tsx
- [X] T017 [P] [US1] Create test for src/shared/components/ImageDefault.tsx in src/shared/components/ImageDefault.spec.tsx
- [X] T018 [P] [US1] Create test for src/shared/components/Loader.tsx in src/shared/components/Loader.spec.tsx
- [X] T019 [P] [US1] Create test for src/shared/components/ToggleButton.tsx in src/shared/components/ToggleButton.spec.tsx

### Page Component Tests

- [X] T020 [P] [US1] Create test for src/pages/add/Add.tsx in src/pages/add/Add.spec.tsx
- [X] T021 [P] [US1] Create test for src/pages/detailGroup/DetailGroup.tsx in src/pages/detailGroup/DetailGroup.spec.tsx
- [X] T022 [P] [US1] Create test for src/pages/detailGroup/components/Header.tsx in src/pages/detailGroup/components/Header.spec.tsx
- [X] T023 [P] [US1] Create test for src/pages/expenses/Expense.tsx in src/pages/expenses/Expense.spec.tsx
- [X] T024 [P] [US1] Create test for src/pages/expenses/components/Header.tsx in src/pages/expenses/components/Header.spec.tsx
- [X] T025 [P] [US1] Create test for src/pages/groups/Groups.tsx in src/pages/groups/Groups.spec.tsx
- [X] T026 [P] [US1] Create test for src/pages/groups/components/GroupForm.tsx in src/pages/groups/components/GroupForm.spec.tsx
- [X] T027 [P] [US1] Create test for src/pages/groups/components/GroupList.tsx in src/pages/groups/components/GroupList.spec.tsx
- [X] T028 [P] [US1] Create test for src/pages/home/Home.tsx in src/pages/home/Home.spec.tsx
- [X] T029 [P] [US1] Create test for src/pages/home/components/ExpenseForm.tsx in src/pages/home/components/ExpenseForm.spec.tsx
- [X] T030 [P] [US1] Create test for src/pages/invitations/Invitations.tsx in src/pages/invitations/Invitations.spec.tsx
- [X] T031 [P] [US1] Create test for src/pages/invitations/components/InvitationForm.tsx in src/pages/invitations/components/InvitationForm.spec.tsx
- [X] T032 [P] [US1] Create test for src/pages/login/Login.tsx in src/pages/login/Login.spec.tsx
- [X] T033 [P] [US1] Create test for src/pages/login/components/LoginForm.tsx in src/pages/login/components/LoginForm.spec.tsx
- [X] T034 [P] [US1] Create test for src/pages/login/components/RegisterForm.tsx in src/pages/login/components/RegisterForm.spec.tsx
- [X] T035 [P] [US1] Create test for src/pages/profile/Profile.tsx in src/pages/profile/Profile.spec.tsx
- [X] T036 [US1] Run coverage report and verify 90% coverage for all components

**Completion Criteria**:
- ✅ All component tests pass
- ✅ Components achieve 90% coverage
- ✅ Tests cover rendering, props, event handlers, conditional rendering
- ✅ Tests include accessibility assertions (ARIA, keyboard navigation)

---

## Phase 4: User Story 2 - Utility & Hook Unit Test Coverage (P1)

**Goal**: Establish unit tests for all utility functions and custom hooks

**Independent Test**: Run `pnpm test src/shared/utils src/pages/**/hooks src/pages/**/utils` and verify 90% coverage

### Utility Tests

- [X] T037 [P] [US2] Create test for src/shared/utils/color.ts in src/shared/utils/color.spec.ts
- [X] T038 [P] [US2] Verify existing tests for src/utils/dataTransform.ts (already exists)
- [X] T039 [P] [US2] Verify existing tests for src/utils/formatCurrency.ts (already exists)
- [X] T040 [P] [US2] Verify existing tests for src/utils/formatDate.ts (already exists)
- [X] T041 [P] [US2] Verify existing tests for src/utils/validation.ts (already exists)
- [X] T042 [P] [US2] Create test for src/pages/login/utils/session.ts in src/pages/login/utils/session.spec.ts

### Hook Tests

- [X] T043 [P] [US2] Create test for src/pages/expenses/hooks/useExpense.ts in src/pages/expenses/hooks/useExpense.spec.tsx
- [X] T044 [P] [US2] Create test for src/pages/groups/hooks/useGroup.ts in src/pages/groups/hooks/useGroup.spec.tsx
- [X] T045 [P] [US2] Create test for src/pages/groups/hooks/useGroups.ts in src/pages/groups/hooks/useGroups.spec.tsx
- [X] T046 [P] [US2] Create test for src/pages/login/hooks/useUser.ts in src/pages/login/hooks/useUser.spec.tsx
- [X] T047 [US2] Run coverage report and verify 90% coverage for all utilities and hooks

**Completion Criteria**:
- ✅ All utility and hook tests pass
- ✅ Utilities and hooks achieve 90% coverage
- ✅ Tests cover normal cases, edge cases, error conditions
- ✅ Hook tests use renderHook() and verify state changes

---

## Phase 5: User Story 3 - API & Data Layer Unit Test Coverage (P1)

**Goal**: Establish unit tests for API calls, React Query hooks, and data validation

**Independent Test**: Run `pnpm test src/shared/services src/shared/interceptors` with MSW mocks and verify 90% coverage

### API & Service Tests

- [X] T048 [P] [US3] Create test for src/shared/services/request.ts in src/shared/services/request.spec.ts with MSW
- [X] T049 [P] [US3] Create test for src/shared/interceptors/Auth.tsx in src/shared/interceptors/Auth.spec.tsx
- [X] T050 [P] [US3] Create test for src/shared/layouts/Main.tsx in src/shared/layouts/Main.spec.tsx
- [X] T051 [US3] Add MSW handlers for all API endpoints used in tests
- [X] T052 [US3] Run coverage report and verify 90% coverage for API layer

**Completion Criteria**:
- ✅ All API and service tests pass
- ✅ API layer achieves 90% coverage
- ✅ Tests cover success responses, error responses, network failures
- ✅ Tests verify React Query cache behavior and retry logic

---

## Phase 6: User Story 4 - Form & Validation Unit Test Coverage (P2)

**Goal**: Establish unit tests for Formik forms and Zod validation schemas

**Independent Test**: Run `pnpm test src/pages/**/validator` and verify 90% coverage

**Note**: Type files (*.ts in types/ directories) do not require test files as they only contain TypeScript type definitions.

### Validator Tests

- [X] T053 [P] [US4] Create test for src/pages/groups/validator/group.ts in src/pages/groups/validator/group.spec.ts
- [X] T054 [P] [US4] Create test for src/pages/home/validator/expense.ts in src/pages/home/validator/expense.spec.ts
- [X] T055 [P] [US4] Create test for src/pages/invitations/validator/invitation.ts in src/pages/invitations/validator/invitation.spec.ts
- [X] T056 [P] [US4] Create test for src/pages/login/validator/login.ts in src/pages/login/validator/login.spec.ts
- [X] T057 [US4] Run coverage report and verify 90% coverage for validators

**Completion Criteria**:
- ✅ All form and validation tests pass
- ✅ Validators achieve 90% coverage
- ✅ Tests cover valid input, invalid input, edge cases
- ✅ Form tests verify submission handlers and error display

---

## Phase 7: User Story 5 - Test Coverage Metrics & CI Integration (P2)

**Goal**: Establish automated test coverage reporting and CI integration

**Independent Test**: Run `pnpm test:cov` and verify coverage reports are generated; verify CI runs tests on PR

### CI/CD Integration

- [ ] T058 [US5] Configure CI workflow to run `pnpm test:cov` on every PR
- [ ] T059 [US5] Configure CI to fail if coverage drops below 90%
- [ ] T060 [US5] Configure CI to comment coverage report on PRs
- [ ] T061 [US5] Add coverage badge to README.md
- [ ] T062 [US5] Document test commands in README.md (test, test:watch, test:cov)
- [ ] T063 [US5] Verify coverage reports are accessible in coverage/index.html
- [ ] T064 [US5] Run full test suite and verify all tests pass with 90% coverage

**Completion Criteria**:
- ✅ CI runs tests on every PR
- ✅ Coverage reports generated and accessible
- ✅ CI fails if coverage < 90%
- ✅ Coverage visible to reviewers

---

## Phase 8: Polish & Documentation

**Goal**: Finalize documentation and ensure test suite quality

### Documentation & Quality

- [ ] T065 [P] Review all test files for consistency and best practices
- [ ] T066 [P] Update quickstart.md with any lessons learned during implementation
- [ ] T067 Run final coverage report and verify 90% overall coverage achieved

**Completion Criteria**:
- ✅ All tests pass consistently (100% pass rate on repeated runs)
- ✅ Test suite completes in under 30 seconds
- ✅ Watch mode shows results within 5 seconds
- ✅ Documentation is complete and accurate

---

## Dependencies & Execution Order

### Story Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational)
                ↓
Phase 3 (US1: Components) ─┐
Phase 4 (US2: Utils/Hooks) ├─→ Phase 7 (US5: CI/Coverage)
Phase 5 (US3: API/Data)    ├─→ Phase 8 (Polish)
Phase 6 (US4: Forms)       ─┘
```

### Parallel Execution Opportunities

**Within User Story 1 (Components)**:
- All component tests (T012-T035) can be implemented in parallel
- Different developers can work on different page folders simultaneously

**Within User Story 2 (Utils/Hooks)**:
- All utility tests (T037-T042) can be implemented in parallel
- All hook tests (T043-T046) can be implemented in parallel

**Within User Story 3 (API/Data)**:
- Service tests (T048-T050) can be implemented in parallel after MSW setup

**Within User Story 4 (Forms)**:
- All validator tests (T053-T056) can be implemented in parallel
- All type tests (T057) can be implemented in parallel

**Within User Story 5 (CI/Coverage)**:
- Documentation tasks (T062-T064) can be done in parallel

---

## Implementation Strategy

### MVP Scope (Week 1)

Focus on **User Story 1** only:
- Phase 1: Setup (T001-T007)
- Phase 2: Foundational (T008-T011)
- Phase 3: Component Tests (T012-T036)

**Deliverable**: All components have tests with 90% coverage

### Incremental Delivery (Week 2)

- **User Story 2**: Utilities & Hooks (T037-T047)
- **User Story 3**: API & Data Layer (T048-T052)

**Deliverable**: Complete test coverage for business logic and data layer

### Final Delivery (Week 2-3)

- **User Story 4**: Forms & Validation (T053-T058)
- **User Story 5**: CI Integration (T059-T065)
- **Phase 8**: Polish & Documentation (T066-T068)

**Deliverable**: Complete test suite with CI integration and 90% coverage

---

## Task Checklist Summary

- **Phase 1 (Setup)**: 7 tasks
- **Phase 2 (Foundational)**: 4 tasks
- **Phase 3 (US1 - Components)**: 25 tasks
- **Phase 4 (US2 - Utils/Hooks)**: 11 tasks
- **Phase 5 (US3 - API/Data)**: 5 tasks
- **Phase 6 (US4 - Forms)**: 5 tasks
- **Phase 7 (US5 - CI/Coverage)**: 7 tasks
- **Phase 8 (Polish)**: 3 tasks

**Total**: 66 tasks

---

## Success Metrics

- ✅ 90% overall test coverage achieved
- ✅ All 66 tasks completed
- ✅ Test suite runs in < 30 seconds
- ✅ 100% pass rate on repeated test runs
- ✅ CI integration functional
- ✅ All user stories independently testable

---

## Notes

- **Parallelization**: 53 tasks marked with [P] can be executed in parallel
- **Type Files**: Type definition files (*.ts in types/ directories) do not require tests
- **Test Patterns**: Reference `/specs/001-unit-testing-suite/contracts/test-patterns.md` for examples
- **Quickstart Guide**: Reference `/specs/001-unit-testing-suite/quickstart.md` for setup instructions
- **Dependencies**: MSW (2.11.5), @testing-library/user-event (14.6.1), @vitest/coverage-v8 (3.2.4) already installed
