import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { unprotectedApi } from '@/shared/services/request';
import { useNavigate } from 'react-router-dom';
import { LoginPayload } from '@/pages/login/types/auth';
import * as authStorage from '@/pages/login/utils/session';
import { useUser } from '@/pages/login/hooks/useUser';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const userQuery = useUser();

  useEffect(() => {
    if (userQuery.data?.id) {
      navigate('/', { unstable_viewTransition: true });
    }
  }, [navigate, userQuery.data?.id]);

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
      authStorage.saveToken(data.token.token);
      userQuery.refetch();
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
