import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameComplete from '../GameComplete';
import { Player, Round, PlayerRanking } from '../types';

const mockPlayers: Player[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
  { id: '4', name: 'Diana' }
];

const mockRounds: Round[] = [
  {
    roundNumber: 1,
    scores: [
      { playerId: '1', score: 30, isWinner: false },
      { playerId: '2', score: 40, isWinner: true },
      { playerId: '3', score: 50, isWinner: false },
      { playerId: '4', score: 60, isWinner: false }
    ]
  },
  {
    roundNumber: 2,
    scores: [
      { playerId: '1', score: 55, isWinner: true },
      { playerId: '2', score: 80, isWinner: false },
      { playerId: '3', score: 100, isWinner: false },
      { playerId: '4', score: 140, isWinner: false }
    ]
  }
];

const mockPlayerRankings: PlayerRanking[] = [
  { id: '1', name: 'Alice', totalScore: 85, wins: 5 },
  { id: '2', name: 'Bob', totalScore: 120, wins: 3 },
  { id: '3', name: 'Charlie', totalScore: 150, wins: 2 },
  { id: '4', name: 'Diana', totalScore: 200, wins: 1 }
];

const winner = mockPlayerRankings[0];

const defaultProps = {
  winner,
  playerRankings: mockPlayerRankings,
  players: mockPlayers,
  rounds: mockRounds,
  onStartNewGame: jest.fn()
};

describe('GameComplete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders game complete message', () => {
    render(<GameComplete {...defaultProps} />);
    
    expect(screen.getByText('🎉 Game Complete! 🎉')).toBeInTheDocument();
  });

  it('displays winner information correctly', () => {
    render(<GameComplete {...defaultProps} />);
    
    expect(screen.getByText('🏆 Congratulations Alice! 🏆')).toBeInTheDocument();
    expect(screen.getByText('You won Five Crowns with a final score of 85 points!')).toBeInTheDocument();
    expect(screen.getByText('Rounds won: 5 out of 13')).toBeInTheDocument();
  });

  it('renders final rankings section', () => {
    render(<GameComplete {...defaultProps} />);
    
    expect(screen.getByText('Final Rankings')).toBeInTheDocument();
  });

  it('displays all players in ranking order', () => {
    render(<GameComplete {...defaultProps} />);

    // Players appear in both rankings and graph legend
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bob').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Charlie').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Diana').length).toBeGreaterThan(0);
  });

  it('displays correct crowns for top 3 players', () => {
    render(<GameComplete {...defaultProps} />);

    const rankings = screen.getByText('Final Rankings').closest('div');
    expect(rankings).toHaveTextContent('👑👑👑');
    expect(rankings).toHaveTextContent('👑👑');
    expect(rankings).toHaveTextContent('👑');
    expect(rankings).toHaveTextContent('4.');
  });

  it('displays player scores and wins correctly', () => {
    render(<GameComplete {...defaultProps} />);
    
    expect(screen.getByText('85 points')).toBeInTheDocument();
    expect(screen.getByText('5 rounds won')).toBeInTheDocument();
    expect(screen.getByText('120 points')).toBeInTheDocument();
    expect(screen.getByText('3 rounds won')).toBeInTheDocument();
  });

  it('applies correct styling to winner (1st place)', () => {
    render(<GameComplete {...defaultProps} />);

    // Get the Alice element in the rankings section (not the legend)
    const aliceElements = screen.getAllByText('Alice');
    const aliceRow = aliceElements[0].closest('div')?.parentElement;
    expect(aliceRow).toHaveClass('bg-yellow-100', 'border-2', 'border-yellow-400');
  });

  it('applies correct styling to second place', () => {
    render(<GameComplete {...defaultProps} />);

    const bobElements = screen.getAllByText('Bob');
    const bobRow = bobElements[0].closest('div')?.parentElement;
    expect(bobRow).toHaveClass('bg-gray-100');
    expect(bobRow).not.toHaveClass('bg-yellow-100');
  });

  it('applies correct styling to third place', () => {
    render(<GameComplete {...defaultProps} />);

    const charlieElements = screen.getAllByText('Charlie');
    const charlieRow = charlieElements[0].closest('div')?.parentElement;
    expect(charlieRow).toHaveClass('bg-orange-100');
  });

  it('applies correct styling to fourth place and below', () => {
    render(<GameComplete {...defaultProps} />);

    const dianaElements = screen.getAllByText('Diana');
    const dianaRow = dianaElements[0].closest('div')?.parentElement;
    expect(dianaRow).toHaveClass('bg-gray-50');
  });

  it('renders start new game button', () => {
    render(<GameComplete {...defaultProps} />);
    
    expect(screen.getByText('Start New Game')).toBeInTheDocument();
  });

  it('calls onStartNewGame when button is clicked', async () => {
    const user = userEvent.setup();
    render(<GameComplete {...defaultProps} />);
    
    await user.click(screen.getByText('Start New Game'));
    
    expect(defaultProps.onStartNewGame).toHaveBeenCalledTimes(1);
  });

  it('handles single player game', () => {
    const singlePlayerRankings = [mockPlayerRankings[0]];
    const singlePlayer = [mockPlayers[0]];
    const singlePlayerProps = {
      ...defaultProps,
      playerRankings: singlePlayerRankings,
      players: singlePlayer
    };

    render(<GameComplete {...singlePlayerProps} />);

    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0);
    expect(screen.getByText('👑👑👑')).toBeInTheDocument();
    expect(screen.queryByText('👑👑')).not.toBeInTheDocument();
  });

  it('displays rankings with proper numbering for ties', () => {
    const tiedRankings: PlayerRanking[] = [
      { id: '1', name: 'Alice', totalScore: 100, wins: 3 },
      { id: '2', name: 'Bob', totalScore: 100, wins: 3 },
      { id: '3', name: 'Charlie', totalScore: 150, wins: 2 }
    ];

    const tiedPlayers: Player[] = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
      { id: '3', name: 'Charlie' }
    ];

    const tiedProps = {
      winner: tiedRankings[0],
      playerRankings: tiedRankings,
      players: tiedPlayers,
      rounds: mockRounds.slice(0, 2),
      onStartNewGame: jest.fn()
    };

    render(<GameComplete {...tiedProps} />);

    expect(screen.getByText('👑👑👑')).toBeInTheDocument();
    expect(screen.getByText('👑👑')).toBeInTheDocument();
    expect(screen.getByText('👑')).toBeInTheDocument();
  });
});