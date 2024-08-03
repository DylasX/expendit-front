import { useQueryClient } from '@tanstack/react-query';
import React, { ReactNode, useEffect } from 'react';
import * as authStorage from '@/pages/login/utils/session';
import { useNavigate } from 'react-router-dom';

type AuthInterceptorProps = {
  children: ReactNode;
};

const AuthInterceptor: React.FC<AuthInterceptorProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  //Check if queryClient has user and token if not check local storage and set it\

  //Check if user and token are present
  useEffect(() => {
    const checkAuth = () => {
      if (
        !queryClient.getQueryData(['user']) ||
        !queryClient.getQueryData(['token'])
      ) {
        const user = authStorage.getUser();
        const token = authStorage.getToken();
        if (user && token) {
          queryClient.setQueryData(['user'], user);
          queryClient.setQueryData(['token'], token);
        } else {
          //If no user or token in local storage, redirect to login
          navigate('/login', { replace: true, unstable_viewTransition: true });
        }
      }
    };
    const cleanerQuery = () => {
      if (!authStorage.getUser() || !authStorage.getToken()) {
        queryClient.setQueryData(['user'], null);
        queryClient.setQueryData(['token'], null);
        navigate('/login', { replace: true, unstable_viewTransition: true });
      }
    };
    window.addEventListener('storage', cleanerQuery);
    checkAuth();

    return () => {
      window.removeEventListener('storage', cleanerQuery);
    };
  }, [queryClient, navigate]);

  return children;
};

export default AuthInterceptor;
