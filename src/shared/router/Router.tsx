import Groups from '@/pages/groups/Groups';
import Home from '@/pages/home/Home';
import Invitations from '@/pages/invitations/Invitations';
import { useUser } from '@/pages/login/hooks/useUser';
import Login from '@/pages/login/Login';
import MainLayout from '@/shared/layouts/Main';
import React, { ReactNode } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: ReactNode;
};
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { data: user } = useUser();
  const userLogged = user?.id;

  return userLogged ? <>{children}</> : <Navigate to='/login' replace />;
};

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path='/login' element={<Login />} />

      <Route element={<MainLayout />}>
        <Route
          path='/groups'
          element={
            <ProtectedRoute>
              <Groups />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route element={<MainLayout />}>
        <Route
          path='/invitations'
          element={
            <ProtectedRoute>
              <Invitations />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRouter;
