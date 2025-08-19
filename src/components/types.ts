export interface Player {
  id: string;
  name: string;
}

export interface RoundScore {
  playerId: string;
  score: number;
  isWinner: boolean;
}

export interface Round {
  roundNumber: number;
  scores: RoundScore[];
}

export interface PlayerRanking extends Player {
  totalScore: number;
  wins: number;
}