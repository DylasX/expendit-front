import Content from '@/pages/home/components/Content';
import ExpenseForm from '@/pages/home/components/ExpenseForm';
import { useUser } from '@/pages/login/hooks/useUser';
import Drawer from '@/shared/components/Drawer';
import Header from '@/shared/components/Header';
import React from 'react';

const Home: React.FC = () => {
  const { data: user } = useUser();
  const [open, setOpen] = React.useState(false);

  const onClose = () => {
    setOpen(false);
  };
  return (
    <main
      className={`overflow-y-auto scrollbar-hide ${open ? 'fixed' : 'block'}`}
    >
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
        openDrawer={() => {
          setOpen(true);
        }}
      />{' '}
      <Content />
      <Drawer isFullScreen={true} open={open} onClose={onClose}>
        <ExpenseForm onClose={onClose} />
      </Drawer>
    </main>
  );
};

export default Home;
