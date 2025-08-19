'use client';

import { PlayerRanking } from './types';

interface GameCompleteProps {
  winner: PlayerRanking;
  playerRankings: PlayerRanking[];
  onStartNewGame: () => void;
}

export default function GameComplete({ winner, playerRankings, onStartNewGame }: GameCompleteProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-yellow-800 mb-4">🎉 Game Complete! 🎉</h1>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              🏆 Congratulations {winner.name}! 🏆
            </h2>
            <p className="text-xl text-gray-800 mb-6">
              You won Five Crowns with a final score of {winner.totalScore} points!
            </p>
            <div className="text-lg text-gray-700">
              Rounds won: {winner.wins} out of 13
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Final Rankings</h3>
            <div className="space-y-3">
              {playerRankings.map((player, index) => (
                <div key={player.id} className={`flex justify-between items-center p-3 rounded-lg ${
                  index === 0 ? 'bg-yellow-100 border-2 border-yellow-400' : 
                  index === 1 ? 'bg-gray-100' : 
                  index === 2 ? 'bg-orange-100' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </span>
                    <span className="font-semibold text-lg">{player.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg">{player.totalScore} points</div>
                    <div className="text-sm text-gray-800">{player.wins} rounds won</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={onStartNewGame}
            className="mt-6 px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
          >
            Start New Game
          </button>
        </div>
      </div>
    </div>
  );
}