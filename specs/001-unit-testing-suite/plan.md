# Implementation Plan: Unit Testing Suite for Expendit Front

**Branch**: `001-unit-testing-suite` | **Date**: 2025-10-19 | **Spec**: `/specs/001-unit-testing-suite/spec.md`
**Input**: Feature specification from `/specs/001-unit-testing-suite/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Establish comprehensive unit test coverage across the entire Expendit Front application using Vitest and React Testing Library. All source files in `src/` will have colocated `.spec.ts` or `.spec.tsx` test files with minimum 90% coverage targets. This enables test-first development, prevents regressions, and enforces the constitution's Type Safety and Test-First Development principles.

## Technical Context

**Language/Version**: TypeScript 5.9.3, React 19.2.0  
**Primary Dependencies**: Vitest 3.2.4, React Testing Library 16.3.0, @testing-library/jest-dom 6.9.1, jsdom 27.0.1, Formik 2.4.6, Zod 4.1.12, React Query 5.90.5, Axios 1.12.2  
**Storage**: N/A (test-focused, uses mocks for localStorage/API)  
**Testing**: Vitest with jsdom environment, React Testing Library for component testing, MSW for HTTP mocking (to be installed)  
**Target Platform**: Web (Vite 7.1.10) + Mobile (Capacitor 7.4.3 for iOS/Android)
**Project Type**: Web application (React + TypeScript + Capacitor)
**Performance Goals**: Test suite completes in under 30 seconds, watch mode shows results within 5 seconds of file changes  
**Constraints**: Minimum 90% coverage for components/utilities, 70% overall; tests must not be flaky (100% pass rate on repeated runs)  
**Scale/Scope**: ~33 source files across 8 directories (pages, shared/components, shared/utils, shared/services, shared/client, shared/interceptors, shared/layouts, shared/router, shared/types), targeting 100% test file coverage

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **I. Component-Driven Architecture**: Tests will verify component composition, prop typing with TypeScript interfaces, and single responsibility. React Testing Library enforces user-centric testing that validates component behavior, not implementation details.

✅ **II. Type Safety (NON-NEGOTIABLE)**: All test files written in TypeScript with strict mode enabled. Tests validate Zod schema validation for API responses and form inputs. No `any` types in test code without justification.

✅ **III. Test-First Development**: This feature directly implements this constitutional principle. Tests will be written for all code paths, edge cases, and error scenarios. Minimum 70% coverage enforced, targeting 90%.

✅ **IV. Responsive & Accessible Design**: Tests will include accessibility assertions using @testing-library/jest-dom matchers (toBeInTheDocument, toHaveAccessibleName, etc.). Tests verify ARIA labels, keyboard navigation, and semantic HTML.

✅ **V. Data Integrity & Caching**: Tests will cover React Query cache invalidation strategies, Formik form validation with Zod schemas, and optimistic update rollback scenarios on API failures.

**Status**: ✅ All 5 constitutional principles satisfied. No violations.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

Expenditure Front uses a **colocated test file strategy** where each source file has a corresponding `.spec.ts` or `.spec.tsx` test file in the same directory.

```
src/
├── App.tsx                          # Main app component
├── App.spec.tsx                     # App tests (to be created)
├── main.tsx                         # Entry point
├── main.spec.tsx                    # Entry tests (to be created)
├── index.css                        # Global styles (no tests)
├── vite-env.d.ts                    # Vite types (no tests)
├── assets/                          # Static assets (no tests)
├── pages/                           # Page components with subcomponents
│   ├── add/
│   │   ├── Add.tsx
│   │   └── Add.spec.tsx            # (to be created)
│   ├── detailGroup/
│   │   ├── DetailGroup.tsx
│   │   ├── DetailGroup.spec.tsx    # (to be created)
│   │   └── components/
│   │       ├── Header.tsx
│   │       └── Header.spec.tsx     # (to be created)
│   ├── expenses/
│   │   ├── Expense.tsx
│   │   ├── Expense.spec.tsx        # (to be created)
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   └── Header.spec.tsx     # (to be created)
│   │   └── hooks/
│   │       ├── useExpense.ts
│   │       └── useExpense.spec.ts  # (to be created)
│   ├── groups/
│   │   ├── Groups.tsx
│   │   ├── Groups.spec.tsx         # (to be created)
│   │   ├── components/
│   │   │   ├── GroupForm.tsx
│   │   │   ├── GroupForm.spec.tsx  # (to be created)
│   │   │   ├── GroupList.tsx
│   │   │   └── GroupList.spec.tsx  # (to be created)
│   │   ├── hooks/
│   │   │   ├── useGroup.ts
│   │   │   ├── useGroup.spec.ts    # (to be created)
│   │   │   ├── useGroups.ts
│   │   │   └── useGroups.spec.ts   # (to be created)
│   │   └── validator/
│   │       ├── group.ts
│   │       └── group.spec.ts       # (to be created)
│   ├── home/
│   │   ├── Home.tsx
│   │   ├── Home.spec.tsx           # (to be created)
│   │   ├── components/
│   │   │   ├── ExpenseForm.tsx
│   │   │   └── ExpenseForm.spec.tsx # (to be created)
│   │   └── validator/
│   │       ├── expense.ts
│   │       └── expense.spec.ts     # (to be created)
│   ├── invitations/
│   │   ├── Invitations.tsx
│   │   ├── Invitations.spec.tsx    # (to be created)
│   │   ├── components/
│   │   │   ├── InvitationForm.tsx
│   │   │   └── InvitationForm.spec.tsx # (to be created)
│   │   └── validator/
│   │       ├── invitation.ts
│   │       └── invitation.spec.ts  # (to be created)
│   ├── login/
│   │   ├── Login.tsx
│   │   ├── Login.spec.tsx          # (to be created)
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── LoginForm.spec.tsx  # (to be created)
│   │   │   ├── RegisterForm.tsx
│   │   │   └── RegisterForm.spec.tsx # (to be created)
│   │   ├── hooks/
│   │   │   ├── useUser.ts
│   │   │   └── useUser.spec.ts     # (to be created)
│   │   ├── utils/
│   │   │   ├── session.ts
│   │   │   └── session.spec.ts     # (to be created)
│   │   └── validator/
│   │       ├── login.ts
│   │       └── login.spec.ts       # (to be created)
│   └── profile/
│       ├── Profile.tsx
│       └── Profile.spec.tsx        # (to be created)
├── shared/
│   ├── client/
│   │   ├── queryClient.ts
│   │   └── queryClient.spec.ts     # (to be created)
│   ├── components/
│   │   ├── BottomNavigator.tsx
│   │   ├── BottomNavigator.spec.tsx  # (to be created)
│   │   ├── Drawer.tsx
│   │   ├── Drawer.spec.tsx         # (to be created)
│   │   ├── Dropdown.tsx
│   │   ├── Dropdown.spec.tsx       # (to be created)
│   │   ├── Header.tsx
│   │   ├── Header.spec.tsx         # (to be created)
│   │   ├── Icon.tsx
│   │   ├── Icon.spec.tsx           # (to be created)
│   │   ├── ImageDefault.tsx
│   │   ├── ImageDefault.spec.tsx   # (to be created)
│   │   ├── Loader.tsx
│   │   ├── Loader.spec.tsx         # (to be created)
│   │   ├── ToggleButton.tsx
│   │   └── ToggleButton.spec.tsx   # (to be created)
│   ├── interceptors/
│   │   ├── Auth.tsx
│   │   └── Auth.spec.tsx           # (to be created)
│   ├── layouts/
│   │   ├── Main.tsx
│   │   └── Main.spec.tsx           # (to be created)
│   ├── router/
│   │   ├── Router.tsx
│   │   └── Router.spec.tsx         # (to be created)
│   ├── services/
│   │   ├── request.ts
│   │   └── request.spec.ts         # (to be created)
│   └── utils/
│       ├── color.ts
│       └── color.spec.ts           # (to be created)

vitest.config.ts                     # Test configuration (to be created)
vitest.setup.ts                      # ✅ EXISTS - Test setup file
```

**Structure Decision**: Colocated test files (`.spec.ts`/`.spec.tsx`) placed directly alongside source files. This approach:
- Improves discoverability (test is right next to source)
- Encourages test maintenance alongside code changes
- Simplifies imports (same directory)
- Matches industry standard for React projects
- Makes it easy to delete tests when removing features

Test configuration files (vitest.config.ts, vitest.setup.ts) live at project root.

## Complexity Tracking

*No violations to justify. All constitutional principles are satisfied.*

