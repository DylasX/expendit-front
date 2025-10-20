import React from 'react';

/**
 * Wrapper for iconsax-react icons to fix React 19 compatibility
 * React 19 removed defaultProps, so we need to explicitly set color and size
 */
interface IconWrapperProps {
  icon: React.ComponentType<any>;
  size?: string | number;
  color?: string;
  variant?: 'Linear' | 'Bold' | 'Broken' | 'Bulk' | 'Outline' | 'TwoTone';
  className?: string;
  [key: string]: any;
}

const Icon: React.FC<IconWrapperProps> = ({
  icon: IconComponent,
  size = '24',
  color = 'currentColor',
  variant = 'Linear',
  ...props
}) => {
  return (
    <IconComponent
      size={size}
      color={color}
      variant={variant}
      {...props}
    />
  );
};

export default Icon;
