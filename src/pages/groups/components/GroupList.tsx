import { Group } from '@/pages/groups/types/group';
import React from 'react';

interface GroupListProps {
  groups: Group[];
  renderOwesYou?: (group: Group) => JSX.Element[] | string;
  className: string;
}

const GroupList: React.FC<GroupListProps> = ({
  groups,
  renderOwesYou,
  className,
}) => {
  return (
    <ul className={className}>
      {groups.length === 0 && (
        <li className='text-center text-xs text-gray-500 mt-4'>
          No groups yet.
        </li>
      )}
      {groups?.map((group: Group, index: number) => (
        <li
          key={group.id + group.name + index}
          className='pb-3 sm:pb-4 p-4 mb-3 bg-white rounded-xl'
        >
          <div className='flex items-center space-x-4 rtl:space-x-reverse'>
            <div className='flex-shrink-0'>
              <span
                className={`rounded-full p-2 text-white w-10 h-10 flex items-center justify-center text-2xl`}
                style={{ backgroundColor: group.color }}
              >
                {group.emoji}
              </span>
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-normal truncate'>{group.name}</p>
              {renderOwesYou && (
                <span className='text-xs text-gray-500 truncate font-light '>
                  {renderOwesYou(group)}
                </span>
              )}
            </div>
            <div
              className={`inline-flex items-center text-base font-normal ${
                group.balanceTotal < 0 ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {/* check if amount is - to change color */}
              {`$${Math.abs(group.balanceTotal) || 0}`}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GroupList;
