import { sortPlayerRankings } from '../playerSorting';
import { PlayerRanking } from '../../components/types';

describe('sortPlayerRankings', () => {
  it('sorts players by total score ascending (lower score is better)', () => {
    const players: PlayerRanking[] = [
      { id: '1', name: 'Alice', totalScore: 150, wins: 2 },
      { id: '2', name: 'Bob', totalScore: 85, wins: 5 },
      { id: '3', name: 'Charlie', totalScore: 120, wins: 3 }
    ];

    const sorted = sortPlayerRankings(players);

    expect(sorted[0].name).toBe('Bob');
    expect(sorted[0].totalScore).toBe(85);
    expect(sorted[1].name).toBe('Charlie');
    expect(sorted[1].totalScore).toBe(120);
    expect(sorted[2].name).toBe('Alice');
    expect(sorted[2].totalScore).toBe(150);
  });

  it('breaks ties by wins descending (more wins is better)', () => {
    const players: PlayerRanking[] = [
      { id: '1', name: 'Alice', totalScore: 100, wins: 2 },
      { id: '2', name: 'Bob', totalScore: 100, wins: 5 },
      { id: '3', name: 'Charlie', totalScore: 100, wins: 3 }
    ];

    const sorted = sortPlayerRankings(players);

    // All have same score (100), so should be sorted by wins (descending)
    expect(sorted[0].name).toBe('Bob');
    expect(sorted[0].wins).toBe(5);
    expect(sorted[1].name).toBe('Charlie');
    expect(sorted[1].wins).toBe(3);
    expect(sorted[2].name).toBe('Alice');
    expect(sorted[2].wins).toBe(2);
  });

  it('handles mixed scenarios correctly', () => {
    const players: PlayerRanking[] = [
      { id: '1', name: 'Alice', totalScore: 150, wins: 4 },
      { id: '2', name: 'Bob', totalScore: 100, wins: 2 },
      { id: '3', name: 'Charlie', totalScore: 100, wins: 5 },
      { id: '4', name: 'Diana', totalScore: 200, wins: 1 }
    ];

    const sorted = sortPlayerRankings(players);

    // Charlie: 100 points, 5 wins (best)
    expect(sorted[0].name).toBe('Charlie');
    // Bob: 100 points, 2 wins (second, same score as Charlie but fewer wins)
    expect(sorted[1].name).toBe('Bob');
    // Alice: 150 points, 4 wins (third)
    expect(sorted[2].name).toBe('Alice');
    // Diana: 200 points, 1 win (last)
    expect(sorted[3].name).toBe('Diana');
  });

  it('returns empty array when given empty array', () => {
    const sorted = sortPlayerRankings([]);
    expect(sorted).toEqual([]);
  });

  it('handles single player correctly', () => {
    const players: PlayerRanking[] = [
      { id: '1', name: 'Alice', totalScore: 100, wins: 3 }
    ];

    const sorted = sortPlayerRankings(players);

    expect(sorted).toHaveLength(1);
    expect(sorted[0].name).toBe('Alice');
  });

  it('does not mutate the original array', () => {
    const players: PlayerRanking[] = [
      { id: '1', name: 'Alice', totalScore: 150, wins: 2 },
      { id: '2', name: 'Bob', totalScore: 85, wins: 5 }
    ];

    const original = [...players];
    sortPlayerRankings(players);

    expect(players).toEqual(original);
  });

  it('handles players with 0 wins correctly', () => {
    const players: PlayerRanking[] = [
      { id: '1', name: 'Alice', totalScore: 100, wins: 0 },
      { id: '2', name: 'Bob', totalScore: 100, wins: 3 },
      { id: '3', name: 'Charlie', totalScore: 100, wins: 1 }
    ];

    const sorted = sortPlayerRankings(players);

    expect(sorted[0].name).toBe('Bob');
    expect(sorted[0].wins).toBe(3);
    expect(sorted[1].name).toBe('Charlie');
    expect(sorted[1].wins).toBe(1);
    expect(sorted[2].name).toBe('Alice');
    expect(sorted[2].wins).toBe(0);
  });
});
