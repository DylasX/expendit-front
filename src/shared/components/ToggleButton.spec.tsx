import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleButton from './ToggleButton';

describe('ToggleButton', () => {
  it('should render toggle button', () => {
    const { container } = render(
      <ToggleButton checked={false} onChange={vi.fn()} />
    );
    
    const toggle = container.querySelector('.inline-flex');
    expect(toggle).toBeInTheDocument();
  });

  it('should call onChange when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    const { container } = render(
      <ToggleButton checked={false} onChange={handleChange} />
    );
    
    const toggle = container.querySelector('.inline-flex');
    await user.click(toggle!);
    
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('should show toggle in unchecked position', () => {
    const { container } = render(
      <ToggleButton checked={false} onChange={vi.fn()} />
    );
    
    const knob = container.querySelector('.bg-white');
    expect(knob).toHaveClass('translate-x-1');
  });

  it('should show toggle in checked position', () => {
    const { container } = render(
      <ToggleButton checked={true} onChange={vi.fn()} />
    );
    
    const knob = container.querySelector('.bg-white');
    expect(knob).toHaveClass('translate-x-14');
  });

  it('should render left label when provided', () => {
    render(
      <ToggleButton 
        checked={false} 
        onChange={vi.fn()} 
        leftLabel="On" 
      />
    );
    
    expect(screen.getByText('On')).toBeInTheDocument();
  });

  it('should render right label when provided', () => {
    render(
      <ToggleButton 
        checked={false} 
        onChange={vi.fn()} 
        rightLabel="Off" 
      />
    );
    
    expect(screen.getByText('Off')).toBeInTheDocument();
  });

  it('should show left label when checked', () => {
    render(
      <ToggleButton 
        checked={true} 
        onChange={vi.fn()} 
        leftLabel="On" 
      />
    );
    
    const leftLabel = screen.getByText('On');
    expect(leftLabel).toHaveClass('opacity-100');
  });

  it('should hide left label when unchecked', () => {
    render(
      <ToggleButton 
        checked={false} 
        onChange={vi.fn()} 
        leftLabel="On" 
      />
    );
    
    const leftLabel = screen.getByText('On');
    expect(leftLabel).toHaveClass('opacity-0');
  });

  it('should show right label when unchecked', () => {
    render(
      <ToggleButton 
        checked={false} 
        onChange={vi.fn()} 
        rightLabel="Off" 
      />
    );
    
    const rightLabel = screen.getByText('Off');
    expect(rightLabel).toHaveClass('opacity-100');
  });

  it('should hide right label when checked', () => {
    render(
      <ToggleButton 
        checked={true} 
        onChange={vi.fn()} 
        rightLabel="Off" 
      />
    );
    
    const rightLabel = screen.getByText('Off');
    expect(rightLabel).toHaveClass('opacity-0');
  });

  it('should have cursor pointer', () => {
    const { container } = render(
      <ToggleButton checked={false} onChange={vi.fn()} />
    );
    
    const toggle = container.querySelector('.inline-flex');
    expect(toggle).toHaveClass('cursor-pointer');
  });

  it('should have correct width', () => {
    const { container } = render(
      <ToggleButton checked={false} onChange={vi.fn()} />
    );
    
    const toggle = container.querySelector('.inline-flex');
    expect(toggle).toHaveClass('w-[85px]');
  });

  it('should have correct height', () => {
    const { container } = render(
      <ToggleButton checked={false} onChange={vi.fn()} />
    );
    
    const toggle = container.querySelector('.inline-flex');
    expect(toggle).toHaveClass('h-8');
  });

  it('should be rounded', () => {
    const { container } = render(
      <ToggleButton checked={false} onChange={vi.fn()} />
    );
    
    const toggle = container.querySelector('.inline-flex');
    expect(toggle).toHaveClass('rounded-full');
  });

  it('should have primary background color', () => {
    const { container } = render(
      <ToggleButton checked={false} onChange={vi.fn()} />
    );
    
    const toggle = container.querySelector('.inline-flex');
    expect(toggle).toHaveClass('bg-primary-400');
  });

  it('should render both labels when provided', () => {
    render(
      <ToggleButton 
        checked={false} 
        onChange={vi.fn()} 
        leftLabel="Yes" 
        rightLabel="No" 
      />
    );
    
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });
});
