import { Invitation, StatusEnum } from '@/pages/invitations/types/invitation';
import { useUser } from '@/pages/login/hooks/useUser';
import Header from '@/shared/components/Header';
import { protectedApi } from '@/shared/services/request';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { CloseCircle, TickCircle } from 'iconsax-react';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import toast from 'react-hot-toast';
import Drawer from '@/shared/components/Drawer';
import InvitationForm from '@/pages/invitations/components/InvitationForm';
import Loader from '@/shared/components/Loader';

const Invitations: React.FC = () => {
  const { ref, inView } = useInView();
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const onClose = () => {
    setOpen(false);
  };
  const getInvitations = async ({ pageParam }: { pageParam: number }) => {
    const { data } = await protectedApi.get(
      `user/invitations?page=${pageParam}`
    );
    return data;
  };

  const handleInvitation = async (
    invitationId: number,
    response: StatusEnum
  ) => {
    if (response === StatusEnum.ACCEPTED) {
      const response = await protectedApi.post(
        `user/invitation/${invitationId}`
      );
      return response;
    } else {
      const response = await protectedApi.delete(
        `user/invitation/${invitationId}`
      );
      return response;
    }
  };

  //create mutation to handle accept or decline invitations
  const handleInvitationMutation = useMutation({
    mutationFn: (payload: { invitationId: number; action: StatusEnum }) => {
      return handleInvitation(payload.invitationId, payload.action);
    },
    onSuccess: (_, { action }) => {
      if (action === StatusEnum.ACCEPTED) {
        toast.success('Invitation accepted');
      } else {
        toast.error('Invitation rejected');
      }
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });

  const {
    data: data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['invitations'],
    queryFn: getInvitations,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextPageUrl
        ? lastPage.meta.currentPage + 1
        : undefined;
    },
    refetchOnWindowFocus: true,
  });

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const invitations = data?.pages
    .map(({ data }) => data)
    .flat() as Invitation[];

  const formatInvitationText = (invitation: Invitation) => {
    const inviterName =
      invitation.inviter.fullName === user?.fullName
        ? 'You'
        : invitation.inviter.fullName;
    const inviteeName =
      invitation.invitee.fullName === user?.fullName
        ? 'You'
        : invitation.invitee.fullName;
    //return span with text
    return (
      <span className='font-light text-sm text-gray-50'>
        <span className='text-primary-400'>{inviterName}</span> invited{' '}
        <span className='text-primary-400'>{inviteeName}</span>
      </span>
    );
  };

  const renderActions = (invitation: Invitation) => {
    if (
      invitation.status === StatusEnum.PENDING &&
      invitation.inviteeUserId === user?.id
    ) {
      return (
        <div className='flex items-center justify-end space-x-2'>
          <button
            onClick={() =>
              handleInvitationMutation.mutate({
                action: StatusEnum.ACCEPTED,
                invitationId: invitation.id,
              })
            }
          >
            <TickCircle size='32' className='text-primary-400' />
          </button>
          <button
            onClick={() =>
              handleInvitationMutation.mutate({
                action: StatusEnum.REJECTED,
                invitationId: invitation.id,
              })
            }
          >
            <CloseCircle size='32' className='text-red-400' />
          </button>
        </div>
      );
    }

    return (
      <div className='flex items-center justify-end space-x-2'>
        <span className='text-xs text-gray-500 capitalize'>
          {invitation.status}
        </span>
      </div>
    );
  };

  return (
    <main className={`overflow-y-auto scrollbar-hide h-screen `}>
      <Header
        owesYou={
          user?.myCredit?.reduce(
            (acc, acum) => acc + parseFloat(acum.amount),
            0
          ) || 0
        }
        youOwe={
          user?.myDebt?.reduce(
            (acc, acum) => acc + parseFloat(acum.amount),
            0
          ) || 0
        }
      />{' '}
      {isLoading ? (
        <Loader />
      ) : (
        <section className='bg-zinc-500 bg-opacity-10 rounded-2xl w-full min-h-[70%] animate-fade-up animate-duration-300'>
          <div className='p-5 text-lg font-semibold text-left w-full mb-5 text-gray-50'>
            <div className='flex flex-row justify-between'>
              <h2>Invitations</h2>
              <button
                onClick={() => setOpen(true)}
                className='text-sm text-primary-400 flex flex-row items-center'
              >
                New invitation
              </button>
            </div>
            <p className='mt-1 text-sm font-light text-gray-50'>
              Most recent invitations.
            </p>
          </div>
          <ul className='p-4 mb-5'>
            {invitations.length === 0 && (
              <div className='flex items-center justify-center space-x-4 rtl:space-x-reverse'>
                <li className='text-xs text-gray-50 mt-4'>
                  No invitations yet.
                </li>
              </div>
            )}
            {invitations.map((invitation, index) => (
              <li
                key={index}
                className='pb-3 sm:pb-4 p-4 mb-3 bg-zinc-800 rounded-xl'
              >
                <div className='flex items-center space-x-4 rtl:space-x-reverse'>
                  <div className='flex-shrink-0'>
                    <p className='text-sm font-normal truncate'>
                      {formatInvitationText(invitation)}
                    </p>
                    <p className='text-xs truncate  font-light text-gray-50'>
                      Group:{' '}
                      <span className='text-primary-400'>
                        {invitation.group.name}
                      </span>
                    </p>
                  </div>
                  <div className='flex-1 min-w-0'>
                    {renderActions(invitation)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {invitations.length ? (
            <span
              ref={ref}
              className='block text-xs text-center  text-gray-50 mb-2'
            >
              {isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                ? 'Load More'
                : 'No more invitations to load'}
            </span>
          ) : (
            ''
          )}
        </section>
      )}
      <Drawer isFullScreen={true} open={open} onClose={onClose}>
        <InvitationForm onClose={onClose} />
      </Drawer>
    </main>
  );
};

export default Invitations;
