import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      const queryIsReadyForPersistance = query.state.status === 'success';
      if (queryIsReadyForPersistance) {
        const { queryKey } = query;
        const excludeFromPersisting = queryKey.includes('invitations');
        return !excludeFromPersisting;
      }
      return queryIsReadyForPersistance;
    },
  },
});
