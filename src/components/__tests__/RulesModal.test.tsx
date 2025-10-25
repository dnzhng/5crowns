import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RulesModal from '../RulesModal';

describe('RulesModal', () => {
  it('renders modal when isOpen is true', () => {
    render(<RulesModal isOpen={true} onClose={jest.fn()} />);

    expect(screen.getByText('Five Crowns Rules')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(<RulesModal isOpen={false} onClose={jest.fn()} />);

    expect(screen.queryByText('Five Crowns Rules')).not.toBeInTheDocument();
  });

  it('renders link to rulebook PDF', () => {
    render(<RulesModal isOpen={true} onClose={jest.fn()} />);

    const link = screen.getByRole('link', { name: /view full rulebook/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://cdn.1j1ju.com/medias/b3/19/ed-five-crowns-rulebook.pdf');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders close buttons', () => {
    render(<RulesModal isOpen={true} onClose={jest.fn()} />);

    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    expect(closeButtons.length).toBe(2); // X button and Close button
  });

  it('calls onClose when X button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<RulesModal isOpen={true} onClose={onClose} />);

    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    await user.click(closeButtons[0]); // X button

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<RulesModal isOpen={true} onClose={onClose} />);

    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    await user.click(closeButtons[1]); // Close button

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside modal', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const { container } = render(<RulesModal isOpen={true} onClose={onClose} />);

    // Click on the backdrop (the outer div)
    const backdrop = container.querySelector('[data-testid="modal-backdrop"]');
    if (backdrop) {
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('does not call onClose when clicking inside modal content', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<RulesModal isOpen={true} onClose={onClose} />);

    const modalContent = screen.getByText('Five Crowns Rules').parentElement;
    if (modalContent) {
      await user.click(modalContent);
      expect(onClose).not.toHaveBeenCalled();
    }
  });

  it('renders game overview text', () => {
    render(<RulesModal isOpen={true} onClose={jest.fn()} />);

    expect(screen.getByText(/Five Crowns is a card game/i)).toBeInTheDocument();
  });

  it('applies correct modal styling', () => {
    const { container } = render(<RulesModal isOpen={true} onClose={jest.fn()} />);

    const backdrop = container.querySelector('[data-testid="modal-backdrop"]');
    expect(backdrop).toHaveClass('fixed', 'inset-0', 'bg-black', 'bg-opacity-50');
  });
});
