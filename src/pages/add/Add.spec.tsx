import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Add from './Add';

describe('Add Page', () => {
  it('should render page heading', () => {
    render(<Add />);
    
    expect(screen.getByRole('heading', { name: /add page/i })).toBeInTheDocument();
  });

  it('should render page description', () => {
    render(<Add />);
    
    expect(screen.getByText(/this is a dummy page for adding content/i)).toBeInTheDocument();
  });

  it('should have text-white class on container', () => {
    const { container } = render(<Add />);
    
    const div = container.querySelector('.text-white');
    expect(div).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    const { container } = render(<Add />);
    
    expect(container).toBeInTheDocument();
  });
});
