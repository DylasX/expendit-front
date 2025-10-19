import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Icon from './Icon';

// Mock icon component
const MockIcon = ({ size, color, variant, className }: any) => (
  <div 
    data-testid="mock-icon" 
    data-size={size} 
    data-color={color} 
    data-variant={variant}
    className={className}
  >
    Icon
  </div>
);

describe('Icon', () => {
  it('should render icon component', () => {
    const { getByTestId } = render(<Icon icon={MockIcon} />);
    
    expect(getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('should use default size of 24', () => {
    const { getByTestId } = render(<Icon icon={MockIcon} />);
    
    expect(getByTestId('mock-icon')).toHaveAttribute('data-size', '24');
  });

  it('should use custom size when provided', () => {
    const { getByTestId } = render(<Icon icon={MockIcon} size="32" />);
    
    expect(getByTestId('mock-icon')).toHaveAttribute('data-size', '32');
  });

  it('should use default color of currentColor', () => {
    const { getByTestId } = render(<Icon icon={MockIcon} />);
    
    expect(getByTestId('mock-icon')).toHaveAttribute('data-color', 'currentColor');
  });

  it('should use custom color when provided', () => {
    const { getByTestId } = render(<Icon icon={MockIcon} color="#FF5733" />);
    
    expect(getByTestId('mock-icon')).toHaveAttribute('data-color', '#FF5733');
  });

  it('should use default variant of Linear', () => {
    const { getByTestId } = render(<Icon icon={MockIcon} />);
    
    expect(getByTestId('mock-icon')).toHaveAttribute('data-variant', 'Linear');
  });

  it('should use custom variant when provided', () => {
    const { getByTestId } = render(<Icon icon={MockIcon} variant="Bold" />);
    
    expect(getByTestId('mock-icon')).toHaveAttribute('data-variant', 'Bold');
  });

  it('should pass through additional props', () => {
    const { getByTestId } = render(<Icon icon={MockIcon} className="custom-class" />);
    
    expect(getByTestId('mock-icon')).toHaveClass('custom-class');
  });

  it('should support all variant types', () => {
    const variants: Array<'Linear' | 'Bold' | 'Broken' | 'Bulk' | 'Outline' | 'TwoTone'> = [
      'Linear', 'Bold', 'Broken', 'Bulk', 'Outline', 'TwoTone'
    ];

    variants.forEach(variant => {
      const { container } = render(<Icon icon={MockIcon} variant={variant} />);
      const icon = container.querySelector('[data-testid="mock-icon"]');
      expect(icon).toHaveAttribute('data-variant', variant);
    });
  });

  it('should handle numeric size', () => {
    const { getByTestId } = render(<Icon icon={MockIcon} size={48} />);
    
    expect(getByTestId('mock-icon')).toHaveAttribute('data-size', '48');
  });
});
