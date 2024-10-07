import useGroup from '@/pages/groups/hooks/useGroup';
import { Group } from '@/pages/groups/types/group';
import Header from '@/pages/detailGroup/components/Header';
import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Loader from '@/shared/components/Loader';
import ImageDefault from '@/shared/components/ImageDefault';
import { Expense } from '@/pages/home/types/expense';
import { User } from '@/shared/types/user';

const groupDefault: Group = {
  id: 0,
  name: '',
  color: '',
  balanceTotal: 0,
  balances: [],
};

const DetailGroup: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data = groupDefault, isLoading, isSuccess } = useGroup(Number(id));
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<'expenses' | 'members'>(
    'expenses'
  );

  if (!isSuccess && !isLoading) {
    return <Navigate to='/404' replace />;
  }

  const renderList = () => {
    if (activeTab === 'expenses') {
      if (!data.expenses?.length) {
        return <span className='p-4 text-white text-sm'>No expenses.</span>;
      }
      return (
        <ul className='p-4 mb-5'>
          {data.expenses.map((expense: Expense) => (
            <li
              key={expense.id + 'expenseDetail'}
              className='pb-3  p-4 mb-3 bg-zinc-800 rounded-xl'
            >
              <a
                onClick={() => navigate(`/expense/${expense.id}`)}
                className='flex items-center space-x-4'
              >
                <div className='flex-shrink-0'>
                  <ImageDefault
                    name={expense.description}
                    color={expense.color}
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-normal truncate text-gray-50'>
                    {expense.description}
                  </p>
                </div>
                <div className='inline-flex items-center text-base font-normal text-primary-500'>
                  ${expense.amount}
                </div>
              </a>
            </li>
          ))}
        </ul>
      );
    }
    return (
      <>
        <ul className='p-4 mb-5'>
          {data.users.map((user: User) => (
            <li
              key={user.id + 'userDetail'}
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
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <main className='scrollbar-hide h-screen'>
      <Header group={data as Group} />
      {isLoading ? (
        <Loader />
      ) : (
        <div className='bg-zinc-500 bg-opacity-10 rounded-2xl w-full min-h-[70%] animate-fade-up animate-duration-300 pb-10'>
          <div className='p-5 text-left w-full text-gray-50'>
            <div className='relative flex flex-row justify-around'>
              <button
                className={`text-md mb-2 ${
                  activeTab === 'expenses' ? 'text-primary-400' : ''
                }`}
                onClick={() => setActiveTab('expenses')}
              >
                Expenses
              </button>
              <button
                className={`text-md mb-2 ${
                  activeTab === 'members' ? 'text-primary-400' : ''
                }`}
                onClick={() => setActiveTab('members')}
              >
                Members
              </button>
              <div
                className={`absolute bottom-0 h-0.5 bg-primary-500 transition-all duration-300 ${
                  activeTab === 'expenses' ? 'left-0 w-1/2' : 'left-1/2 w-1/2'
                }`}
              />
            </div>
          </div>
          {renderList()}
        </div>
      )}
    </main>
  );
};

export default DetailGroup;
