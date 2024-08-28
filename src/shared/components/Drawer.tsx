import React, { ReactNode } from 'react';

interface DrawerProps {
  children: ReactNode;
  isFullScreen: boolean;
  open: boolean;
  onClose: () => void;
}

const Drawer: React.FC<DrawerProps> = ({
  children,
  isFullScreen,
  open,
  onClose,
}) => {
  if (!open) {
    return null;
  }
  return (
    <div
      className={`fixed bottom-0 ${
        isFullScreen ? 'h-full' : 'h-auto'
      } left-0 right-0 z-40 w-full p-4 overflow-hidden transition-transform bg-zinc-800 animate-fade-up animate-duration-300`}
      tabIndex={1}
      aria-labelledby='drawer-top-label'
      style={{ maxHeight: '100vh' }}
    >
      <button
        type='button'
        onClick={onClose}
        className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center'
      >
        <svg
          className='w-3 h-3'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 14 14'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
          />
        </svg>
        <span className='sr-only'>Close menu</span>
      </button>
      <div
        className='overflow-auto scrollbar-hide'
        style={{ maxHeight: 'calc(100vh - 4rem)' }}
      >
        {children}
      </div>
    </div>
  );
};

export default Drawer;
