import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Drawer from './Drawer';

describe('Drawer', () => {
  it('should not render when open is false', () => {
    const { container } = render(
      <Drawer isFullScreen={false} open={false} onClose={vi.fn()}>
        <div>Drawer Content</div>
      </Drawer>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render when open is true', () => {
    render(
      <Drawer isFullScreen={false} open={true} onClose={vi.fn()}>
        <div>Drawer Content</div>
      </Drawer>
    );

    expect(screen.getByText('Drawer Content')).toBeInTheDocument();
  });

  it('should render children correctly', () => {
    render(
      <Drawer isFullScreen={false} open={true} onClose={vi.fn()}>
        <div>Test Child 1</div>
        <div>Test Child 2</div>
      </Drawer>
    );

    expect(screen.getByText('Test Child 1')).toBeInTheDocument();
    expect(screen.getByText('Test Child 2')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Drawer isFullScreen={false} open={true} onClose={handleClose}>
        <div>Content</div>
      </Drawer>
    );

    const closeButton = screen.getByRole('button');
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('should apply full screen height when isFullScreen is true', () => {
    const { container } = render(
      <Drawer isFullScreen={true} open={true} onClose={vi.fn()}>
        <div>Content</div>
      </Drawer>
    );

    const drawer = container.querySelector('.drawer');
    expect(drawer).toHaveClass('h-full');
  });

  it('should apply auto height when isFullScreen is false', () => {
    const { container } = render(
      <Drawer isFullScreen={false} open={true} onClose={vi.fn()}>
        <div>Content</div>
      </Drawer>
    );

    const drawer = container.querySelector('.drawer');
    expect(drawer).toHaveClass('h-auto');
  });

  it('should have correct accessibility attributes', () => {
    const { container } = render(
      <Drawer isFullScreen={false} open={true} onClose={vi.fn()}>
        <div>Content</div>
      </Drawer>
    );

    const drawer = container.querySelector('.drawer');
    expect(drawer).toHaveAttribute('aria-labelledby', 'drawer-top-label');
    expect(drawer).toHaveAttribute('tabIndex', '1');
  });

  it('should have close button with accessible label', () => {
    render(
      <Drawer isFullScreen={false} open={true} onClose={vi.fn()}>
        <div>Content</div>
      </Drawer>
    );

    expect(screen.getByText('Close menu')).toBeInTheDocument();
  });

  it('should have fixed positioning', () => {
    const { container } = render(
      <Drawer isFullScreen={false} open={true} onClose={vi.fn()}>
        <div>Content</div>
      </Drawer>
    );

    const drawer = container.querySelector('.drawer');
    expect(drawer).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0');
  });

  it('should have correct z-index', () => {
    const { container } = render(
      <Drawer isFullScreen={false} open={true} onClose={vi.fn()}>
        <div>Content</div>
      </Drawer>
    );

    const drawer = container.querySelector('.drawer');
    expect(drawer).toHaveClass('z-40');
  });
});
