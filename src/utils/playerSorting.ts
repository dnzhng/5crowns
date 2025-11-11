import { PlayerRanking } from '../components/types';

/**
 * Sorts players by total score (ascending, lower is better in Five Crowns)
 * then by wins (descending, more wins is better for tie-breaking)
 */
export function sortPlayerRankings(players: PlayerRanking[]): PlayerRanking[] {
  return [...players].sort((a, b) => {
    // First, sort by total score (lower is better)
    if (a.totalScore !== b.totalScore) {
      return a.totalScore - b.totalScore;
    }
    // If scores are tied, sort by wins (higher is better)
    return b.wins - a.wins;
  });
}
