import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/pages/login/hooks/useUser';
import { Google, Icon } from 'iconsax-react';
import LoginForm from '@/pages/login/components/LoginForm';
import RegisterForm from '@/pages/login/components/RegisterForm';
import * as authStorage from '@/pages/login/utils/session';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const userQuery = useUser();

  useEffect(() => {
    if (userQuery.data?.id && authStorage.getToken()) {
      navigate('/');
    } //TODO: after deleting this in the browser react-query cache is not cleared and user remains with data in localStorage
  }, [navigate, userQuery.data?.id]);

  return (
    <div className='p-10 flex flex-col h-screen'>
      <section className='justify-end flex flex-col items-center'>
        <Icon
          size='50'
          variant='Broken'
          className='text-center text-teal-400'
        />
        <h2 className='text-center text-2xl font-light text-teal-400 mb-4'>
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
            data-tabs-active-classes='text-teal-400 hover:text-teal-400 border-teal-400'
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
              className='w-full text-teal-500 place-items-center justify-center bg-white border-teal-500 border focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-xs px-5 py-2.5 text-center me-2 mb-2 flex'
            >
              <Google size='22' variant='Broken' className='text-teal-500' />{' '}
              <span className='ml-4'>Login with Google</span>
            </button>
            <p className='text-center text-xs font-light text-gray-400 mt-12 mb-6'>
              or use your credentials
            </p>
            <LoginForm />
          </div>
          <div
            className='hidden p-4 rounded-lg '
            id='styled-dashboard'
            role='tabpanel'
            aria-labelledby='dashboard-tab'
          >
            <button
              type='button'
              className='w-full mb-6 text-teal-500 place-items-center justify-center bg-white border-teal-500 border focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-xs px-5 py-2.5 text-center me-2 flex'
            >
              <Google size='22' variant='Broken' className='text-teal-500' />{' '}
              <span className='ml-4'>Login with Google</span>
            </button>
            <RegisterForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
