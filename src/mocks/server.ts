import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW Server Setup
 * 
 * This sets up a mock server for intercepting HTTP requests in tests.
 * The server is configured in vitest.setup.ts to run before all tests.
 */

export const server = setupServer(...handlers);
