'use client';

import { Player, Round } from './types';

interface ScoreGraphProps {
  players: Player[];
  rounds: Round[];
}

// Color palette for player lines
const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
];

export default function ScoreGraph({ players, rounds }: ScoreGraphProps) {
  if (players.length === 0 || rounds.length === 0) {
    return null;
  }

  const width = 600;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate cumulative scores for each player at each round
  const playerScores = players.map(player => {
    let cumulativeScore = 0;
    return rounds.map(round => {
      const score = round.scores.find(s => s.playerId === player.id)?.score || 0;
      cumulativeScore += score;
      return cumulativeScore;
    });
  });

  // Find max score for scaling
  const maxScore = Math.max(...playerScores.flat(), 1);

  // Scale functions
  const scaleX = (roundIndex: number) => {
    return padding.left + (roundIndex / (rounds.length - 1 || 1)) * chartWidth;
  };

  const scaleY = (score: number) => {
    return padding.top + chartHeight - (score / maxScore) * chartHeight;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Score Progression</h3>
      <svg width={width} height={height} className="mx-auto">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((fraction, i) => {
          const y = padding.top + chartHeight - fraction * chartHeight;
          const score = Math.round(maxScore * fraction);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#6b7280"
              >
                {score}
              </text>
            </g>
          );
        })}

        {/* X-axis labels (round numbers) */}
        {rounds.map((round, i) => (
          <text
            key={round.roundNumber}
            x={scaleX(i)}
            y={height - padding.bottom + 20}
            textAnchor="middle"
            fontSize="12"
            fill="#6b7280"
          >
            R{round.roundNumber}
          </text>
        ))}

        {/* Player lines */}
        {players.map((player, playerIndex) => {
          const scores = playerScores[playerIndex];
          const color = COLORS[playerIndex % COLORS.length];

          // Create path data
          const pathData = scores
            .map((score, roundIndex) => {
              const x = scaleX(roundIndex);
              const y = scaleY(score);
              return `${roundIndex === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ');

          return (
            <g key={player.id}>
              {/* Line */}
              <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Points */}
              {scores.map((score, roundIndex) => (
                <circle
                  key={roundIndex}
                  cx={scaleX(roundIndex)}
                  cy={scaleY(score)}
                  r="4"
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {players.map((player, index) => (
          <div key={player.id} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-gray-700">{player.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
