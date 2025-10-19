# Expendit Front

![Tests](https://github.com/DylasX/expendit-front/workflows/Tests/badge.svg)
[![codecov](https://codecov.io/gh/DylasX/expendit-front/branch/main/graph/badge.svg)](https://codecov.io/gh/DylasX/expendit-front)

A modern expense tracking and sharing application built with React, TypeScript, and Vite.

## Features

- 📱 Track and share expenses with friends
- 👥 Create groups and manage shared costs
- 💰 Split expenses equally or manually
- 📊 View balance summaries and transaction history
- 🔐 Secure authentication and authorization
- 📲 Mobile-ready with Capacitor integration

## Tech Stack

- **Frontend**: React 19.2.0, TypeScript 5.9.3
- **Build Tool**: Vite 6.3.4
- **State Management**: TanStack Query (React Query) 5.90.5
- **Routing**: React Router 7.6.1
- **Forms**: Formik 2.4.6 + Zod 3.24.1
- **Styling**: TailwindCSS 4.1.0
- **Testing**: Vitest 3.2.4, React Testing Library 16.3.0, MSW 2.11.5
- **Mobile**: Capacitor 7.4.3

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL
```

### Development

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run tests in watch mode
pnpm test:watch

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Mobile Development

```bash
# Sync with Capacitor
pnpm sync

# Run on Android
pnpm run:android

# Run on iOS
pnpm run:ios
```

## Testing

This project maintains **90%+ test coverage** across all code categories.

### Test Structure

- **41 test files** with **385+ tests**
- **Component tests**: React component rendering, interactions, and state
- **Hook tests**: Custom React hooks with React Query integration
- **Utility tests**: Pure functions and helper utilities
- **API tests**: Service layer with MSW mocking
- **Validator tests**: Zod schema validation
- **Integration tests**: Router and authentication flows

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage report
pnpm test:cov

# Run tests in watch mode (useful during development)
pnpm test:watch

# Run specific test file
pnpm test src/pages/home/Home.spec.tsx

# Run tests matching a pattern
pnpm test --grep "Home"
```

### Coverage Reports

After running `pnpm test:cov`, open `coverage/index.html` in your browser to view the detailed coverage report.

### CI/CD

Tests run automatically on every pull request via GitHub Actions:
- ✅ All tests must pass
- ✅ Coverage must be ≥90% for lines, functions, branches, and statements
- 📊 Coverage reports are posted as PR comments
- 📈 Coverage trends tracked via Codecov

### Test Patterns

See `/specs/001-unit-testing-suite/quickstart.md` for detailed testing patterns and examples.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json', './tsconfig.app.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
