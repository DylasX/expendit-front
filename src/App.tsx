import AuthInterceptor from '@/shared/interceptors/Auth';
import MainLayout from '@/shared/layouts/Main';
import AppRouter from '@/shared/router/Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Router future={{ v7_startTransition: true }}>
          <AuthInterceptor>
            <MainLayout>
              <AppRouter />
            </MainLayout>
          </AuthInterceptor>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
