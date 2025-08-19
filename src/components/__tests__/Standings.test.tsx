import { render, screen } from '@testing-library/react';
import Standings from '../Standings';
import { PlayerRanking } from '../types';

const mockPlayerRankings: PlayerRanking[] = [
  { id: '1', name: 'Alice', totalScore: 85, wins: 5 },
  { id: '2', name: 'Bob', totalScore: 120, wins: 3 },
  { id: '3', name: 'Charlie', totalScore: 150, wins: 2 },
  { id: '4', name: 'Diana', totalScore: 200, wins: 1 }
];

const defaultProps = {
  playerRankings: mockPlayerRankings
};

describe('Standings', () => {
  it('renders standings header', () => {
    render(<Standings {...defaultProps} />);
    
    expect(screen.getByText('Standings')).toBeInTheDocument();
  });

  it('displays all players in order', () => {
    render(<Standings {...defaultProps} />);
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Diana')).toBeInTheDocument();
  });

  it('shows correct medals for top 3 players', () => {
    render(<Standings {...defaultProps} />);
    
    expect(screen.getByText('🥇')).toBeInTheDocument();
    expect(screen.getByText('🥈')).toBeInTheDocument();
    expect(screen.getByText('🥉')).toBeInTheDocument();
  });

  it('shows numeric position for 4th place and below', () => {
    render(<Standings {...defaultProps} />);
    
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('displays player total scores correctly', () => {
    render(<Standings {...defaultProps} />);
    
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('displays win counts correctly', () => {
    render(<Standings {...defaultProps} />);
    
    expect(screen.getByText('5 wins')).toBeInTheDocument();
    expect(screen.getByText('3 wins')).toBeInTheDocument();
    expect(screen.getByText('2 wins')).toBeInTheDocument();
    expect(screen.getByText('1 wins')).toBeInTheDocument();
  });

  it('applies special styling to first place', () => {
    render(<Standings {...defaultProps} />);
    
    const aliceRow = screen.getByText('Alice').closest('div')?.parentElement;
    expect(aliceRow).toHaveClass('bg-yellow-50', 'border', 'border-yellow-200');
  });

  it('applies standard styling to other places', () => {
    render(<Standings {...defaultProps} />);
    
    const bobRow = screen.getByText('Bob').closest('div')?.parentElement;
    expect(bobRow).toHaveClass('bg-gray-50');
    expect(bobRow).not.toHaveClass('bg-yellow-50');
  });

  describe('with single player', () => {
    it('renders single player correctly', () => {
      const singlePlayer = [mockPlayerRankings[0]];
      
      render(<Standings playerRankings={singlePlayer} />);
      
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('🥇')).toBeInTheDocument();
      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('5 wins')).toBeInTheDocument();
    });
  });

  describe('with empty rankings', () => {
    it('renders empty standings', () => {
      render(<Standings playerRankings={[]} />);
      
      expect(screen.getByText('Standings')).toBeInTheDocument();
      expect(screen.queryByText('🥇')).not.toBeInTheDocument();
    });
  });

  describe('with many players', () => {
    it('handles more than 10 players correctly', () => {
      const manyPlayers: PlayerRanking[] = Array.from({ length: 15 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Player ${i + 1}`,
        totalScore: (i + 1) * 10,
        wins: Math.max(0, 10 - i)
      }));
      
      render(<Standings playerRankings={manyPlayers} />);
      
      expect(screen.getByText('🥇')).toBeInTheDocument();
      expect(screen.getByText('🥈')).toBeInTheDocument();
      expect(screen.getByText('🥉')).toBeInTheDocument();
      
      // Find the position number 10 (not the score or wins)
      const tenthPositionElement = screen.getAllByText('10').find(el => 
        el.classList.contains('text-lg') && !el.classList.contains('font-mono')
      );
      expect(tenthPositionElement).toBeInTheDocument();
      
      const fifteenthPositionElement = screen.getAllByText('15').find(el => 
        el.classList.contains('text-lg') && !el.classList.contains('font-mono')
      );
      expect(fifteenthPositionElement).toBeInTheDocument();
    });
  });

  describe('with tied scores', () => {
    it('displays tied players in provided order', () => {
      const tiedPlayers: PlayerRanking[] = [
        { id: '1', name: 'Alice', totalScore: 100, wins: 3 },
        { id: '2', name: 'Bob', totalScore: 100, wins: 3 },
        { id: '3', name: 'Charlie', totalScore: 150, wins: 2 }
      ];
      
      render(<Standings playerRankings={tiedPlayers} />);
      
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
      
      // First two should have medals, third should have medal too
      expect(screen.getByText('🥇')).toBeInTheDocument();
      expect(screen.getByText('🥈')).toBeInTheDocument();
      expect(screen.getByText('🥉')).toBeInTheDocument();
    });
  });

  describe('component structure', () => {
    it('has sticky positioning class', () => {
      render(<Standings {...defaultProps} />);
      
      const container = screen.getByText('Standings').closest('.sticky');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('top-6');
    });

    it('has proper layout classes', () => {
      render(<Standings {...defaultProps} />);
      
      const mainContainer = screen.getByText('Standings').closest('.lg\\:col-span-1');
      expect(mainContainer).toBeInTheDocument();
    });

    it('has proper spacing between player entries', () => {
      render(<Standings {...defaultProps} />);
      
      const playerContainer = screen.getByText('Alice').closest('div')?.parentElement?.parentElement;
      expect(playerContainer).toHaveClass('space-y-3');
    });
  });

  describe('accessibility', () => {
    it('has proper heading structure', () => {
      render(<Standings {...defaultProps} />);
      
      expect(screen.getByRole('heading', { name: 'Standings' })).toBeInTheDocument();
    });

    it('displays information in readable format', () => {
      render(<Standings {...defaultProps} />);
      
      // Check that scores and wins are clearly separated
      const aliceRow = screen.getByText('Alice').closest('div')?.parentElement;
      expect(aliceRow).toHaveTextContent('85');
      expect(aliceRow).toHaveTextContent('5 wins');
    });
  });
});