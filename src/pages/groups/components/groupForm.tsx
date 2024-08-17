import { Profile2User } from 'iconsax-react';
import React, { useState } from 'react';

interface GroupFormProps {}

const GroupForm: React.FC<GroupFormProps> = () => {
  const [selectedColor, setSelectedColor] = useState<string>('');

  const colors = ['#A8DADC', '#457B9D', '#1D3557', '#AAADDD', '#E63946'];

  return (
    <section className='p-4'>
      <h2 className='text-lg font-semibold text-zinc-700 mb-6'>
        Create a new group{' '}
      </h2>
      <form className='max-w-sm mx-auto'>
        <label
          htmlFor='groupName'
          className='block mb-2 text-sm font-light text-zinc-700'
        >
          Group name
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
          />
        </div>
        <label className='block mb-2 text-sm font-light text-zinc-700'>
          Tag with a color
        </label>
        <div className='flex space-x-2 mb-6'>
          {colors.map((color) => (
            <div
              key={color}
              className={`w-8 h-8 rounded-md cursor-pointer ${
                selectedColor === color
                  ? 'ring-2 ring-offset-2 ring-amber-500'
                  : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            ></div>
          ))}
        </div>
        <label
          htmlFor='inviteEmails'
          className='block mb-2 text-sm font-light text-zinc-700'
        >
          Invite users (emails separated by commas)
        </label>
        <textarea
          id='inviteEmails'
          name='inviteEmails'
          className='border bg-white border-gray-300 text-zinc-700 text-sm rounded-md focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5 mb-6'
          placeholder='user1@example.com, user2@example.com'
          rows={4}
        ></textarea>
        <button
          type='submit'
          className='bg-amber-400 text-white py-2 px-4 rounded-md mt-16 ml-auto flex'
        >
          Create Group
        </button>
      </form>
    </section>
  );
};

export default GroupForm;
