import useGroup from '@/pages/groups/hooks/useGroup';
import useGroups from '@/pages/groups/hooks/useGroups';
import { Group } from '@/pages/groups/types/group';
import { ExpensePayload } from '@/pages/home/types/expense';
import { expenseValidator } from '@/pages/home/validator/expense';
import { useUser } from '@/pages/login/hooks/useUser';
import { queryClient } from '@/shared/client/queryClient';
import { protectedApi } from '@/shared/services/request';
import { User } from '@/shared/types/user';
import { useMutation } from '@tanstack/react-query';
import EmojiPicker, { SkinTonePickerLocation } from 'emoji-picker-react';
import { useFormik } from 'formik';
import { DollarCircle, Message } from 'iconsax-react';
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
  const [shouldRenderSplitMoney, setShouldRenderSplitMoney] =
    React.useState(false);
  const { ref, inView } = useInView();
  const { groups, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGroups();
  const { data: group } = useGroup(selectedGroup?.id);
  const handleRadioButtons = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('participants', []);
    formik.setFieldValue('divisionStrategy', e.target.value);
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
      emoji: '',
      amount: 0,
      divisionStrategy: 'EQUALS',
      participants: [],
      groupId: 0,
    },
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      //validate the current user is included in the participants
      //convert to negative all the participants amount with id different from the current user
      values.groupId = selectedGroup.id;
      values.participants = values.participants.map((m) => {
        if (m.id !== user?.id) {
          m.amount = -m.amount;
        }
        return m;
      });
      expenseMutation.mutate(values);
    },
    validationSchema: toFormikValidationSchema(expenseValidator),
  });

  const renderSplitMoney = () => {
    return (
      <div className='animate-fade-up animate-duration-300'>
        <div className='flex items-center ps-4 mt-2'>
          <input
            id='strategy-equals'
            type='radio'
            name='strategy'
            value={'EQUALS'}
            onChange={handleRadioButtons}
            checked={formik.values.divisionStrategy === 'EQUALS'}
            className='w-4 h-4 text-primary-400 bg-gray-100 border-gray-300 focus:ring-primary-500  focus:ring-2'
          />
          <label
            htmlFor='strategy-equals'
            className='w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
          >
            Equals
          </label>
          <input
            id='strategy-value'
            type='radio'
            value={'VALUES'}
            name='strategy'
            onChange={handleRadioButtons}
            disabled
            checked={formik.values.divisionStrategy === 'VALUES'}
            className='w-4 h-4 text-primary-400 bg-gray-100 border-gray-300 focus:ring-primary-500  focus:ring-2'
          />
          <label
            htmlFor='strategy-value'
            className='w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
          >
            Value
          </label>
          <input
            id='strategy-percentage'
            type='radio'
            value={'PERCENTAGE'}
            name='strategy'
            onChange={handleRadioButtons}
            disabled
            checked={formik.values.divisionStrategy === 'PERCENTAGE'}
            className='w-4 h-4 text-primary-400 bg-gray-100 border-gray-300 focus:ring-primary-500  focus:ring-2'
          />
          <label
            htmlFor='strategy-percentage'
            className='w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
          >
            Percentage
          </label>
          <span className='text-xs text-red-500'>
            {formik.errors.divisionStrategy}
          </span>
        </div>
        <ul>
          {group?.users.map((member: User) => (
            <li
              key={member.id}
              className='flex items-center mb-2 mt-4 justify-between'
            >
              <label
                htmlFor={String(member.id)}
                className='ml-0 text-gray-900 dark:text-white text-md font-light w-[8%]'
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
                  className='w-full ml-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block ps-10 p-2.5'
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
                className='w-[5%] text-primary-400 bg-gray-100 border-gray-300 rounded focus:ring-primary-400 focus:ring-2'
              />
            </li>
          ))}
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
            <div>
              <form className='max-w-sm mx-auto' onSubmit={formik.handleSubmit}>
                <label
                  htmlFor='description'
                  className={`block mb-2 text-sm font-light text-gray-900 dark:text-white ${
                    shouldRenderSplitMoney ? 'hidden' : 'block'
                  }`}
                >
                  Description
                </label>
                <div
                  className={`relative ${
                    shouldRenderSplitMoney ? 'hidden' : 'block'
                  }`}
                >
                  <div className='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none'>
                    <Message className='w-5 h-5 text-gray-400' />
                  </div>
                  <input
                    type='text'
                    id='description'
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    className='bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5  '
                    placeholder='Coffee with friends'
                  />
                </div>
                <span className='text-xs text-red-500'>
                  {formik.errors.description}
                </span>
                <label
                  htmlFor='amount'
                  className='block mb-2 text-sm font-light text-gray-900 dark:text-white'
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
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5  '
                    placeholder='10.000'
                  />
                </div>
                <span className='text-xs text-red-500'>
                  {formik.errors.amount}
                </span>
                <label
                  className={`flex items-center justify-between mb-2 text-sm font-light text-zinc-700 ${
                    shouldRenderSplitMoney ? 'hidden' : 'flex'
                  }`}
                >
                  Pick an emoji{' '}
                  <span className='rounded-full p-2 text-white w-10 h-10 flex items-center justify-center text-2xl'>
                    {formik.values.emoji}
                  </span>
                </label>
                <div
                  className={`flex flex-col space-x-2 mb-4 animate-fade-up ${
                    shouldRenderSplitMoney ? 'hidden' : 'block'
                  }`}
                >
                  <EmojiPicker
                    width={'100%'}
                    height={'300px'}
                    skinTonePickerLocation={SkinTonePickerLocation.SEARCH}
                    style={{
                      marginLeft: '0',
                    }}
                    onEmojiClick={({ emoji }) =>
                      formik.setFieldValue('emoji', emoji)
                    }
                  />
                </div>
                <div className='flex justify-center mt-2 flex-col text-center'>
                  <button
                    className='px-4 py-2 rounded-lg border-primary-400 text-primary-400 border font-light mt-8'
                    type='button'
                    onClick={() =>
                      setShouldRenderSplitMoney(!shouldRenderSplitMoney)
                    }
                  >
                    Splitted by {formik.values.divisionStrategy}
                  </button>
                  <span className='text-xs text-red-500 mt-2'>
                    {formik.errors.participants as string}
                  </span>
                </div>
                {shouldRenderSplitMoney ? (
                  renderSplitMoney()
                ) : (
                  <button
                    className='bg-primary-400 text-white px-4 py-2 ml-auto flex rounded-lg mt-2'
                    type='submit'
                  >
                    Create expense
                  </button>
                )}
              </form>
            </div>
          </section>
        )}
      </div>
    </section>
  );
};

export default ExpenseForm;
