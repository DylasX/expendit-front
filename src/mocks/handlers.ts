import { http, HttpResponse } from 'msw';

/**
 * MSW Request Handlers
 * 
 * Define mock API responses for testing.
 * Add handlers for your API endpoints here.
 * 
 * Example:
 * http.get('/api/users', () => {
 *   return HttpResponse.json([{ id: 1, name: 'John Doe' }]);
 * }),
 */

export const handlers = [
  // Example: Mock GET /api/users
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ]);
  }),

  // Example: Mock POST /api/login
  http.post('/api/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    // Simulate successful login
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: {
        id: 1,
        email: body.email,
        name: 'Test User',
      },
    });
  }),

  // Example: Mock error response
  http.get('/api/error', () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }),

  // Add more handlers as needed for your tests
];
