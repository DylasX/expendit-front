import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ImageDefault from './ImageDefault';

describe('ImageDefault', () => {
  it('should render with initials from name', () => {
    const { container } = render(<ImageDefault name="John Doe" />);
    
    expect(container.textContent).toBe('JD');
  });

  it('should render single initial for single word name', () => {
    const { container } = render(<ImageDefault name="John" />);
    
    expect(container.textContent).toBe('J');
  });

  it('should render first two initials for multi-word name', () => {
    const { container } = render(<ImageDefault name="John Michael Doe" />);
    
    expect(container.textContent).toBe('JM');
  });

  it('should convert initials to uppercase', () => {
    const { container } = render(<ImageDefault name="john doe" />);
    
    expect(container.textContent).toBe('JD');
  });

  it('should use default size of 10', () => {
    const { container } = render(<ImageDefault name="John Doe" />);
    
    const span = container.querySelector('span');
    expect(span).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('should use custom size when provided', () => {
    const { container } = render(<ImageDefault name="John Doe" size={20} />);
    
    const span = container.querySelector('span');
    expect(span).toHaveStyle({ width: '80px', height: '80px' });
  });

  it('should apply hex color when provided', () => {
    const { container } = render(<ImageDefault name="John Doe" color="#FF5733" />);
    
    const span = container.querySelector('span');
    expect(span).toHaveStyle({ backgroundColor: '#FF5733' });
  });

  it('should have rounded-full class', () => {
    const { container } = render(<ImageDefault name="John Doe" />);
    
    const span = container.querySelector('span');
    expect(span).toHaveClass('rounded-full');
  });

  it('should have text-white class', () => {
    const { container } = render(<ImageDefault name="John Doe" />);
    
    const span = container.querySelector('span');
    expect(span).toHaveClass('text-white');
  });

  it('should have flex and center classes', () => {
    const { container } = render(<ImageDefault name="John Doe" />);
    
    const span = container.querySelector('span');
    expect(span).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('should calculate font size proportionally to size', () => {
    const { container } = render(<ImageDefault name="John Doe" size={15} />);
    
    const span = container.querySelector('span');
    expect(span).toHaveStyle({ fontSize: '1.5rem' });
  });

  it('should handle empty name gracefully', () => {
    const { container } = render(<ImageDefault name="" />);
    
    expect(container.textContent).toBe('');
  });

  it('should handle single character name', () => {
    const { container } = render(<ImageDefault name="J" />);
    
    expect(container.textContent).toBe('J');
  });

  it('should be inline-block', () => {
    const { container } = render(<ImageDefault name="John Doe" />);
    
    const span = container.querySelector('span');
    expect(span).toHaveClass('inline-block');
  });
});
