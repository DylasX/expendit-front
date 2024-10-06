import { Group } from '@/pages/groups/types/group';
import ImageDefault from '@/shared/components/ImageDefault';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  return (
    <ul className={className}>
      {groups.length === 0 && (
        <li className='text-center text-xs text-gray-50 mt-4'>
          No groups yet.
        </li>
      )}
      {groups?.map((group: Group, index: number) => (
        <li
          key={group.id + group.name + index}
          className='pb-3 sm:pb-4 p-4 mb-3 bg-zinc-800 rounded-xl'
        >
          <a
            className='flex items-center space-x-4 rtl:space-x-reverse'
            onClick={() => navigate(`/group/${group.id}`)}
          >
            <div className='flex-shrink-0'>
              <ImageDefault name={group.name} color={group.color} />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-normal truncate text-gray-50'>
                {group.name}
              </p>
              {renderOwesYou && (
                <span className='text-xs text-gray-50 truncate font-light '>
                  {renderOwesYou(group)}
                </span>
              )}
            </div>
            <div
              className={`inline-flex items-center text-base font-normal ${
                group.balanceTotal < 0 ? 'text-red-400' : 'text-primary-400'
              }`}
            >
              {/* check if amount is - to change color */}
              {`$${Math.abs(group.balanceTotal) || 0}`}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default GroupList;
