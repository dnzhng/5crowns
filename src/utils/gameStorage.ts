import { Player, Round } from '../components/types';

export interface GameState {
  players: Player[];
  rounds: Round[];
  showPlayerManagement: boolean;
  gameStartedAt?: string;
  lastUpdatedAt?: string;
}

const STORAGE_KEY = 'five-crowns-game-state';

export const saveGameState = (gameState: Omit<GameState, 'lastUpdatedAt'>): void => {
  try {
    const stateWithTimestamp: GameState = {
      ...gameState,
      lastUpdatedAt: new Date().toISOString(),
    };
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateWithTimestamp));
  } catch (error) {
    console.warn('Failed to save game state to session storage:', error);
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const gameState = JSON.parse(stored) as GameState;
    
    // Validate the structure
    if (!gameState.players || !Array.isArray(gameState.players)) {
      return null;
    }
    
    if (!gameState.rounds || !Array.isArray(gameState.rounds)) {
      return null;
    }
    
    return gameState;
  } catch (error) {
    console.warn('Failed to load game state from session storage:', error);
    return null;
  }
};

export const clearGameState = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear game state from session storage:', error);
  }
};

export const hasStoredGame = (): boolean => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
};