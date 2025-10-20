import Header from '@/pages/expenses/components/Header';
import useExpense from '@/pages/expenses/hooks/useExpense';
import { Group } from '@/pages/groups/types/group';
import { Expense } from '@/pages/home/types/expense';
import ImageDefault from '@/shared/components/ImageDefault';
import Loader from '@/shared/components/Loader';
import { User } from '@/shared/types/user';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const expenseDefault: Expense = {
  id: 0,
  ownerUserId: 0,
  groupId: 0,
  amount: '',
  description: '',
  divisionStrategy: '',
  createdAt: '',
  updatedAt: '',
  amountByUser: '',
  color: '',
};

const ExpenseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data = expenseDefault,
    isLoading,
    isSuccess,
  } = useExpense(Number(id));

  const expenseData: Expense & { group: Group; owner: User; users: User[] } =
    data || expenseDefault;

  if (!isSuccess && !isLoading) {
    return <Navigate to='/404' replace />;
  }

  const renderList = () => {
    // Filter to show only non-payers (amount > 0) and the payer (amount === 0)
    const payer = expenseData.users.find((user) => parseFloat(user.amount || '0') === 0);
    const nonPayers = expenseData.users.filter((user) => parseFloat(user.amount || '0') > 0);
    
    return (
      <>
        <ul className='p-4 mb-5'>
          {/* Show payer first */}
          {payer && (
            <li
              key={payer.id + 'userDetailExpense'}
              className='pb-3  p-4 mb-3 bg-zinc-800 rounded-xl'
            >
              <div className='flex items-center space-x-4'>
                <div className='flex-shrink-0'>
                  <ImageDefault name={payer.fullName} color={payer.color} />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-normal truncate text-gray-50'>
                    {payer.fullName}
                  </p>
                  <p className='text-xs text-gray-400 mt-1'>
                    Your share: ${(parseFloat(expenseData.amount) / expenseData.users.length).toFixed(2)}
                  </p>
                </div>
                <div className='inline-flex flex-col items-end text-base font-normal text-primary-500'>
                  <div className='flex items-center'>
                    <span className='mr-4 text-xs font-bold'>Paid</span>$
                    {parseFloat(expenseData.amount)}
                  </div>
                </div>
              </div>
            </li>
          )}
          {/* Show non-payers who owe money */}
          {nonPayers.map((user) => (
            <li
              key={user.id + 'userDetailExpense'}
              className='pb-3  p-4 mb-3 bg-zinc-800 rounded-xl'
            >
              <div className='flex items-center space-x-4'>
                <div className='flex-shrink-0'>
                  <ImageDefault name={user.fullName} color={user.color} />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-normal truncate text-gray-50'>
                    {user.fullName}
                  </p>
                </div>
                <div className='inline-flex items-center text-base font-normal text-red-500'>
                  <span className='mr-4 text-xs font-bold'>Owes</span>$
                  {parseFloat(user.amount || '0')}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <main className='h-screen'>
      <Header expense={data as Expense} />
      {isLoading ? (
        <Loader />
      ) : (
        <section className='bg-zinc-500/10 rounded-2xl w-full min-h-[70%] animate-fade-up animate-duration-300 pb-10'>
          {renderList()}
        </section>
      )}
    </main>
  );
};

export default ExpenseDetail;
