import AuthInterceptor from '@/shared/interceptors/Auth';
import AppRouter from '@/shared/router/Router';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/shared/client/queryClient';

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition='bottom-left'
        />
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
