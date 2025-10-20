import { RegisterPayload } from '@/pages/login/types/auth';
import { errorMutationAxios, unprotectedApi } from '@/shared/services/request';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React from 'react';
import * as authStorage from '@/pages/login/utils/session';
import { useNavigate } from 'react-router-dom';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { registerValidator } from '@/pages/login/validator/login';
import { Key, UserTag } from 'iconsax-react';

interface RegisterFormProps {
  switchTabs: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
const RegisterForm: React.FC<RegisterFormProps> = ({
  switchTabs,
  setIsLoading,
}) => {
  const navigate = useNavigate();

  //TODO: Implement handle error
  const formik = useFormik<RegisterPayload>({
    initialValues: {
      email: '',
      password: '',
      fullName: '',
    },
    onSubmit: (values) => {
      registerMutation.mutate(values);
    },
    validateOnChange: false,
    validationSchema: toFormikValidationSchema(registerValidator),
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => {
      return unprotectedApi.post('/auth/register', payload);
    },
    onSuccess: ({ data }) => {
      authStorage.saveToken(data.token.token);
      navigate('/');
    },
    onError: (error) => {
      console.log(error);
      setIsLoading(false);
    },
  });

  React.useEffect(() => {
    if (registerMutation.isPending) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [registerMutation.isPending, setIsLoading]);

  return (
    <div className='flex flex-col animate-fade-up animate-duration-300'>
      <form onSubmit={formik.handleSubmit}>
        <div className='relative z-0 w-full group mt-4'>
          <label
            htmlFor='email'
            className={`block mb-2 text-sm font-medium text-white`}
          >
            Email
          </label>
          <div className={`relative `}>
            <div className='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none'>
              <UserTag color='currentColor' className='w-5 h-5 text-gray-400' />
            </div>
            <input
              type='text'
              id='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              className='bg-customDark-100 border-0 mb-4  text-gray-50 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5  placeholder:text-gray-50 placeholder:opacity-40'
              placeholder='user1@example.com'
              name='email'
              autoCapitalize='off'
            />
          </div>
          <span className='text-xs text-red-500'>{formik.errors.email}</span>
        </div>
        <div className='relative z-0 w-full group  mt-4'>
          <label
            htmlFor='fullname'
            className={`block mb-2 text-sm font-medium text-white`}
          >
            Fullname
          </label>
          <div className={`relative `}>
            <div className='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none'>
              <UserTag color='currentColor' className='w-5 h-5 text-gray-400' />
            </div>
            <input
              type='text'
              id='fullName'
              value={formik.values.fullName}
              onChange={formik.handleChange}
              className='bg-customDark-100 border-0 mb-4  text-gray-50 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5  placeholder:text-gray-50 placeholder:opacity-40'
              placeholder='user1@example.com'
              name='fullName'
            />
          </div>
          <span className='text-xs text-red-500'>{formik.errors.email}</span>
        </div>
        <div className='relative z-0 w-full mb-5 group'>
          <label
            htmlFor='password'
            className={`block mb-2 text-sm font-medium text-white`}
          >
            Password
          </label>
          <div className={`relative `}>
            <div className='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none'>
              <Key color='currentColor' className='w-5 h-5 text-gray-400' />
            </div>
            <input
              type='password'
              id='password'
              name='password'
              value={formik.values.password}
              onChange={formik.handleChange}
              className='bg-customDark-100 border-0 mb-4  text-gray-50 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5  placeholder:text-gray-50 placeholder:opacity-40'
              placeholder='password'
            />
          </div>
          <span className='text-xs text-red-500 -mt-4'>
            {formik.errors.password}
          </span>
        </div>
        <button
          type='submit'
          disabled={registerMutation.isPending}
          className='w-full text-white mt-10 bg-primary-400 focus:ring-4 focus:outline-none focus:ring-primary-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
        >
          Register
        </button>
        {registerMutation.isError && (
          <span className='text-red-500 text-sm mt-2 text-center block'>
            {
              (registerMutation.error as unknown as errorMutationAxios).response
                .data.errors[0].message
            }
          </span>
        )}
      </form>
      <a
        onClick={() => switchTabs()}
        className='w-full  text-primary-400 focus:ring-4 focus:outline-none focus:ring-primary-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
      >
        Already have an account? Login
      </a>
    </div>
  );
};

export default RegisterForm;
