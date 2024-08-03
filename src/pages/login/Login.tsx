import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { unprotectedApi } from '@/shared/services/request';
import { useNavigate } from 'react-router-dom';
import { LoginPayload } from '@/pages/login/types/auth';
import * as authStorage from '@/pages/login/utils/session';
import { useUser } from '@/pages/login/hooks/useUser';
import { Google, Icon } from 'iconsax-react';

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
    <div className='p-10 flex flex-col h-screen'>
      <section className='justify-end flex flex-col items-center'>
        <Icon
          size='50'
          variant='Broken'
          className='text-center text-indigo-400'
        />
        <h2 className='text-center text-2xl font-light text-indigo-400 mb-4'>
          Expendit
        </h2>
        <p className='text-center text-sm font-light text-gray-500 mb-4'>
          Track and share expenses with friends.
        </p>
      </section>
      <section className=''>
        <div className='mb-4 border-b border-gray-200 mt-12'>
          <ul
            className='flex w-full -mb-px text-sm justify-around font-medium text-center'
            id='default-styled-tab'
            data-tabs-toggle='#default-styled-tab-content'
            data-tabs-active-classes='text-indigo-400 hover:text-indigo-400 border-indigo-400'
            data-tabs-inactive-classes='text-gray-500 hover:text-gray-600 border-gray-100 hover:border-gray-300'
            role='tablist'
          >
            <li className='me-2' role='presentation'>
              <button
                className='inline-block p-4 border-b-2 rounded-t-lg font-normal'
                id='profile-styled-tab'
                data-tabs-target='#styled-profile'
                type='button'
                role='tab'
                aria-controls='profile'
                aria-selected='false'
              >
                Login
              </button>
            </li>
            <li className='me-2' role='presentation'>
              <button
                className='inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 font-normal'
                id='dashboard-styled-tab'
                data-tabs-target='#styled-dashboard'
                type='button'
                role='tab'
                aria-controls='dashboard'
                aria-selected='false'
              >
                Register
              </button>
            </li>
          </ul>
        </div>
        <div id='default-styled-tab-content'>
          <div
            className='p-4 rounded-lg '
            id='styled-profile'
            role='tabpanel'
            aria-labelledby='profile-tab'
          >
            <button
              type='button'
              className='w-full text-indigo-500 place-items-center justify-center bg-white border-indigo-500 border focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-xs px-5 py-2.5 text-center me-2 mb-2 flex'
            >
              <Google size='22' variant='Broken' className='text-indigo-500' />{' '}
              <span className='ml-4'>Login with Google</span>
            </button>
            <p className='text-center text-xs font-light text-gray-400 mt-12 mb-6'>
              or use your credentials
            </p>
            <form onSubmit={formik.handleSubmit}>
              <div className='relative z-0 w-full mb-5 group pb-5'>
                <input
                  type='email'
                  name='email'
                  id='email'
                  className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-500 peer'
                  placeholder=' '
                  value={formik.values.email}
                  autoComplete='off'
                  onChange={formik.handleChange}
                  required
                />
                <label
                  htmlFor='email'
                  className='peer-focus:font-medium absolute text-xs text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-indigo-500  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                >
                  Email address
                </label>
              </div>
              <div className='relative z-0 w-full mb-5 group'>
                <input
                  type='password'
                  name='password'
                  id='password'
                  className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-500 peer'
                  placeholder=' '
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  required
                />
                <label
                  htmlFor='password'
                  className='peer-focus:font-medium absolute text-xs text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-indigo-500  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                >
                  Password
                </label>
              </div>
              <a className='text-xs text-indigo-500 mb-2' href='#'>
                Forgot password?
              </a>
              <button
                type='submit'
                className='w-full text-white mt-10 bg-indigo-500 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
              >
                Login
              </button>
            </form>
          </div>
          <div
            className='hidden p-4 rounded-lg '
            id='styled-dashboard'
            role='tabpanel'
            aria-labelledby='dashboard-tab'
          ></div>
        </div>
      </section>
    </div>
  );
};

export default Login;
