import AuthInterceptor from '@/shared/interceptors/Auth';
import AppRouter from '@/shared/router/Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';

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
        <Router future={{ v7_startTransition: true }}>
          <AuthInterceptor>
            <AppRouter />
          </AuthInterceptor>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
