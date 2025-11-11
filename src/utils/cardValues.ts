/**
 * Maps round numbers to card values for Five Crowns
 * Standard game: 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K (11 rounds)
 */
export function getRoundCardValue(roundNumber: number): string {
  const cardMapping: Record<number, string> = {
    1: '3',
    2: '4',
    3: '5',
    4: '6',
    5: '7',
    6: '8',
    7: '9',
    8: '10',
    9: 'J',
    10: 'Q',
    11: 'K'
  };

  return cardMapping[roundNumber] || roundNumber.toString();
}
