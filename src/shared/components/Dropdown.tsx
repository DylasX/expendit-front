import React from 'react';

interface DropdownProps {
  options: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }[];
  labelledBy: string;
  id: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, id, labelledBy }) => {
  return (
    <div
      id={id}
      className='z-10 bg-white hidden divide-y divide-gray-100 rounded-lg rounded-b-none w-44 shadow-[rgba(0,0,15,0.5)_0px_0px_10px_-6px]'
    >
      <ul className='py-2 text-sm text-gray-700' aria-labelledby={labelledBy}>
        {options.map((option, index) => (
          <span key={option.label + index}>
            <li className='py-1 pr-4'>
              <a
                onClick={() => option.onClick()}
                className='flex px-4 py-2 gap-3 hover:bg-gray-100 items-end'
              >
                {option.icon}
                <span>{option.label}</span>
              </a>
            </li>
            {index !== options.length - 1 && (
              <hr className='border-[0.5px] my-2 border-gray-100 w-[80%] ml-4' />
            )}
          </span>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
