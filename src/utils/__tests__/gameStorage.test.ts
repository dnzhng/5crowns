import { saveGameState, loadGameState, clearGameState, hasStoredGame, GameState } from '../gameStorage';

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
});

describe('gameStorage', () => {
  beforeEach(() => {
    mockSessionStorage.clear();
    jest.clearAllMocks();
  });

  const mockGameState: Omit<GameState, 'lastUpdatedAt'> = {
    players: [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' }
    ],
    rounds: [
      {
        roundNumber: 1,
        scores: [
          { playerId: '1', score: 30, isWinner: true },
          { playerId: '2', score: 45, isWinner: false }
        ]
      }
    ],
    showPlayerManagement: false,
    gameStartedAt: '2024-01-01T00:00:00.000Z'
  };

  describe('saveGameState', () => {
    it('saves game state to session storage', () => {
      saveGameState(mockGameState);

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'five-crowns-game-state',
        expect.stringContaining('"players"')
      );

      const savedData = JSON.parse(mockSessionStorage.setItem.mock.calls[0][1]);
      expect(savedData.players).toEqual(mockGameState.players);
      expect(savedData.rounds).toEqual(mockGameState.rounds);
      expect(savedData.showPlayerManagement).toBe(false);
      expect(savedData.lastUpdatedAt).toBeDefined();
    });

    it('handles storage errors gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      mockSessionStorage.setItem.mockImplementationOnce(() => {
        throw new Error('Storage quota exceeded');
      });

      expect(() => saveGameState(mockGameState)).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to save game state to session storage:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('loadGameState', () => {
    it('loads game state from session storage', () => {
      const stateWithTimestamp: GameState = {
        ...mockGameState,
        lastUpdatedAt: '2024-01-01T12:00:00.000Z'
      };

      mockSessionStorage.setItem('five-crowns-game-state', JSON.stringify(stateWithTimestamp));

      const result = loadGameState();

      expect(result).toEqual(stateWithTimestamp);
    });

    it('returns null when no stored data exists', () => {
      const result = loadGameState();
      expect(result).toBeNull();
    });

    it('returns null when stored data is invalid JSON', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      mockSessionStorage.setItem('five-crowns-game-state', 'invalid json');

      const result = loadGameState();

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to load game state from session storage:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('returns null when stored data has invalid structure - missing players', () => {
      const invalidState = {
        rounds: [],
        showPlayerManagement: true
      };

      mockSessionStorage.setItem('five-crowns-game-state', JSON.stringify(invalidState));

      const result = loadGameState();
      expect(result).toBeNull();
    });

    it('returns null when stored data has invalid structure - missing rounds', () => {
      const invalidState = {
        players: [],
        showPlayerManagement: true
      };

      mockSessionStorage.setItem('five-crowns-game-state', JSON.stringify(invalidState));

      const result = loadGameState();
      expect(result).toBeNull();
    });

    it('returns null when players is not an array', () => {
      const invalidState = {
        players: 'not an array',
        rounds: [],
        showPlayerManagement: true
      };

      mockSessionStorage.setItem('five-crowns-game-state', JSON.stringify(invalidState));

      const result = loadGameState();
      expect(result).toBeNull();
    });

    it('returns null when rounds is not an array', () => {
      const invalidState = {
        players: [],
        rounds: 'not an array',
        showPlayerManagement: true
      };

      mockSessionStorage.setItem('five-crowns-game-state', JSON.stringify(invalidState));

      const result = loadGameState();
      expect(result).toBeNull();
    });

    it('handles storage access errors gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      mockSessionStorage.getItem.mockImplementationOnce(() => {
        throw new Error('Storage access denied');
      });

      const result = loadGameState();

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to load game state from session storage:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('clearGameState', () => {
    it('removes game state from session storage', () => {
      mockSessionStorage.setItem('five-crowns-game-state', JSON.stringify(mockGameState));

      clearGameState();

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('five-crowns-game-state');
    });

    it('handles storage errors gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      mockSessionStorage.removeItem.mockImplementationOnce(() => {
        throw new Error('Storage access denied');
      });

      expect(() => clearGameState()).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to clear game state from session storage:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('hasStoredGame', () => {
    it('returns true when game state exists', () => {
      mockSessionStorage.setItem('five-crowns-game-state', JSON.stringify(mockGameState));

      const result = hasStoredGame();

      expect(result).toBe(true);
    });

    it('returns false when no game state exists', () => {
      const result = hasStoredGame();

      expect(result).toBe(false);
    });

    it('returns false when storage access fails', () => {
      mockSessionStorage.getItem.mockImplementationOnce(() => {
        throw new Error('Storage access denied');
      });

      const result = hasStoredGame();

      expect(result).toBe(false);
    });
  });

  describe('integration scenarios', () => {
    it('can save and load a complete game state', () => {
      saveGameState(mockGameState);
      const loaded = loadGameState();

      expect(loaded).not.toBeNull();
      expect(loaded!.players).toEqual(mockGameState.players);
      expect(loaded!.rounds).toEqual(mockGameState.rounds);
      expect(loaded!.showPlayerManagement).toBe(mockGameState.showPlayerManagement);
      expect(loaded!.gameStartedAt).toBe(mockGameState.gameStartedAt);
      expect(loaded!.lastUpdatedAt).toBeDefined();
    });

    it('handles empty game state correctly', () => {
      const emptyState: Omit<GameState, 'lastUpdatedAt'> = {
        players: [],
        rounds: [],
        showPlayerManagement: true
      };

      saveGameState(emptyState);
      const loaded = loadGameState();

      expect(loaded).not.toBeNull();
      expect(loaded!.players).toEqual([]);
      expect(loaded!.rounds).toEqual([]);
      expect(loaded!.showPlayerManagement).toBe(true);
    });

    it('maintains data integrity through save/load cycle', () => {
      const complexState: Omit<GameState, 'lastUpdatedAt'> = {
        players: [
          { id: '1', name: 'Alice with special chars: éñü' },
          { id: '2', name: 'Bob' },
          { id: '3', name: 'Charlie' }
        ],
        rounds: [
          {
            roundNumber: 1,
            scores: [
              { playerId: '1', score: 0, isWinner: true },
              { playerId: '2', score: 50, isWinner: false },
              { playerId: '3', score: 25, isWinner: false }
            ]
          },
          {
            roundNumber: 2,
            scores: [
              { playerId: '1', score: 30, isWinner: false },
              { playerId: '2', score: 20, isWinner: true },
              { playerId: '3', score: 45, isWinner: false }
            ]
          }
        ],
        showPlayerManagement: false,
        gameStartedAt: '2024-01-01T00:00:00.000Z'
      };

      saveGameState(complexState);
      const loaded = loadGameState();

      expect(loaded).toEqual({
        ...complexState,
        lastUpdatedAt: expect.any(String)
      });
    });
  });
});