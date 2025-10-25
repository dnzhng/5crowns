import { shuffleArray, getCurrentTurnPlayer } from '../playerOrder';

describe('shuffleArray', () => {
  it('returns array with same length', () => {
    const input = ['a', 'b', 'c', 'd'];
    const result = shuffleArray(input);
    expect(result).toHaveLength(input.length);
  });

  it('contains all original elements', () => {
    const input = ['a', 'b', 'c', 'd'];
    const result = shuffleArray(input);
    expect(result.sort()).toEqual(input.sort());
  });

  it('does not mutate original array', () => {
    const input = ['a', 'b', 'c', 'd'];
    const original = [...input];
    shuffleArray(input);
    expect(input).toEqual(original);
  });

  it('handles empty array', () => {
    const result = shuffleArray([]);
    expect(result).toEqual([]);
  });

  it('handles single element', () => {
    const result = shuffleArray(['a']);
    expect(result).toEqual(['a']);
  });

  it('produces different orderings (probabilistic test)', () => {
    // Run shuffle 100 times and check that we get at least one different ordering
    const input = ['a', 'b', 'c', 'd', 'e'];
    const results = new Set();

    for (let i = 0; i < 100; i++) {
      const shuffled = shuffleArray(input);
      results.add(shuffled.join(','));
    }

    // With 5 elements, we should get multiple different orderings
    expect(results.size).toBeGreaterThan(1);
  });
});

describe('getCurrentTurnPlayer', () => {
  const playerOrder = ['player1', 'player2', 'player3'];

  it('returns first player for round 1', () => {
    expect(getCurrentTurnPlayer(playerOrder, 1)).toBe('player1');
  });

  it('returns second player for round 2', () => {
    expect(getCurrentTurnPlayer(playerOrder, 2)).toBe('player2');
  });

  it('returns third player for round 3', () => {
    expect(getCurrentTurnPlayer(playerOrder, 3)).toBe('player3');
  });

  it('wraps around to first player for round 4', () => {
    expect(getCurrentTurnPlayer(playerOrder, 4)).toBe('player1');
  });

  it('wraps around correctly for round 5', () => {
    expect(getCurrentTurnPlayer(playerOrder, 5)).toBe('player2');
  });

  it('handles round 13 correctly', () => {
    // (13 - 1) % 3 = 12 % 3 = 0, so should be player1 (index 0)
    expect(getCurrentTurnPlayer(playerOrder, 13)).toBe('player1');
  });

  it('returns null for empty player order', () => {
    expect(getCurrentTurnPlayer([], 1)).toBeNull();
  });

  it('works with single player', () => {
    expect(getCurrentTurnPlayer(['player1'], 1)).toBe('player1');
    expect(getCurrentTurnPlayer(['player1'], 5)).toBe('player1');
    expect(getCurrentTurnPlayer(['player1'], 13)).toBe('player1');
  });

  it('works with two players', () => {
    const twoPlayers = ['player1', 'player2'];
    expect(getCurrentTurnPlayer(twoPlayers, 1)).toBe('player1');
    expect(getCurrentTurnPlayer(twoPlayers, 2)).toBe('player2');
    expect(getCurrentTurnPlayer(twoPlayers, 3)).toBe('player1');
    expect(getCurrentTurnPlayer(twoPlayers, 4)).toBe('player2');
  });
});
