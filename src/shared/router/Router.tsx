import Groups from '@/pages/groups/Groups';
import { useUser } from '@/pages/login/hooks/useUser';
import Login from '@/pages/login/Login';
import BottomNavigator from '@/shared/components/BottomNavigator';
import React, { ReactNode } from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: ReactNode;
};
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { data: user } = useUser();
  const userLogged = user?.id;

  return userLogged ? (
    <>
      <BottomNavigator />
      {children}
    </>
  ) : (
    <Navigate to='/login' replace />
  );
};

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Link to='/'>Home</Link>
            <Link to='/login'>
              <div>Login</div>
            </Link>
            <div>
              <button type='button'>Test</button>
            </div>
          </ProtectedRoute>
        }
      />
      <Route path='/login' element={<Login />} />
      <Route
        path='/groups'
        element={
          <ProtectedRoute>
            <Groups />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
