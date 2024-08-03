import React, { ReactNode, useEffect } from 'react';
import * as authStorage from '@/pages/login/utils/session';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/pages/login/hooks/useUser';
import { useQueryClient } from '@tanstack/react-query';

type AuthInterceptorProps = {
  children: ReactNode;
};

const AuthInterceptor: React.FC<AuthInterceptorProps> = ({ children }) => {
  const navigate = useNavigate();
  const userQuery = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userQuery.data?.id && authStorage.getToken()) {
      userQuery.refetch();
    }
  }, [userQuery]);
  //Check if queryClient has user and token if not check local storage and set it\

  //Check if user and token are present
  useEffect(() => {
    const cleanerQuery = () => {
      if (!authStorage.getToken()) {
        queryClient.clear();
        navigate('/login', { replace: true, unstable_viewTransition: true });
      }
    };

    window.addEventListener('storage', cleanerQuery);

    return () => {
      window.removeEventListener('storage', cleanerQuery);
    };
  }, [userQuery, navigate, queryClient]);

  return children;
};

export default AuthInterceptor;
