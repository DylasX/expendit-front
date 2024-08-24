import useGroups from '@/pages/groups/hooks/useGroups';
import { Group } from '@/pages/groups/types/group';
import { InvitationPayload } from '@/pages/invitations/types/invitation';
import { inviteValidator } from '@/pages/invitations/validator/invitation';
import { protectedApi } from '@/shared/services/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
// import { queryClient } from '@/shared/client/queryClient';
// import { protectedApi } from '@/shared/services/request';
// import { User } from '@/shared/types/user';
// import { useMutation } from '@tanstack/react-query';
// import EmojiPicker, { SkinTonePickerLocation } from 'emoji-picker-react';
// import { useFormik } from 'formik';
// import { DollarCircle, Message } from 'iconsax-react';
import React from 'react';
import toast from 'react-hot-toast';
// import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import { toFormikValidationSchema } from 'zod-formik-adapter';
// import { toFormikValidationSchema } from 'zod-formik-adapter';

interface InvitationFormProps {
  onClose: () => void;
}

const InvitationForm: React.FC<InvitationFormProps> = ({ onClose }) => {
  const [selectedGroup, setSelectedGroup] = React.useState({} as Group);
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();
  const { groups, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGroups();

  const inviteMutation = useMutation({
    mutationFn: (payload: InvitationPayload) => {
      return protectedApi.post(`/user/${selectedGroup.id}/invite`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      toast.success('Invitation created');
      onClose();
    },
    onError: (error) => {
      console.log(error);
      toast.error('Error creating invitation');
    },
  });

  const formik = useFormik<InvitationPayload>({
    initialValues: {
      inviteEmails: '',
    },
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      console.log(values);
      //validate the current user is included in the participants
      //convert to negative all the participants amount with id different from the current user
      inviteMutation.mutate(values);
    },
    validationSchema: toFormikValidationSchema(inviteValidator),
  });

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <section className='p-4 h-full'>
      <h2 className='text-lg font-semibold text-zinc-700 mb-4'>New expense </h2>
      <div className='flex flex-col bg-opacity-10 rounded-2xl w-full h-full animate-fade-up animate-duration-300'>
        {!selectedGroup.id ? (
          <>
            <h3 className='text-sm font-extralight text-gray-500 mb-1'>
              Select a group
            </h3>
            <ul className='flex flex-col flex-wrap mt-4'>
              {groups?.length === 0 && (
                <li className='text-center text-xs text-gray-500 mt-4'>
                  No groups yet.
                </li>
              )}
              {groups?.map((group: Group, index: number) => (
                <li
                  key={group.id + group.name + index}
                  className='bg-white rounded-xl mb-4'
                >
                  <a
                    className='flex flex-row justify-start items-center'
                    href='#'
                    onClick={() => setSelectedGroup(group)}
                  >
                    <span
                      className={`rounded-full p-2 text-white w-10 h-10 flex items-center justify-center text-2xl`}
                      style={{ backgroundColor: group.color }}
                    >
                      {group.emoji}
                    </span>
                    <span className='text-md font-light ml-4 text-zinc-500'>
                      {group.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {groups?.length ? (
              <span
                ref={ref}
                className='block text-xs font-extralight text-center  text-zinc-400 mb-2'
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
          <section>
            <div className='flex flex-col items-center mt-4'>
              <span
                className={`rounded-full p-2 text-white w-16 h-16 flex items-center justify-center text-5xl animate-fade-up animate-duration-300`}
                style={{ backgroundColor: selectedGroup.color }}
              >
                {selectedGroup.emoji}
              </span>
              <span className='capitalize font-light text-md'>
                {selectedGroup.name}
              </span>
              <hr className='my-4 border-t border-gray-100 w-full' />
            </div>
            <form onSubmit={formik.handleSubmit}>
              <label
                htmlFor='inviteEmails'
                className='block mb-2 text-sm font-light text-zinc-700'
              >
                Invite users (emails separated by commas)
              </label>
              <textarea
                id='inviteEmails'
                name='inviteEmails'
                className='border bg-white border-gray-300 text-zinc-700 text-sm rounded-md focus:ring-primary-100 focus:border-primary-100 block w-full p-2.5 mb-6'
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
                className='bg-primary-400 text-white py-2 px-4 rounded-md mt-4 ml-auto flex'
              >
                Invite users
              </button>
            </form>
          </section>
        )}
      </div>
    </section>
  );
};

export default InvitationForm;
