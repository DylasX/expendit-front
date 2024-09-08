import useGroup from '@/pages/groups/hooks/useGroup';
import useGroups from '@/pages/groups/hooks/useGroups';
import { Group } from '@/pages/groups/types/group';
import { ExpensePayload } from '@/pages/home/types/expense';
import { expenseValidator } from '@/pages/home/validator/expense';
import { useUser } from '@/pages/login/hooks/useUser';
import { queryClient } from '@/shared/client/queryClient';
import ImageDefault from '@/shared/components/ImageDefault';
import ToggleButton from '@/shared/components/ToggleButton';
import { protectedApi } from '@/shared/services/request';
import { User } from '@/shared/types/user';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { ArrowLeft, DollarCircle, Message } from 'iconsax-react';
import React from 'react';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import { toFormikValidationSchema } from 'zod-formik-adapter';

interface ExpenseFormProps {
  onClose: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose }) => {
  const [selectedGroup, setSelectedGroup] = React.useState({} as Group);
  const { data: user } = useUser();
  const { ref, inView } = useInView();
  const { groups, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGroups();
  const { data: group } = useGroup(selectedGroup?.id);

  const swithStrategy = () => {
    formik.setFieldValue('participants', []);
    formik.setFieldValue(
      'divisionStrategy',
      formik.values.divisionStrategy === 'EQUALS' ? 'MANUAL' : 'EQUALS'
    );
  };

  const expenseMutation = useMutation({
    mutationFn: (payload: ExpensePayload) => {
      //TODO: add feature to allow create expenses with different users
      return protectedApi.post('/expenses/', { ...payload, userId: user?.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Expense created');
      onClose();
    },
    onError: (error) => {
      formik.setFieldValue('participants', [
        ...formik.values.participants.map((m) => {
          return { ...m, amount: Math.abs(m.amount) };
        }),
      ]);
      console.log(error);
      toast.error('Error creating expense');
    },
  });

  const formik = useFormik<ExpensePayload>({
    initialValues: {
      description: '',
      amount: 0,
      divisionStrategy: 'EQUALS',
      participants: [],
      groupId: 0,
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      //validate the current user is included in the participants
      //convert to negative all the participants amount with id different from the current user
      values.groupId = selectedGroup.id;
      const currentUser = values.participants.find((m) => m.id === user?.id);
      currentUser!.amount = values.participants
        .filter((m) => m.id !== user?.id)
        .reduce((acc, acum) => Math.abs(acc) + Math.abs(acum.amount), 0);
      values.participants = values.participants.map((m) => {
        if (m.id !== user?.id) {
          m.amount = -m.amount;
        }
        m.amount = Number(m.amount.toFixed(2));
        return m;
      });
      expenseMutation.mutate(values);
    },
    validationSchema: toFormikValidationSchema(expenseValidator),
  });

  const renderSplitMoney = () => {
    return (
      <div className='animate-fade-up animate-duration-300 mb-10 mt-8'>
        <div className='flex justify-end mb-4 mt-4'>
          <ToggleButton
            checked={formik.values.divisionStrategy === 'EQUALS'}
            onChange={swithStrategy}
            leftLabel='Equals'
            rightLabel='Manual'
          />
        </div>
        <ul>
          {group?.users.map((member: User) => (
            <li
              key={member.id}
              className='flex items-center mb-2 mt-4 justify-between'
            >
              <label
                htmlFor={String(member.id)}
                className='ml-0 text-gray-50  text-md font-light w-[8%]'
              >
                {member.fullName}
              </label>
              <div className='relative w-[60%]'>
                <div className='absolute inset-y-0 start-0 flex items-center ps-6 pointer-events-none'>
                  <DollarCircle className='w-5 h-5 text-gray-400' />
                </div>
                <input
                  type='number'
                  id={String(member.id) + 'amount'}
                  onChange={(e) => {
                    if (e.target.value === '' || Number(e.target.value) === 0) {
                      formik.setFieldValue(
                        'participants',
                        formik.values.participants.filter(
                          (m) => m.id !== member.id
                        )
                      );
                      return;
                    }
                    const currentMember = formik.values.participants.find(
                      (m) => m.id === member.id
                    );
                    if (currentMember?.id) {
                      currentMember.amount = Number(e.target.value);
                      formik.setFieldValue('participants', [
                        ...formik.values.participants,
                      ]);
                    } else {
                      formik.setFieldValue('participants', [
                        ...formik.values.participants,
                        {
                          id: member.id,
                          amount: Number(e.target.value),
                        },
                      ]);
                    }
                  }}
                  value={
                    formik.values.participants.find((m) => m.id === member.id)
                      ?.amount || ''
                  }
                  className='w-full ml-4 bg-customDark-100 border-0 text-gray-50 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block ps-10 p-2.5 placeholder:text-gray-50 placeholder:opacity-40'
                />
              </div>
              <input
                type='checkbox'
                id={String(member.id)}
                value={member.id}
                onChange={(e) => {
                  const currentMember = formik.values.participants.find(
                    (m) => m.id === member.id
                  );
                  if (e.target.checked) {
                    let amount = currentMember?.amount || 0;
                    if (formik.values.divisionStrategy === 'EQUALS') {
                      amount =
                        formik.values.amount /
                        (formik.values.participants.length + 1);
                      1;
                    }
                    //update the amount of all participants
                    formik.setFieldValue(
                      'participants',
                      formik.values.participants.map((m) => {
                        m.amount = amount;
                        return m;
                      })
                    );
                    if (!currentMember) {
                      formik.setFieldValue('participants', [
                        ...formik.values.participants,
                        {
                          id: member.id,
                          amount: amount,
                        },
                      ]);
                    } else {
                      formik.setFieldValue('participants', [
                        ...formik.values.participants,
                        {
                          id: member.id,
                          amount: amount,
                        },
                      ]);
                    }
                  } else {
                    const newparticipants = formik.values.participants.filter(
                      (m) => m.id !== member.id
                    );
                    formik.setFieldValue(
                      'participants',
                      newparticipants.map((m) => {
                        m.amount =
                          formik.values.amount /
                            (formik.values.participants.length - 1) || 1;
                        return m;
                      })
                    );
                  }
                }}
                checked={
                  formik.values.participants.some((m) => m.id === member.id) ||
                  false
                }
                className='w-[5%] text-primary-400 bg-customDark-100 border-gray-500 rounded focus:ring-primary-400 focus:ring-2'
              />
            </li>
          ))}
          <span className='text-xs text-red-500 mt-2'>
            {formik.errors.participants as string}
          </span>
        </ul>
      </div>
    );
  };

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <section className='p-4 h-full'>
      <a
        href='#'
        className='flex flex-row items-center gap-1 mb-4'
        onClick={() => setSelectedGroup({} as Group)}
      >
        {selectedGroup.id ? (
          <ArrowLeft size='20' className='text-primary-400' />
        ) : (
          ''
        )}
        <h2 className='text-lg font-semibold text-gray-50 ml-2'>
          New expense{' '}
        </h2>
      </a>
      <div className='flex flex-col bg-opacity-10 rounded-2xl w-full h-full animate-fade-up animate-duration-300'>
        {!selectedGroup.id ? (
          <>
            <h3 className='text-sm font-extralight text-gray-50 mb-1'>
              Select a group
            </h3>
            <ul className='flex flex-col flex-wrap mt-4'>
              {groups?.length === 0 && (
                <li className='text-center text-xs text-gray-50 mt-4'>
                  No groups yet.
                </li>
              )}
              {groups?.map((group: Group, index: number) => (
                <li
                  key={group.id + group.name + index}
                  className='bg-zinc-800 rounded-xl mb-4'
                >
                  <a
                    className='flex flex-row justify-start items-center'
                    href='#'
                    onClick={() => setSelectedGroup(group)}
                  >
                    <ImageDefault name={group.name} color={group.color} />
                    <span className='text-md font-light ml-4 text-gray-50 '>
                      {group.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {groups?.length ? (
              <span
                ref={ref}
                className='block text-xs font-extralight text-center  text-gray-50 mb-2'
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
              <ImageDefault
                name={selectedGroup.name}
                color={selectedGroup.color}
                size={16}
              />
              <span className='capitalize text-md text-gray-50 mt-2'>
                {selectedGroup.name}
              </span>
            </div>
            <div>
              <form className='max-w-sm mx-auto' onSubmit={formik.handleSubmit}>
                <label
                  htmlFor='description'
                  className={`block mb-2 text-sm  text-gray-50`}
                >
                  Description
                </label>
                <div className={`relative`}>
                  <div className='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none'>
                    <Message className='w-5 h-5 text-gray-400' />
                  </div>
                  <input
                    type='text'
                    id='description'
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    className='bg-customDark-100 border-0 mb-4  text-gray-50 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5  placeholder:text-gray-50 placeholder:opacity-40'
                    placeholder='Coffee with friends'
                  />
                </div>
                <span className='text-xs text-red-500'>
                  {formik.errors.description}
                </span>
                <label
                  htmlFor='amount'
                  className='block mb-2 text-sm font-light text-gray-50 dark:text-white'
                >
                  Amount
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none'>
                    <DollarCircle className='w-5 h-5 text-gray-400' />
                  </div>
                  <input
                    type='text'
                    id='amount'
                    value={formik.values.amount}
                    onChange={(e) => {
                      formik.setFieldValue('amount', Number(e.target.value));
                      formik.setFieldValue('participants', []);
                    }}
                    className='bg-customDark-100 border-0 mb-4  text-gray-50 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5  placeholder:text-gray-50 placeholder:opacity-40'
                    placeholder='10.000'
                  />
                </div>
                <span className='text-xs text-red-500'>
                  {formik.errors.amount}
                </span>
                {renderSplitMoney()}
                <button
                  className='bg-primary-400 text-white px-4 py-2 ml-auto w-full rounded-lg'
                  type='submit'
                >
                  Create expense
                </button>
              </form>
            </div>
          </section>
        )}
      </div>
    </section>
  );
};

export default ExpenseForm;
