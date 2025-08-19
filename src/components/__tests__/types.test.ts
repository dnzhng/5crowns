import { Player, Round, RoundScore, PlayerRanking } from '../types';

describe('Types', () => {
  describe('Player interface', () => {
    it('should have correct structure', () => {
      const player: Player = {
        id: '1',
        name: 'John'
      };

      expect(player).toHaveProperty('id');
      expect(player).toHaveProperty('name');
      expect(typeof player.id).toBe('string');
      expect(typeof player.name).toBe('string');
    });
  });

  describe('RoundScore interface', () => {
    it('should have correct structure', () => {
      const roundScore: RoundScore = {
        playerId: '1',
        score: 50,
        isWinner: true
      };

      expect(roundScore).toHaveProperty('playerId');
      expect(roundScore).toHaveProperty('score');
      expect(roundScore).toHaveProperty('isWinner');
      expect(typeof roundScore.playerId).toBe('string');
      expect(typeof roundScore.score).toBe('number');
      expect(typeof roundScore.isWinner).toBe('boolean');
    });
  });

  describe('Round interface', () => {
    it('should have correct structure', () => {
      const round: Round = {
        roundNumber: 1,
        scores: [
          { playerId: '1', score: 30, isWinner: true },
          { playerId: '2', score: 45, isWinner: false }
        ]
      };

      expect(round).toHaveProperty('roundNumber');
      expect(round).toHaveProperty('scores');
      expect(typeof round.roundNumber).toBe('number');
      expect(Array.isArray(round.scores)).toBe(true);
      expect(round.scores).toHaveLength(2);
    });
  });

  describe('PlayerRanking interface', () => {
    it('should extend Player with additional fields', () => {
      const playerRanking: PlayerRanking = {
        id: '1',
        name: 'John',
        totalScore: 150,
        wins: 3
      };

      expect(playerRanking).toHaveProperty('id');
      expect(playerRanking).toHaveProperty('name');
      expect(playerRanking).toHaveProperty('totalScore');
      expect(playerRanking).toHaveProperty('wins');
      expect(typeof playerRanking.totalScore).toBe('number');
      expect(typeof playerRanking.wins).toBe('number');
    });
  });
});