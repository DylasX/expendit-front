import React, { useState } from 'react';

interface GroupFormProps {}

const GroupForm: React.FC<GroupFormProps> = () => {
  const [groupName, setGroupName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGroupName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='groupName'>Group Name:</label>
      <input
        type='text'
        id='groupName'
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button type='submit'>Create Group</button>
    </form>
  );
};

export default GroupForm;
