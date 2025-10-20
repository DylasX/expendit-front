import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // Environment
    environment: 'jsdom',
    globals: true,

    // Setup
    setupFiles: ['./vitest.setup.ts'],

    // Server dependencies optimization
    server: {
      deps: {
        inline: ['parse5'],
      },
    },

    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/types/**',
        'src/vite-env.d.ts',
        'src/assets/**',
        'coverage/',
        'android/',
        'ios/',
        '.**',
        'capacitor.config.ts',
        'vite.config.ts',
        'vitest.config.ts',
        'public/**',
        'src/mocks/**',
        'src/test-utils/**'
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
      all: true,
    },

    // Performance
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,

    // Patterns
    include: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'android', 'ios'],

    // Reporters
    reporters: ['default'],
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
