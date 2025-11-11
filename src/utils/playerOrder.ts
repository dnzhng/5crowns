/**
 * Rotate an array to start from a random position
 * Maintains the original circular order but randomizes who starts first
 * @param array - The array to rotate
 * @returns A new array rotated to start from a random position
 */
export function rotateToRandomStart<T>(array: T[]): T[] {
  if (array.length === 0) return [];
  const startIndex = Math.floor(Math.random() * array.length);
  return [...array.slice(startIndex), ...array.slice(0, startIndex)];
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
