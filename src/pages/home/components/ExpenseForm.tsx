import useGroup from '@/pages/groups/hooks/useGroup';
import useGroups from '@/pages/groups/hooks/useGroups';
import { Group } from '@/pages/groups/types/group';
import { ExpensePayload } from '@/pages/home/types/expense';
import { expenseValidator } from '@/pages/home/validator/expense';
import { User } from '@/shared/types/user';
import { useFormik } from 'formik';
import { DollarCircle, Message } from 'iconsax-react';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { toFormikValidationSchema } from 'zod-formik-adapter';

interface ExpenseFormProps {
  onClose: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = () => {
  const [selectedGroup, setSelectedGroup] = React.useState({} as Group);
  const [shouldRenderSplitMoney, setShouldRenderSplitMoney] =
    React.useState(false);
  const { ref, inView } = useInView();
  const { groups, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGroups();
  const { data: group } = useGroup(selectedGroup?.id);
  const handleRadioButtons = (e: React.ChangeEvent<HTMLInputElement>) =>
    formik.setFieldValue('divisionStrategy', e.target.value);

  const formik = useFormik<ExpensePayload>({
    initialValues: {
      description: '',
      emoji: '',
      amount: 0,
      divisionStrategy: 'equals',
      members: [],
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      //validate the current user is included in the members
      console.log(values);
    },
    validationSchema: toFormikValidationSchema(expenseValidator),
  });

  React.useEffect(() => {
    console.log(formik.values);
  }, [formik.values]);

  const renderSplitMoney = () => {
    return (
      <div className='animate-fade-up animate-duration-300'>
        <div className='flex items-center ps-4 mt-2'>
          <input
            id='strategy-equals'
            type='radio'
            name='strategy'
            value={'equals'}
            onChange={handleRadioButtons}
            checked={formik.values.divisionStrategy === 'equals'}
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
            value={'value'}
            name='strategy'
            onChange={handleRadioButtons}
            checked={formik.values.divisionStrategy === 'value'}
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
            value={'percentage'}
            name='strategy'
            onChange={handleRadioButtons}
            checked={formik.values.divisionStrategy === 'percentage'}
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
                className='ml-0 text-gray-900 dark:text-white'
              >
                {member.fullName}
              </label>
              <input
                type='number'
                id={String(member.id) + 'amount'}
                onChange={(e) => {
                  if (e.target.value === '' || Number(e.target.value) === 0) {
                    formik.setFieldValue(
                      'members',
                      formik.values.members.filter((m) => m.id !== member.id)
                    );
                    return;
                  }
                  const currentMember = formik.values.members.find(
                    (m) => m.id === member.id
                  );
                  if (currentMember?.id) {
                    currentMember.amount = Number(e.target.value);
                    formik.setFieldValue('members', [...formik.values.members]);
                  } else {
                    formik.setFieldValue('members', [
                      ...formik.values.members,
                      {
                        id: member.id,
                        amount: Number(e.target.value),
                      },
                    ]);
                  }
                }}
                className='rounded-sm text-primary-500 border-gray-300 focus:ring-primary-500 focus:border-primary-500'
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
                  className='block mb-2 text-sm font-light text-gray-900 dark:text-white'
                >
                  Description
                </label>
                <div className='relative'>
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
                    onChange={formik.handleChange}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5  '
                    placeholder='10.000'
                  />
                </div>
                <span className='text-xs text-red-500'>
                  {formik.errors.amount}
                </span>
                <div className='flex justify-center mt-2'>
                  <button
                    className='px-4 py-2 rounded-lg border-primary-400 text-primary-400 border font-light mt-8'
                    type='button'
                    onClick={() =>
                      setShouldRenderSplitMoney(!shouldRenderSplitMoney)
                    }
                  >
                    Splitted by {formik.values.divisionStrategy}
                  </button>
                </div>
                {shouldRenderSplitMoney ? (
                  renderSplitMoney()
                ) : (
                  <button
                    className='bg-primary-400 text-white px-4 py-2 rounded-lg mt-4'
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
