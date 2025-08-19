'use client';

import { useState } from 'react';
import { Player } from './types';

interface PlayerManagementProps {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (playerId: string) => void;
  onUpdatePlayer: (playerId: string, name: string) => void;
  showPlayerManagement: boolean;
  onToggleVisibility: () => void;
  hasRounds: boolean;
}

export default function PlayerManagement({
  players,
  onAddPlayer,
  onRemovePlayer,
  onUpdatePlayer,
  showPlayerManagement,
  onToggleVisibility,
  hasRounds
}: PlayerManagementProps) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingPlayerName, setEditingPlayerName] = useState('');

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  const startEditingPlayer = (player: Player) => {
    setEditingPlayerId(player.id);
    setEditingPlayerName(player.name);
  };

  const savePlayerName = () => {
    if (editingPlayerName.trim()) {
      onUpdatePlayer(editingPlayerId!, editingPlayerName.trim());
    }
    setEditingPlayerId(null);
    setEditingPlayerName('');
  };

  const cancelEditingPlayer = () => {
    setEditingPlayerId(null);
    setEditingPlayerName('');
  };

  if (!showPlayerManagement && hasRounds) {
    return (
      <div className="mb-6">
        <button
          onClick={onToggleVisibility}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Edit Players
        </button>
      </div>
    );
  }

  if (!showPlayerManagement) {
    return null;
  }

  return (
    <div className="mb-8 p-6 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Players</h2>
        {hasRounds && (
          <button
            onClick={onToggleVisibility}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Hide ✕
          </button>
        )}
      </div>
      
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Player name"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors text-gray-900"
        />
        <button
          onClick={addPlayer}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {players.map(player => (
          <div key={player.id} className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
            {editingPlayerId === player.id ? (
              <>
                <input
                  type="text"
                  value={editingPlayerName}
                  onChange={(e) => setEditingPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && savePlayerName()}
                  className="px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                  autoFocus
                />
                <button
                  onClick={savePlayerName}
                  className="text-green-600 hover:text-green-800 transition-colors"
                >
                  ✓
                </button>
                <button
                  onClick={cancelEditingPlayer}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <span 
                  onClick={() => startEditingPlayer(player)}
                  className="cursor-pointer hover:text-gray-600 transition-colors text-gray-900"
                >
                  {player.name}
                </span>
                <button
                  onClick={() => onRemovePlayer(player.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  ×
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}