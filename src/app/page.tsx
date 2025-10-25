'use client';

import { useState, useEffect } from 'react';
import { Player, Round, PlayerRanking } from '../components/types';
import PlayerManagement from '../components/PlayerManagement';
import GameComplete from '../components/GameComplete';
import RoundsTable from '../components/RoundsTable';
import Standings from '../components/Standings';
import { saveGameState, loadGameState, clearGameState } from '../utils/gameStorage';
import { sortPlayerRankings } from '../utils/playerSorting';
import { shuffleArray } from '../utils/playerOrder';

export default function FiveCrownsScorekeeper() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [showPlayerManagement, setShowPlayerManagement] = useState(true);
  const [playerOrder, setPlayerOrder] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load game state from session storage on mount
  useEffect(() => {
    try {
      const savedState = loadGameState();
      if (savedState) {
        setPlayers(savedState.players);
        setRounds(savedState.rounds);
        setShowPlayerManagement(savedState.showPlayerManagement);
        setPlayerOrder(savedState.playerOrder || []);
      }
    } catch (error) {
      console.warn('Failed to load saved game state:', error);
      // Continue with empty state
    }
    setIsLoaded(true);
  }, []);

  // Save game state to session storage whenever state changes
  useEffect(() => {
    if (!isLoaded) return; // Don't save during initial load
    
    saveGameState({
      players,
      rounds,
      showPlayerManagement,
      playerOrder,
    });
  }, [players, rounds, showPlayerManagement, playerOrder, isLoaded]);

  const addPlayer = (name: string) => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      name
    };
    setPlayers([...players, newPlayer]);
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
    setRounds(rounds.map(round => ({
      ...round,
      scores: round.scores.filter(score => score.playerId !== playerId)
    })));
  };

  const updatePlayer = (playerId: string, name: string) => {
    setPlayers(players.map(p => 
      p.id === playerId ? { ...p, name } : p
    ));
  };

  const addRound = () => {
    if (players.length === 0 || rounds.length >= 13) return;

    const newRound: Round = {
      roundNumber: rounds.length + 1,
      scores: players.map(player => ({
        playerId: player.id,
        score: 0,
        isWinner: false
      }))
    };
    setRounds([...rounds, newRound]);

    // Initialize player order when adding the first round
    if (rounds.length === 0) {
      setShowPlayerManagement(false);
      const shuffledOrder = shuffleArray(players.map(p => p.id));
      setPlayerOrder(shuffledOrder);
    }
  };

  const updateRoundScore = (roundIndex: number, playerId: string, score: number) => {
    setRounds(rounds.map((round, index) => 
      index === roundIndex
        ? {
            ...round,
            scores: round.scores.map(s =>
              s.playerId === playerId ? { ...s, score } : s
            )
          }
        : round
    ));
  };

  const toggleRoundWinner = (roundIndex: number, playerId: string) => {
    setRounds((prevRounds) => {
      const updatedRounds = prevRounds.map((round, index) =>
        index === roundIndex
          ? {
              ...round,
              scores: round.scores.map(s =>
                s.playerId === playerId
                  ? { ...s, isWinner: !s.isWinner }
                  : { ...s, isWinner: false } // Only one winner per round
              )
            }
          : round
      );

      // Check if a winner was just selected (not deselected)
      const selectedWinner = updatedRounds[roundIndex].scores.find(
        s => s.playerId === playerId && s.isWinner
      );

      // Auto-create next round if:
      // 1. A winner was selected (not deselected)
      // 2. We're not already at 13 rounds
      // 3. This is the last round (prevents adding multiple rounds)
      if (selectedWinner && updatedRounds.length < 13 && roundIndex === updatedRounds.length - 1) {
        const newRound: Round = {
          roundNumber: updatedRounds.length + 1,
          scores: players.map(player => ({
            playerId: player.id,
            score: 0,
            isWinner: false
          }))
        };
        return [...updatedRounds, newRound];
      }

      return updatedRounds;
    });
  };

  const calculateTotalScore = (playerId: string) => {
    return rounds.reduce((total, round) => {
      const playerScore = round.scores.find(s => s.playerId === playerId);
      return total + (playerScore?.score || 0);
    }, 0);
  };

  const getPlayerRankings = (): PlayerRanking[] => {
    const rankings = players
      .map(player => ({
        ...player,
        totalScore: calculateTotalScore(player.id),
        wins: rounds.filter(round =>
          round.scores.find(s => s.playerId === player.id && s.isWinner)
        ).length
      }));
    return sortPlayerRankings(rankings);
  };

  const isGameComplete = () => rounds.length === 13;
  const getWinner = () => {
    if (!isGameComplete()) return null;
    const rankings = getPlayerRankings();
    return rankings[0];
  };

  const startNewGame = () => {
    setRounds([]);
    setPlayers([]);
    setPlayerOrder([]);
    setShowPlayerManagement(true);
    clearGameState(); // Clear session storage when starting new game
  };

  // Show loading state while loading from session storage
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600">Loading game...</div>
        </div>
      </div>
    );
  }

  if (isGameComplete()) {
    const winner = getWinner();
    if (!winner) return null;
    
    return (
      <GameComplete 
        winner={winner}
        playerRankings={getPlayerRankings()}
        onStartNewGame={startNewGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-light text-gray-900 tracking-wide">
            Five Crowns
          </h1>
          <div className="w-16 h-0.5 bg-gray-900 mx-auto mt-2"></div>
          
          {/* Clear Game Button */}
          {(players.length > 0 || rounds.length > 0) && (
            <button
              onClick={startNewGame}
              className="absolute top-0 right-0 px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors border border-gray-300 rounded-lg hover:border-red-300"
            >
              Clear Game
            </button>
          )}
        </div>

        <PlayerManagement
          players={players}
          onAddPlayer={addPlayer}
          onRemovePlayer={removePlayer}
          onUpdatePlayer={updatePlayer}
          showPlayerManagement={showPlayerManagement}
          onToggleVisibility={() => setShowPlayerManagement(!showPlayerManagement)}
          hasRounds={rounds.length > 0}
        />

        {players.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <RoundsTable
              players={players}
              rounds={rounds}
              playerOrder={playerOrder}
              onUpdateRoundScore={updateRoundScore}
              onToggleRoundWinner={toggleRoundWinner}
              onAddRound={addRound}
            />
            
            {rounds.length > 0 && (
              <Standings playerRankings={getPlayerRankings()} />
            )}
          </div>
        )}

        {players.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg">Add players to begin</div>
          </div>
        )}
      </div>
    </div>
  );
}