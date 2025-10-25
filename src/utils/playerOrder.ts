/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get the player whose turn it is for a given round number
 * @param playerOrder - The ordered list of player IDs
 * @param roundNumber - The current round number (1-indexed)
 * @returns The player ID whose turn it is
 */
export function getCurrentTurnPlayer(playerOrder: string[], roundNumber: number): string | null {
  if (playerOrder.length === 0) return null;
  // Round numbers are 1-indexed, so subtract 1 for array indexing
  const index = (roundNumber - 1) % playerOrder.length;
  return playerOrder[index];
}
