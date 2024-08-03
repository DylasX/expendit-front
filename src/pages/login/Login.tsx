import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unprotectedApi } from '@/shared/services/request';
import { useNavigate } from 'react-router-dom';
import { LoginPayload } from '@/pages/login/types/auth';
import * as authStorage from '@/pages/login/utils/session';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      queryClient.getQueryData(['user']) &&
      queryClient.getQueryData(['token'])
    ) {
      navigate('/', { unstable_viewTransition: true });
    }
  }, [navigate, queryClient]);

  const formik = useFormik<LoginPayload>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      loginMutation.mutate(values);
    },
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => {
      return unprotectedApi.post('/auth/login', payload);
    },
    onSuccess: ({ data }) => {
      queryClient.setQueryData(['token'], data.token.token);
      queryClient.setQueryData(['user'], data.user);
      authStorage.saveToken(data.token.token);
      authStorage.saveUser(data.user);
      navigate('/', { unstable_viewTransition: true });
    },
  });

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            id='email'
            name='email'
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            name='password'
            value={formik.values.password}
            onChange={formik.handleChange}
          />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default Login;
