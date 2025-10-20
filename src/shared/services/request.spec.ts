import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { protectedApi, unprotectedApi } from './request';
import * as authStorage from '@/pages/login/utils/session';
import { queryClient } from '@/shared/client/queryClient';

vi.mock('@/pages/login/utils/session', () => ({
  getToken: vi.fn(),
  removeToken: vi.fn(),
  saveToken: vi.fn(),
}));

vi.mock('@/shared/client/queryClient', () => ({
  queryClient: {
    clear: vi.fn(),
  },
}));

const mockGetToken = authStorage.getToken as ReturnType<typeof vi.fn>;
const mockRemoveToken = authStorage.removeToken as ReturnType<typeof vi.fn>;

describe('request service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('protectedApi', () => {
    it('should create axios instance with base URL', () => {
      expect(protectedApi.defaults.baseURL).toBeDefined();
    });

    it('should add Authorization header when token exists', async () => {
      mockGetToken.mockReturnValue('test-token');

      const config = await protectedApi.interceptors.request.handlers[0].fulfilled({
        headers: {},
      } as any);

      expect(config.headers.Authorization).toBe('Bearer test-token');
    });

    it('should not add Authorization header when token does not exist', async () => {
      mockGetToken.mockReturnValue(undefined);

      const config = await protectedApi.interceptors.request.handlers[0].fulfilled({
        headers: {},
      } as any);

      expect(config.headers.Authorization).toBeUndefined();
    });

    it('should handle 401 error by removing token and redirecting', async () => {
      const error = {
        response: {
          status: 401,
        },
      };

      try {
        await protectedApi.interceptors.response.handlers[0].rejected(error);
      } catch (e) {
        expect(mockRemoveToken).toHaveBeenCalled();
        expect(queryClient.clear).toHaveBeenCalled();
        expect(window.location.href).toBe('/login');
      }
    });

    it('should handle 403 error by removing token and redirecting', async () => {
      const error = {
        response: {
          status: 403,
        },
      };

      try {
        await protectedApi.interceptors.response.handlers[0].rejected(error);
      } catch (e) {
        expect(mockRemoveToken).toHaveBeenCalled();
        expect(queryClient.clear).toHaveBeenCalled();
        expect(window.location.href).toBe('/login');
      }
    });

    it('should not handle other error codes', async () => {
      const error = {
        response: {
          status: 500,
        },
      };

      try {
        await protectedApi.interceptors.response.handlers[0].rejected(error);
      } catch (e) {
        expect(mockRemoveToken).not.toHaveBeenCalled();
        expect(queryClient.clear).not.toHaveBeenCalled();
      }
    });

    it('should pass through successful responses', async () => {
      const response = { data: { test: 'data' }, status: 200 };

      const result = await protectedApi.interceptors.response.handlers[0].fulfilled(
        response as any
      );

      expect(result).toEqual(response);
    });
  });

  describe('unprotectedApi', () => {
    it('should create axios instance with base URL', () => {
      expect(unprotectedApi.defaults.baseURL).toBeDefined();
    });

    it('should not have request interceptors', () => {
      expect(unprotectedApi.interceptors.request.handlers).toHaveLength(0);
    });

    it('should not have response interceptors', () => {
      expect(unprotectedApi.interceptors.response.handlers).toHaveLength(0);
    });
  });

  describe('errorMutationAxios interface', () => {
    it('should match expected error structure', () => {
      const error: any = {
        response: {
          data: {
            errors: [
              {
                message: 'Test error message',
              },
            ],
          },
        },
      };

      expect(error.response.data.errors[0].message).toBe('Test error message');
    });
  });
});
