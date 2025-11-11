import { rotateToRandomStart, getCurrentTurnPlayer } from '../playerOrder';

describe('rotateToRandomStart', () => {
  it('returns array with same length', () => {
    const input = ['a', 'b', 'c', 'd'];
    const result = rotateToRandomStart(input);
    expect(result).toHaveLength(input.length);
  });

  it('contains all original elements', () => {
    const input = ['a', 'b', 'c', 'd'];
    const result = rotateToRandomStart(input);
    expect(result.sort()).toEqual(input.sort());
  });

  it('maintains circular order', () => {
    // Run multiple times to test different rotations
    const input = ['a', 'b', 'c', 'd'];

    for (let i = 0; i < 20; i++) {
      const result = rotateToRandomStart(input);

      // Find where 'a' is in the result
      const aIndex = result.indexOf('a');

      // Check that elements follow in circular order
      expect(result[(aIndex + 1) % 4]).toBe('b');
      expect(result[(aIndex + 2) % 4]).toBe('c');
      expect(result[(aIndex + 3) % 4]).toBe('d');
    }
  });

  it('does not mutate original array', () => {
    const input = ['a', 'b', 'c', 'd'];
    const original = [...input];
    rotateToRandomStart(input);
    expect(input).toEqual(original);
  });

  it('handles empty array', () => {
    const result = rotateToRandomStart([]);
    expect(result).toEqual([]);
  });

  it('handles single element', () => {
    const result = rotateToRandomStart(['a']);
    expect(result).toEqual(['a']);
  });

  it('produces different starting positions (probabilistic test)', () => {
    // Run rotation 100 times and check that we get different starting positions
    const input = ['a', 'b', 'c', 'd', 'e'];
    const results = new Set();

    for (let i = 0; i < 100; i++) {
      const rotated = rotateToRandomStart(input);
      results.add(rotated.join(','));
    }

    // With 5 elements, we should get multiple different rotations (up to 5 possible)
    expect(results.size).toBeGreaterThan(1);
  });

  it('all possible rotations are valid', () => {
    const input = ['a', 'b', 'c', 'd'];
    const validRotations = [
      ['a', 'b', 'c', 'd'],
      ['b', 'c', 'd', 'a'],
      ['c', 'd', 'a', 'b'],
      ['d', 'a', 'b', 'c']
    ];

    // Run multiple times to increase chance of hitting all rotations
    for (let i = 0; i < 20; i++) {
      const result = rotateToRandomStart(input);
      const resultString = result.join(',');
      const isValid = validRotations.some(rotation => rotation.join(',') === resultString);
      expect(isValid).toBe(true);
    }
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

  it('handles round 11 correctly', () => {
    // (11 - 1) % 3 = 10 % 3 = 1, so should be player2 (index 1)
    expect(getCurrentTurnPlayer(playerOrder, 11)).toBe('player2');
  });

  it('returns null for empty player order', () => {
    expect(getCurrentTurnPlayer([], 1)).toBeNull();
  });

  it('works with single player', () => {
    expect(getCurrentTurnPlayer(['player1'], 1)).toBe('player1');
    expect(getCurrentTurnPlayer(['player1'], 5)).toBe('player1');
    expect(getCurrentTurnPlayer(['player1'], 11)).toBe('player1');
  });

  it('works with two players', () => {
    const twoPlayers = ['player1', 'player2'];
    expect(getCurrentTurnPlayer(twoPlayers, 1)).toBe('player1');
    expect(getCurrentTurnPlayer(twoPlayers, 2)).toBe('player2');
    expect(getCurrentTurnPlayer(twoPlayers, 3)).toBe('player1');
    expect(getCurrentTurnPlayer(twoPlayers, 4)).toBe('player2');
  });
});
