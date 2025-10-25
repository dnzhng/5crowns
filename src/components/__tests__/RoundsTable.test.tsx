import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoundsTable from '../RoundsTable';
import { Player, Round } from '../types';

const mockPlayers: Player[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' }
];

const mockRounds: Round[] = [
  {
    roundNumber: 1,
    scores: [
      { playerId: '1', score: 30, isWinner: true },
      { playerId: '2', score: 45, isWinner: false }
    ]
  },
  {
    roundNumber: 2,
    scores: [
      { playerId: '1', score: 25, isWinner: false },
      { playerId: '2', score: 20, isWinner: true }
    ]
  }
];

const defaultProps = {
  players: mockPlayers,
  rounds: mockRounds,
  onUpdateRoundScore: jest.fn(),
  onToggleRoundWinner: jest.fn(),
  onAddRound: jest.fn()
};

describe('RoundsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when no rounds exist', () => {
    it('renders add first round button', () => {
      render(
        <RoundsTable
          {...defaultProps}
          rounds={[]}
        />
      );

      // First round (round 1) maps to card value "3"
      expect(screen.getByText('+ Add Round (3)')).toBeInTheDocument();
    });

    it('calls onAddRound when add round button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <RoundsTable
          {...defaultProps}
          rounds={[]}
        />
      );

      // First round (round 1) maps to card value "3"
      await user.click(screen.getByText('+ Add Round (3)'));

      expect(defaultProps.onAddRound).toHaveBeenCalledTimes(1);
    });
  });

  describe('when rounds exist', () => {
    it('renders rounds table with header', () => {
      render(<RoundsTable {...defaultProps} />);
      
      expect(screen.getByText('Rounds')).toBeInTheDocument();
      expect(screen.getByText('Round')).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('displays card values instead of round numbers', () => {
      render(<RoundsTable {...defaultProps} />);

      // Round 1 should show card value "3"
      expect(screen.getByText('3')).toBeInTheDocument();
      // Round 2 should show card value "4"
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('displays player scores in input fields', () => {
      render(<RoundsTable {...defaultProps} />);
      
      const scoreInputs = screen.getAllByDisplayValue('30');
      expect(scoreInputs).toHaveLength(1);
      
      expect(screen.getByDisplayValue('45')).toBeInTheDocument();
      expect(screen.getByDisplayValue('25')).toBeInTheDocument();
      expect(screen.getByDisplayValue('20')).toBeInTheDocument();
    });

    it('shows winner crown for winning players', () => {
      render(<RoundsTable {...defaultProps} />);
      
      const crownButtons = screen.getAllByText('👑');
      expect(crownButtons).toHaveLength(2); // Alice won round 1, Bob won round 2
    });

    it('shows empty circle for non-winning players', () => {
      render(<RoundsTable {...defaultProps} />);
      
      const circleButtons = screen.getAllByText('○');
      expect(circleButtons).toHaveLength(2); // Bob in round 1, Alice in round 2
    });

    it('calls onUpdateRoundScore when score input changes', async () => {
      render(<RoundsTable {...defaultProps} />);
      
      const scoreInput = screen.getByDisplayValue('30') as HTMLInputElement;
      
      // Simulate direct input change
      fireEvent.change(scoreInput, { target: { value: '35' } });
      
      expect(defaultProps.onUpdateRoundScore).toHaveBeenCalledWith(0, '1', 35);
    });

    it('handles non-numeric input gracefully', async () => {
      const user = userEvent.setup();
      render(<RoundsTable {...defaultProps} />);

      const scoreInput = screen.getByDisplayValue('30');
      await user.clear(scoreInput);
      await user.type(scoreInput, 'abc');

      expect(defaultProps.onUpdateRoundScore).toHaveBeenCalledWith(0, '1', 0);
    });

    it('clears input value on focus when value is 0', async () => {
      const mockRoundsWithZero: Round[] = [
        {
          roundNumber: 1,
          scores: [
            { playerId: '1', score: 0, isWinner: false },
            { playerId: '2', score: 0, isWinner: false }
          ]
        }
      ];

      const user = userEvent.setup();
      render(<RoundsTable {...defaultProps} rounds={mockRoundsWithZero} />);

      const scoreInputs = screen.getAllByDisplayValue('0');

      // Focus on the input
      await user.click(scoreInputs[0]);

      // After focus, the input should be cleared (empty string)
      expect(scoreInputs[0]).toHaveValue(null);
    });

    it('does not clear input value on focus when value is not 0', async () => {
      const user = userEvent.setup();
      render(<RoundsTable {...defaultProps} />);

      const scoreInput = screen.getByDisplayValue('30');

      // Focus on the input
      await user.click(scoreInput);

      // Value should remain unchanged
      expect(scoreInput).toHaveValue(30);
    });

    it('calls onToggleRoundWinner when winner button is clicked', async () => {
      const user = userEvent.setup();
      render(<RoundsTable {...defaultProps} />);
      
      const winnerButton = screen.getAllByText('👑')[0];
      await user.click(winnerButton);
      
      expect(defaultProps.onToggleRoundWinner).toHaveBeenCalledWith(0, '1');
    });

    it('calls onToggleRoundWinner when non-winner button is clicked', async () => {
      const user = userEvent.setup();
      render(<RoundsTable {...defaultProps} />);
      
      const nonWinnerButton = screen.getAllByText('○')[0];
      await user.click(nonWinnerButton);
      
      expect(defaultProps.onToggleRoundWinner).toHaveBeenCalledWith(0, '2');
    });

    it('shows add next round button when less than 13 rounds', () => {
      render(<RoundsTable {...defaultProps} />);

      // With 2 rounds, next round is 3, which maps to card value "5"
      expect(screen.getByText('+ Add Round (5)')).toBeInTheDocument();
    });

    it('does not show add round button when 13 rounds exist', () => {
      const thirteenRounds = Array.from({ length: 13 }, (_, i) => ({
        roundNumber: i + 1,
        scores: [
          { playerId: '1', score: 0, isWinner: false },
          { playerId: '2', score: 0, isWinner: false }
        ]
      }));
      
      render(
        <RoundsTable
          {...defaultProps}
          rounds={thirteenRounds}
        />
      );
      
      expect(screen.queryByText(/Add Round/)).not.toBeInTheDocument();
    });

    it('calls onAddRound when add round button is clicked', async () => {
      const user = userEvent.setup();
      render(<RoundsTable {...defaultProps} />);

      await user.click(screen.getByText('+ Add Round (5)'));

      expect(defaultProps.onAddRound).toHaveBeenCalledTimes(1);
    });
  });

  describe('with no players', () => {
    it('renders table with only round column when no players', () => {
      render(
        <RoundsTable
          {...defaultProps}
          players={[]}
        />
      );
      
      expect(screen.getByText('Round')).toBeInTheDocument();
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
      expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    });
  });

  describe('with missing player scores', () => {
    it('handles missing player scores gracefully', () => {
      const incompleteRounds: Round[] = [
        {
          roundNumber: 1,
          scores: [
            { playerId: '1', score: 30, isWinner: true }
            // Missing player 2 score
          ]
        }
      ];
      
      render(
        <RoundsTable
          {...defaultProps}
          rounds={incompleteRounds}
        />
      );
      
      expect(screen.getByDisplayValue('30')).toBeInTheDocument();
      expect(screen.getByDisplayValue('0')).toBeInTheDocument(); // Default for missing score
    });
  });

  describe('accessibility', () => {
    it('has proper table structure', () => {
      render(<RoundsTable {...defaultProps} />);
      
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')).toHaveLength(3); // Round + 2 players
      expect(screen.getAllByRole('row')).toHaveLength(3); // Header + 2 rounds
    });

    it('has accessible form controls', () => {
      render(<RoundsTable {...defaultProps} />);
      
      const scoreInputs = screen.getAllByRole('spinbutton');
      expect(scoreInputs).toHaveLength(4); // 2 players × 2 rounds
      
      const winnerButtons = screen.getAllByRole('button');
      expect(winnerButtons.length).toBeGreaterThan(0);
    });
  });
});