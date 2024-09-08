import React, { MouseEventHandler } from 'react';

interface ToggleButtonProps {
  checked: boolean;
  onChange: ((e: React.ChangeEvent<HTMLInputElement>) => void) | (() => void);
  leftLabel?: string; // Etiqueta opcional para el lado izquierdo
  rightLabel?: string; // Etiqueta opcional para el lado derecho
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  checked,
  onChange,
  leftLabel,
  rightLabel,
}) => {
  return (
    <div className='flex items-center'>
      <div
        onClick={onChange as MouseEventHandler<HTMLDivElement>}
        className={`relative inline-flex items-center h-8 rounded-full w-[85px] cursor-pointer transition-colors bg-primary-400`}
      >
        {leftLabel && (
          <span
            className={`absolute left-2 text-sm text-white transition-opacity ${
              checked ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {leftLabel}
          </span>
        )}
        <span
          className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform ${
            checked ? 'translate-x-14' : 'translate-x-1'
          }`}
        />
        {rightLabel && (
          <span
            className={`absolute right-2 text-sm text-white transition-opacity ${
              checked ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {rightLabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default ToggleButton;
