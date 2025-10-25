import { render, screen } from '@testing-library/react';
import ScoreGraph from '../ScoreGraph';
import { Player, Round } from '../types';

const mockPlayers: Player[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' }
];

const mockRounds: Round[] = [
  {
    roundNumber: 1,
    scores: [
      { playerId: '1', score: 30, isWinner: false },
      { playerId: '2', score: 45, isWinner: true }
    ]
  },
  {
    roundNumber: 2,
    scores: [
      { playerId: '1', score: 25, isWinner: true },
      { playerId: '2', score: 20, isWinner: false }
    ]
  },
  {
    roundNumber: 3,
    scores: [
      { playerId: '1', score: 35, isWinner: false },
      { playerId: '2', score: 30, isWinner: true }
    ]
  }
];

describe('ScoreGraph', () => {
  it('renders graph title', () => {
    render(<ScoreGraph players={mockPlayers} rounds={mockRounds} />);
    expect(screen.getByText('Score Progression')).toBeInTheDocument();
  });

  it('renders legend with player names', () => {
    render(<ScoreGraph players={mockPlayers} rounds={mockRounds} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders SVG element', () => {
    const { container } = render(<ScoreGraph players={mockPlayers} rounds={mockRounds} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders round labels', () => {
    render(<ScoreGraph players={mockPlayers} rounds={mockRounds} />);
    expect(screen.getByText('R1')).toBeInTheDocument();
    expect(screen.getByText('R2')).toBeInTheDocument();
    expect(screen.getByText('R3')).toBeInTheDocument();
  });

  it('renders nothing when no players', () => {
    const { container } = render(<ScoreGraph players={[]} rounds={mockRounds} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when no rounds', () => {
    const { container } = render(<ScoreGraph players={mockPlayers} rounds={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders grid lines', () => {
    const { container } = render(<ScoreGraph players={mockPlayers} rounds={mockRounds} />);
    const lines = container.querySelectorAll('line');
    // Should have horizontal grid lines
    expect(lines.length).toBeGreaterThan(0);
  });

  it('renders paths for each player', () => {
    const { container } = render(<ScoreGraph players={mockPlayers} rounds={mockRounds} />);
    const paths = container.querySelectorAll('path');
    // Should have one path per player
    expect(paths.length).toBe(mockPlayers.length);
  });

  it('renders data points as circles', () => {
    const { container } = render(<ScoreGraph players={mockPlayers} rounds={mockRounds} />);
    const circles = container.querySelectorAll('circle');
    // Should have one circle per player per round
    expect(circles.length).toBe(mockPlayers.length * mockRounds.length);
  });

  it('handles single player correctly', () => {
    const singlePlayer = [mockPlayers[0]];
    render(<ScoreGraph players={singlePlayer} rounds={mockRounds} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('handles single round correctly', () => {
    const singleRound = [mockRounds[0]];
    render(<ScoreGraph players={mockPlayers} rounds={singleRound} />);
    expect(screen.getByText('R1')).toBeInTheDocument();
    expect(screen.queryByText('R2')).not.toBeInTheDocument();
  });

  it('renders with proper SVG dimensions', () => {
    const { container } = render(<ScoreGraph players={mockPlayers} rounds={mockRounds} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '600');
    expect(svg).toHaveAttribute('height', '300');
  });
});
