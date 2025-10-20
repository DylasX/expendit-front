# Expendit Front Constitution

## Core Principles

### I. Component-Driven Architecture
All UI functionality MUST be built as reusable, composable React components. Components MUST have a single, well-defined responsibility. Props MUST be typed with TypeScript interfaces. Component composition is preferred over prop drilling; use context or state management for shared state across distant components.

### II. Type Safety (NON-NEGOTIABLE)
All code MUST be written in TypeScript with strict mode enabled. No `any` types permitted without explicit justification in a code comment. All API responses MUST be validated against Zod schemas before use. Type safety ensures correctness at compile time and reduces runtime errors.

### III. Test-First Development
Unit tests MUST be written before or alongside implementation. Integration tests MUST cover critical user flows (authentication, data submission, navigation). Test coverage MUST remain above 70% for new features. Tests MUST be maintainable and reflect actual user behavior, not implementation details.

### IV. Responsive & Accessible Design
All UI MUST work on mobile (Capacitor), tablet, and desktop viewports. WCAG 2.1 AA accessibility standards MUST be met: semantic HTML, ARIA labels where needed, keyboard navigation support, sufficient color contrast. Tailwind CSS and component libraries MUST enforce consistent spacing and typography.

### V. Data Integrity & Caching
API state MUST be managed via React Query with proper cache invalidation strategies. Offline-first patterns MUST be supported where applicable (Capacitor async storage). Form state MUST be validated before submission using Formik + Zod. Optimistic updates MUST include rollback mechanisms on failure.

## Code Quality Standards

ESLint rules MUST pass with zero warnings. TypeScript compilation MUST succeed with no errors. All components MUST be documented with JSDoc comments explaining purpose, props, and usage. Breaking changes to component APIs MUST be avoided; if necessary, deprecation warnings MUST precede removal by at least one minor version.

## Development Workflow

All features MUST follow this workflow:
1. Create feature branch from `main`
2. Write tests and component structure
3. Implement functionality
4. Verify tests pass and linting succeeds
5. Request code review
6. Merge to `main` after approval

Code reviews MUST verify: TypeScript compliance, test coverage, accessibility, responsive design, and adherence to component patterns. Reviewers MUST check for prop drilling, unnecessary re-renders, and proper error handling.

## Governance

This constitution supersedes all other development practices. Amendments MUST be documented with rationale and impact analysis. All PRs MUST verify compliance with these principles before merge. Violations MUST be addressed in code review; repeated violations MUST trigger team discussion and potential process refinement.

**Version**: 1.0.0 | **Ratified**: 2025-10-19 | **Last Amended**: 2025-10-19
