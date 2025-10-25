'use client';

import { Player, Round } from './types';
import { getRoundCardValue } from '../utils/cardValues';

interface RoundsTableProps {
  players: Player[];
  rounds: Round[];
  onUpdateRoundScore: (roundIndex: number, playerId: string, score: number) => void;
  onToggleRoundWinner: (roundIndex: number, playerId: string) => void;
  onAddRound: () => void;
}

export default function RoundsTable({
  players,
  rounds,
  onUpdateRoundScore,
  onToggleRoundWinner,
  onAddRound
}: RoundsTableProps) {
  if (rounds.length === 0) {
    return (
      <div className="mb-8">
        <button
          onClick={onAddRound}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
        >
          + Add Round ({getRoundCardValue(1)})
        </button>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Rounds</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">Round</th>
                {players.map(player => (
                  <th key={player.id} className="text-center px-4 py-3 text-sm font-medium text-gray-900 min-w-[120px] bg-gray-50">
                    {player.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rounds.map((round, roundIndex) => (
                <tr key={round.roundNumber} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 text-white font-bold text-lg">
                      {getRoundCardValue(round.roundNumber)}
                    </div>
                  </td>
                  {players.map(player => {
                    const playerScore = round.scores.find(s => s.playerId === player.id);
                    return (
                      <td key={player.id} className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={playerScore?.score || 0}
                            onChange={(e) => onUpdateRoundScore(roundIndex, player.id, parseInt(e.target.value) || 0)}
                            onFocus={(e) => {
                              // Clear the input if the current value is 0
                              if (playerScore?.score === 0) {
                                e.target.value = '';
                              }
                            }}
                            onBlur={(e) => {
                              // If the input is empty on blur, set it back to 0
                              if (e.target.value === '') {
                                onUpdateRoundScore(roundIndex, player.id, 0);
                              }
                            }}
                            className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:border-gray-900 transition-colors text-gray-900"
                          />
                          <button
                            onClick={() => onToggleRoundWinner(roundIndex, player.id)}
                            className={`text-xs px-2 py-1 rounded transition-colors ${
                              playerScore?.isWinner 
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                            }`}
                          >
                            {playerScore?.isWinner ? '👑' : '○'}
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {rounds.length < 13 && (
        <button
          onClick={onAddRound}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
        >
          + Add Round ({getRoundCardValue(rounds.length + 1)})
        </button>
      )}
    </div>
  );
}