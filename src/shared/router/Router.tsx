import Login from '@/pages/login/Login';
import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <>
            <Link to='/'>Home</Link>
            <Link to='/login'>
              <div>Login</div>
            </Link>
          </>
        }
      />
      <Route path='/login' element={<Login />} />
    </Routes>
  );
};

export default AppRouter;
