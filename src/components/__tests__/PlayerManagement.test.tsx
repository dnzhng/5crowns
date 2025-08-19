import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlayerManagement from '../PlayerManagement';
import { Player } from '../types';

const mockPlayers: Player[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' }
];

const defaultProps = {
  players: mockPlayers,
  onAddPlayer: jest.fn(),
  onRemovePlayer: jest.fn(),
  onUpdatePlayer: jest.fn(),
  showPlayerManagement: true,
  onToggleVisibility: jest.fn(),
  hasRounds: false
};

describe('PlayerManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when showPlayerManagement is true', () => {
    it('renders player management interface', () => {
      render(<PlayerManagement {...defaultProps} />);
      
      expect(screen.getByText('Players')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Player name')).toBeInTheDocument();
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    it('displays all players', () => {
      render(<PlayerManagement {...defaultProps} />);
      
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('shows hide button when hasRounds is true', () => {
      render(<PlayerManagement {...defaultProps} hasRounds={true} />);
      
      expect(screen.getByText('Hide ✕')).toBeInTheDocument();
    });

    it('does not show hide button when hasRounds is false', () => {
      render(<PlayerManagement {...defaultProps} hasRounds={false} />);
      
      expect(screen.queryByText('Hide ✕')).not.toBeInTheDocument();
    });
  });

  describe('when showPlayerManagement is false', () => {
    it('shows edit players button when hasRounds is true', () => {
      render(<PlayerManagement {...defaultProps} showPlayerManagement={false} hasRounds={true} />);
      
      expect(screen.getByText('Edit Players')).toBeInTheDocument();
      expect(screen.queryByText('Players')).not.toBeInTheDocument();
    });

    it('renders nothing when hasRounds is false', () => {
      const { container } = render(
        <PlayerManagement {...defaultProps} showPlayerManagement={false} hasRounds={false} />
      );
      
      expect(container.firstChild).toBeNull();
    });
  });

  describe('adding players', () => {
    it('calls onAddPlayer when add button is clicked with valid name', async () => {
      const user = userEvent.setup();
      render(<PlayerManagement {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Player name');
      const addButton = screen.getByText('Add');
      
      await user.type(input, 'Charlie');
      await user.click(addButton);
      
      expect(defaultProps.onAddPlayer).toHaveBeenCalledWith('Charlie');
    });

    it('calls onAddPlayer when Enter is pressed in input', async () => {
      const user = userEvent.setup();
      render(<PlayerManagement {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Player name');
      
      await user.type(input, 'Charlie');
      await user.keyboard('{Enter}');
      
      expect(defaultProps.onAddPlayer).toHaveBeenCalledWith('Charlie');
    });

    it('trims whitespace from player name', async () => {
      const user = userEvent.setup();
      render(<PlayerManagement {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Player name');
      const addButton = screen.getByText('Add');
      
      await user.type(input, '  Charlie  ');
      await user.click(addButton);
      
      expect(defaultProps.onAddPlayer).toHaveBeenCalledWith('Charlie');
    });

    it('does not call onAddPlayer for empty names', async () => {
      const user = userEvent.setup();
      render(<PlayerManagement {...defaultProps} />);
      
      const addButton = screen.getByText('Add');
      
      await user.click(addButton);
      
      expect(defaultProps.onAddPlayer).not.toHaveBeenCalled();
    });

    it('does not call onAddPlayer for whitespace-only names', async () => {
      const user = userEvent.setup();
      render(<PlayerManagement {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Player name');
      const addButton = screen.getByText('Add');
      
      await user.type(input, '   ');
      await user.click(addButton);
      
      expect(defaultProps.onAddPlayer).not.toHaveBeenCalled();
    });
  });

  describe('removing players', () => {
    it('calls onRemovePlayer when remove button is clicked', async () => {
      const user = userEvent.setup();
      render(<PlayerManagement {...defaultProps} />);
      
      const removeButtons = screen.getAllByText('×');
      await user.click(removeButtons[0]);
      
      expect(defaultProps.onRemovePlayer).toHaveBeenCalledWith('1');
    });
  });

  describe('editing players', () => {
    it('enters edit mode when player name is clicked', async () => {
      const user = userEvent.setup();
      render(<PlayerManagement {...defaultProps} />);
      
      await user.click(screen.getByText('Alice'));
      
      expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
      expect(screen.getByText('✓')).toBeInTheDocument();
      expect(screen.getByText('✕')).toBeInTheDocument();
    });

    it('saves player name when checkmark is clicked', async () => {
      const user = userEvent.setup();
      render(<PlayerManagement {...defaultProps} />);
      
      await user.click(screen.getByText('Alice'));
      const input = screen.getByDisplayValue('Alice');
      await user.clear(input);
      await user.type(input, 'Alice Updated');
      
      await user.click(screen.getByText('✓'));
      
      expect(defaultProps.onUpdatePlayer).toHaveBeenCalledWith('1', 'Alice Updated');
    });

    it('saves player name when Enter is pressed', async () => {
      const user = userEvent.setup();
      render(<PlayerManagement {...defaultProps} />);
      
      await user.click(screen.getByText('Alice'));
      const input = screen.getByDisplayValue('Alice');
      await user.clear(input);
      await user.type(input, 'Alice Updated');
      await user.keyboard('{Enter}');
      
      expect(defaultProps.onUpdatePlayer).toHaveBeenCalledWith('1', 'Alice Updated');
    });

    it('cancels edit when X is clicked', async () => {
      const user = userEvent.setup();
      render(<PlayerManagement {...defaultProps} />);
      
      await user.click(screen.getByText('Alice'));
      const input = screen.getByDisplayValue('Alice');
      await user.clear(input);
      await user.type(input, 'Something else');
      
      await user.click(screen.getByText('✕'));
      
      expect(defaultProps.onUpdatePlayer).not.toHaveBeenCalled();
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('trims whitespace when saving player name', async () => {
      const user = userEvent.setup();
      render(<PlayerManagement {...defaultProps} />);
      
      await user.click(screen.getByText('Alice'));
      const input = screen.getByDisplayValue('Alice');
      await user.clear(input);
      await user.type(input, '  Alice Updated  ');
      
      await user.click(screen.getByText('✓'));
      
      expect(defaultProps.onUpdatePlayer).toHaveBeenCalledWith('1', 'Alice Updated');
    });

    it('does not save empty player names', async () => {
      const user = userEvent.setup();
      render(<PlayerManagement {...defaultProps} />);
      
      await user.click(screen.getByText('Alice'));
      const input = screen.getByDisplayValue('Alice');
      await user.clear(input);
      
      await user.click(screen.getByText('✓'));
      
      expect(defaultProps.onUpdatePlayer).not.toHaveBeenCalled();
    });
  });

  describe('visibility toggle', () => {
    it('calls onToggleVisibility when hide button is clicked', async () => {
      const user = userEvent.setup();
      render(<PlayerManagement {...defaultProps} hasRounds={true} />);
      
      await user.click(screen.getByText('Hide ✕'));
      
      expect(defaultProps.onToggleVisibility).toHaveBeenCalled();
    });

    it('calls onToggleVisibility when edit players button is clicked', async () => {
      const user = userEvent.setup();
      render(<PlayerManagement {...defaultProps} showPlayerManagement={false} hasRounds={true} />);
      
      await user.click(screen.getByText('Edit Players'));
      
      expect(defaultProps.onToggleVisibility).toHaveBeenCalled();
    });
  });
});