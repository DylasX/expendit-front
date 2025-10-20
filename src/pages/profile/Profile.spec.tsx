import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Profile from './Profile';

describe('Profile Page', () => {
  it('should render page heading', () => {
    render(<Profile />);
    
    expect(screen.getByRole('heading', { name: /profile page/i })).toBeInTheDocument();
  });

  it('should render welcome message', () => {
    render(<Profile />);
    
    expect(screen.getByText(/welcome to your profile/i)).toBeInTheDocument();
  });

  it('should have text-white class on container', () => {
    const { container } = render(<Profile />);
    
    const div = container.querySelector('.text-white');
    expect(div).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    const { container } = render(<Profile />);
    
    expect(container).toBeInTheDocument();
  });
});
