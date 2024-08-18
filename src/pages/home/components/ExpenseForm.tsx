// import { GroupPayload } from '@/pages/groups/types/group';
// import { groupValidator } from '@/pages/groups/validator/group';
// import { protectedApi } from '@/shared/services/request';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { useFormik } from 'formik';
// import { Profile2User } from 'iconsax-react';
import useGroup from '@/pages/groups/hooks/group';
import { Group } from '@/pages/groups/types/group';
import React from 'react';
import { useInView } from 'react-intersection-observer';
// import toast from 'react-hot-toast';
// import { toFormikValidationSchema } from 'zod-formik-adapter';

interface ExpenseFormProps {
  onClose: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = () => {
  const [seletectedGroup] = React.useState('');
  const { ref, inView } = useInView();
  const { groups, isFetchingNextPage, hasNextPage, fetchNextPage } = useGroup();

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);
  //   const queryClient = useQueryClient();

  //   const formik = useFormik<GroupPayload>({
  //     initialValues: {
  //       name: '',
  //       color: '',
  //       inviteEmails: '',
  //     },
  //     validateOnChange: false,
  //     validateOnBlur: true,
  //     onSubmit: (values) => {
  //       console.log(values);
  //       groupMutation.mutate(values);
  //     },
  //     validationSchema: toFormikValidationSchema(groupValidator),
  //   });

  //   const groupMutation = useMutation({
  //     mutationFn: (payload: GroupPayload) => {
  //       return protectedApi.post('/groups/', payload);
  //     },
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['groups'] });
  //       toast.success('Group created');
  //       onClose();
  //     },
  //     onError: (error) => {
  //       console.log(error);
  //       toast.error('Error creating group');
  //     },
  //   });

  return (
    <section className='p-4'>
      <h2 className='text-lg font-semibold text-zinc-700 mb-4'>New expense </h2>
      <div className='flex flex-col bg-opacity-10 rounded-2xl w-full animate-fade-up'>
        {!seletectedGroup ? (
          <>
            <h3 className='text-sm font-extralight text-zinc-700 mb-1'>
              Select a group{' '}
            </h3>
            <input
              type='text'
              id='groupName'
              name='name'
              className='border bg-white mb-4 border-gray-300 text-zinc-700 text-sm rounded-md focus:ring-amber-500 focus:border-amber-500 block w-full'
              placeholder='Search group'
            />{' '}
            <ul className='flex flex-row flex-wrap mt-4'>
              {groups.length === 0 && (
                <li className='text-center text-xs text-gray-500 mt-4'>
                  No groups yet.
                </li>
              )}
              {groups?.map((group: Group, index: number) => (
                <li
                  key={group.id + group.name + index}
                  className='bg-white rounded-xl w-1/4 mb-4'
                >
                  <div className='flex flex-col justify-center items-center'>
                    <img
                      className='w-16 h-16 rounded-md'
                      src='https://flowbite.com/docs/images/people/profile-picture-1.jpg'
                      alt='Neil image'
                    />
                    <span className='text-xs font-light text-zinc-500'>
                      {group.name}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            {groups.length ? (
              <span
                ref={ref}
                className='block text-xs text-center  text-gray-500 mb-2'
              >
                {isFetchingNextPage
                  ? 'Loading more...'
                  : hasNextPage
                  ? 'Scroll to load more'
                  : 'No more groups'}
              </span>
            ) : (
              ''
            )}
          </>
        ) : (
          ''
        )}
      </div>

      {/* <form className='max-w-sm mx-auto' onSubmit={formik.handleSubmit}>
        <label
          htmlFor='groupName'
          className='block mb-2 text-sm font-light text-zinc-700'
        >
          Group
        </label>
        <div className='relative mb-4'></div>
        <label
          htmlFor='groupName'
          className='block mb-2 text-sm font-light text-zinc-700'
        >
          Description
        </label>
        <div className='relative mb-4'>
          <div className='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none'>
            <Profile2User size='22' className='text-gray-400' />
          </div>
          <input
            type='text'
            id='groupName'
            name='name'
            className='border bg-white border-gray-300 text-zinc-700 text-sm rounded-md focus:ring-amber-500 focus:border-amber-500 block w-full ps-10 p-2.5'
            placeholder='My Group'
            value={formik.values.name}
            onChange={formik.handleChange}
          />
        </div>
        <span className='text-xs text-red-500'>{formik.errors.name}</span>
        <label
          htmlFor='groupName'
          className='block mb-2 text-sm font-light text-zinc-700'
        >
          Amount
        </label>
        <div className='relative mb-4'>
          <div className='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none'>
            <Profile2User size='22' className='text-gray-400' />
          </div>
          <input
            type='text'
            id='groupName'
            name='name'
            className='border bg-white border-gray-300 text-zinc-700 text-sm rounded-md focus:ring-amber-500 focus:border-amber-500 block w-full ps-10 p-2.5'
            placeholder='My Group'
            value={formik.values.name}
            onChange={formik.handleChange}
          />
        </div>
        <span className='text-xs text-red-500'>{formik.errors.color}</span>
        <button
          type='submit'
          className='bg-amber-400 text-white py-2 px-4 rounded-md mt-16 ml-auto flex'
        >
          Create Group
        </button>
      </form> */}
    </section>
  );
};

export default ExpenseForm;
