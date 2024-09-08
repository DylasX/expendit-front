import { GroupPayload } from '@/pages/groups/types/group';
import { groupValidator } from '@/pages/groups/validator/group';
import { protectedApi } from '@/shared/services/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { Profile2User } from 'iconsax-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { colors } from '@/shared/utils/color';

interface GroupFormProps {
  onClose: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ onClose }) => {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const queryClient = useQueryClient();

  const formik = useFormik<GroupPayload>({
    initialValues: {
      name: '',
      color: '',
      inviteEmails: '',
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      console.log(values);
      groupMutation.mutate(values);
    },
    validationSchema: toFormikValidationSchema(groupValidator),
  });

  const groupMutation = useMutation({
    mutationFn: (payload: GroupPayload) => {
      return protectedApi.post('/groups/', payload);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['groups'] });
      toast.success('Group created');
      onClose();
    },
    onError: (error) => {
      console.log(error);
      toast.error('Error creating group');
    },
  });

  React.useEffect(() => {
    // Add these css rules to the document
    const style = document.createElement('style');
    style.innerHTML = `
      .epr-body + div{
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  });

  return (
    <section className='p-4'>
      <h2 className='text-lg font-semibold text-gray-50 mb-6'>
        Create a new group{' '}
      </h2>
      <form className='max-w-sm mx-auto' onSubmit={formik.handleSubmit}>
        <label
          htmlFor='groupName'
          className='block mb-2 text-sm font-light text-gray-50'
        >
          Group name
        </label>
        <div className='relative mb-4'>
          <div className='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none'>
            <Profile2User size='22' className='text-gray-50' />
          </div>
          <input
            type='text'
            id='groupName'
            name='name'
            className='bg-customDark-100 text-gray-50 border-0 text-sm rounded-md focus:ring-primary-100 focus:border-primary-100 block w-full ps-10 p-2.5'
            placeholder='My Group'
            value={formik.values.name}
            onChange={formik.handleChange}
          />
        </div>
        <span className='text-xs text-red-500'>{formik.errors.name}</span>
        <label className='block mb-2 text-sm font-light text-gray-50'>
          Tag with a color
        </label>
        <div className='flex space-x-2 mb-4'>
          {colors.map((color) => (
            <div
              key={color}
              className={`w-8 h-8 rounded-md cursor-pointer ${
                selectedColor === color
                  ? 'ring-2 ring-offset-2 ring-primary-100'
                  : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => {
                setSelectedColor(color);
                formik.setFieldValue('color', color);
              }}
            ></div>
          ))}
        </div>
        <span className='text-xs text-red-500'>{formik.errors.color}</span>
        <label
          htmlFor='inviteEmails'
          className='block mb-2 text-sm font-light text-gray-50'
        >
          Invite users (emails separated by commas)
        </label>
        <textarea
          id='inviteEmails'
          name='inviteEmails'
          className='bg-customDark-100 text-sm border-0 rounded-md text-gray-50 focus:ring-primary-100 focus:border-primary-100 block w-full p-2.5 mb-6'
          placeholder='user1@example.com, user2@example.com'
          rows={4}
          value={formik.values.inviteEmails}
          onChange={formik.handleChange}
        ></textarea>
        <span className='text-xs text-red-500'>
          {formik.errors.inviteEmails}
        </span>
        <button
          type='submit'
          className='bg-primary-400 text-white py-2 px-4 rounded-md mt-4  w-full'
        >
          Create Group
        </button>
      </form>
    </section>
  );
};

export default GroupForm;
