import { describe, it, expect } from 'vitest';
import { queryClient, persister } from './queryClient';
import { QueryClient } from '@tanstack/react-query';

describe('queryClient', () => {
  it('should be an instance of QueryClient', () => {
    expect(queryClient).toBeInstanceOf(QueryClient);
  });

  it('should have correct default options', () => {
    const defaultOptions = queryClient.getDefaultOptions();
    
    expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
    expect(defaultOptions.queries?.retry).toBe(1);
    expect(defaultOptions.queries?.gcTime).toBe(1000 * 60 * 60 * 24); // 24 hours
  });

  it('should have queries configured with 24 hour cache time', () => {
    const defaultOptions = queryClient.getDefaultOptions();
    const expectedCacheTime = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
    
    expect(defaultOptions.queries?.gcTime).toBe(expectedCacheTime);
  });

  it('should not refetch on window focus', () => {
    const defaultOptions = queryClient.getDefaultOptions();
    
    expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
  });

  it('should retry failed queries once', () => {
    const defaultOptions = queryClient.getDefaultOptions();
    
    expect(defaultOptions.queries?.retry).toBe(1);
  });
});

describe('persister', () => {
  it('should be defined', () => {
    expect(persister).toBeDefined();
  });

  it('should have persistClient method', () => {
    expect(persister).toHaveProperty('persistClient');
  });

  it('should have restoreClient method', () => {
    expect(persister).toHaveProperty('restoreClient');
  });
});
