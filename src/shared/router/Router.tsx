import Add from '@/pages/add/Add';
import DetailGroup from '@/pages/detailGroup/DetailGroup';
import Groups from '@/pages/groups/Groups';
import Home from '@/pages/home/Home';
import Invitations from '@/pages/invitations/Invitations';
import { useUser } from '@/pages/login/hooks/useUser';
import Login from '@/pages/login/Login';
import Profile from '@/pages/profile/Profile';
import MainLayout from '@/shared/layouts/Main';
import React, { ReactNode } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Logo from '@/assets/logo.svg?react';

type ProtectedRouteProps = {
  children: ReactNode;
};
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const queryUser = useUser();
  const userLogged = queryUser.data?.id;

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
      <Route element={<MainLayout />}>
        <Route
          path='/add'
          element={
            <ProtectedRoute>
              <Add />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route element={<MainLayout />}>
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route element={<MainLayout />}>
        <Route
          path='/group/:id'
          element={
            <ProtectedRoute>
              <DetailGroup />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route element={<MainLayout />}>
        <Route
          path='*'
          element={
            <div className='h-screen text-white text-lg items-center justify-around flex flex-col'>
              <Logo className='w-60 -mt-24' color='#fff' />
              <span className='absolute bottom-[45%] font-bold'>404</span>
            </div>
          }
        ></Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
