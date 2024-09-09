import AuthInterceptor from '@/shared/interceptors/Auth';
import AppRouter from '@/shared/router/Router';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/shared/client/queryClient';
import React from 'react';
import { StatusBar } from '@capacitor/status-bar';

function App() {
  React.useEffect(() => {
    StatusBar.setBackgroundColor({ color: '#27272a' });
  }, []);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition='bottom-left'
        />
        <Router>
          <AuthInterceptor>
            <AppRouter />
          </AuthInterceptor>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
