import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/pages/login/hooks/useUser';
import LoginForm from '@/pages/login/components/LoginForm';
import RegisterForm from '@/pages/login/components/RegisterForm';
import Logo from '@/assets/logo.svg?react';
import * as authStorage from '@/pages/login/utils/session';
import Loader from '@/shared/components/Loader';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const userQuery = useUser();
  const [isRegister, setIsRegister] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const switchTabs = () => {
    setIsRegister(!isRegister);
  };

  useEffect(() => {
    if (userQuery.data?.id && authStorage.getToken()) {
      navigate('/');
    }
  }, [navigate, userQuery.data?.id]);

  if (isLoading) {
    return (
      <div className='p-10 flex flex-col h-screen bg-zinc-800'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='p-10 flex flex-col h-screen bg-zinc-800'>
      <section className='justify-end flex flex-col items-center mb-6'>
        <Logo className='w-60' color='#fff' viewBox='0 0 400 10' />
        <p className='text-center text-sm font-light text-gray-50 mt-2'>
          Track and share expenses with friends.
        </p>
      </section>
      {isRegister ? (
        <RegisterForm switchTabs={switchTabs} setIsLoading={setIsLoading} />
      ) : (
        <LoginForm switchTabs={switchTabs} setIsLoading={setIsLoading} />
      )}
    </div>
  );
};

export default Login;
