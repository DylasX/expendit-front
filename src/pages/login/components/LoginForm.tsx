import { LoginPayload } from '@/pages/login/types/auth';
import { unprotectedApi } from '@/shared/services/request';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React from 'react';
import * as authStorage from '@/pages/login/utils/session';
import { useUser } from '@/pages/login/hooks/useUser';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const userQuery = useUser();
  const navigate = useNavigate();

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
    <form onSubmit={formik.handleSubmit}>
      <div className='relative z-0 w-full mb-5 group pb-5'>
        <input
          type='email'
          name='email'
          id='email'
          className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-teal-500 peer'
          placeholder=' '
          value={formik.values.email}
          autoComplete='off'
          onChange={formik.handleChange}
          required
        />
        <label
          htmlFor='email'
          className='peer-focus:font-medium absolute text-xs text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-teal-500  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
        >
          Email address
        </label>
      </div>
      <div className='relative z-0 w-full mb-5 group'>
        <input
          type='password'
          name='password'
          id='password'
          className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-teal-500 peer'
          placeholder=' '
          value={formik.values.password}
          onChange={formik.handleChange}
          required
        />
        <label
          htmlFor='password'
          className='peer-focus:font-medium absolute text-xs text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-teal-500  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
        >
          Password
        </label>
      </div>
      <a className='text-xs text-teal-500 mb-2' href='#'>
        Forgot password?
      </a>
      <button
        type='submit'
        className='w-full text-white mt-10 bg-teal-500 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
