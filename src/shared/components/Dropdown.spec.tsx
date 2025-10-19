import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown from './Dropdown';

describe('Dropdown', () => {
  const mockOptions = [
    { label: 'Option 1', onClick: vi.fn() },
    { label: 'Option 2', onClick: vi.fn() },
    { label: 'Option 3', onClick: vi.fn() },
  ];

  it('should render all options', () => {
    render(<Dropdown options={mockOptions} id="test-dropdown" labelledBy="test-label" />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should call onClick when option is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const options = [{ label: 'Test Option', onClick: handleClick }];

    render(<Dropdown options={options} id="test-dropdown" labelledBy="test-label" />);

    await user.click(screen.getByText('Test Option'));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should render icons when provided', () => {
    const optionsWithIcons = [
      { label: 'With Icon', onClick: vi.fn(), icon: <span data-testid="test-icon">Icon</span> },
    ];

    render(<Dropdown options={optionsWithIcons} id="test-dropdown" labelledBy="test-label" />);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('should have correct id attribute', () => {
    const { container } = render(
      <Dropdown options={mockOptions} id="custom-dropdown" labelledBy="test-label" />
    );

    const dropdown = container.querySelector('#custom-dropdown');
    expect(dropdown).toBeInTheDocument();
  });

  it('should have correct aria-labelledby attribute', () => {
    render(<Dropdown options={mockOptions} id="test-dropdown" labelledBy="custom-label" />);

    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('aria-labelledby', 'custom-label');
  });

  it('should render separators between options', () => {
    const { container } = render(
      <Dropdown options={mockOptions} id="test-dropdown" labelledBy="test-label" />
    );

    const separators = container.querySelectorAll('hr');
    // Should have n-1 separators for n options
    expect(separators).toHaveLength(mockOptions.length - 1);
  });

  it('should not render separator after last option', () => {
    const { container } = render(
      <Dropdown options={mockOptions} id="test-dropdown" labelledBy="test-label" />
    );

    const listItems = container.querySelectorAll('li');
    const lastItem = listItems[listItems.length - 1];
    const separatorAfterLast = lastItem.nextElementSibling;

    expect(separatorAfterLast).toBeNull();
  });

  it('should render empty dropdown when no options provided', () => {
    render(<Dropdown options={[]} id="test-dropdown" labelledBy="test-label" />);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(0);
  });

  it('should handle multiple clicks on same option', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const options = [{ label: 'Clickable', onClick: handleClick }];

    render(<Dropdown options={options} id="test-dropdown" labelledBy="test-label" />);

    const option = screen.getByText('Clickable');
    await user.click(option);
    await user.click(option);
    await user.click(option);

    expect(handleClick).toHaveBeenCalledTimes(3);
  });
});
