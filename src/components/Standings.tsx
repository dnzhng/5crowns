'use client';

import { PlayerRanking } from './types';

interface StandingsProps {
  playerRankings: PlayerRanking[];
}

export default function Standings({ playerRankings }: StandingsProps) {
  return (
    <div className="lg:col-span-1">
      <div className="border border-gray-200 rounded-lg overflow-hidden sticky top-6">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Standings</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {playerRankings.map((player, index) => (
              <div key={player.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                index === 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {index === 0 ? '👑👑👑' : index === 1 ? '👑👑' : index === 2 ? '👑' : `${index + 1}`}
                  </span>
                  <span className="font-medium text-gray-900">{player.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg text-gray-900">{player.totalScore}</div>
                  <div className="text-xs text-gray-600">{player.wins} {player.wins === 1 ? 'win' : 'wins'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}