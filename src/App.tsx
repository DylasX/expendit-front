import AuthInterceptor from "@/shared/interceptors/Auth";
import AppRouter from "@/shared/router/Router";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { BrowserRouter as Router } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { StatusBar } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";
import { persister, queryClient } from "./shared/client/queryClient";

function App() {
  React.useEffect(() => {
    if (Capacitor.getPlatform() !== "web") {
      StatusBar.setBackgroundColor({ color: "#27272a" });
    }
  }, []);
  return (
    <>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          maxAge: 1000 * 60 * 60 * 24,
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => {
              return query.state.status === "success";
            },
          },
        }}
      >
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
        <Router>
          <AuthInterceptor>
            <AppRouter />
          </AuthInterceptor>
        </Router>
      </PersistQueryClientProvider>
    </>
  );
}

export default App;
