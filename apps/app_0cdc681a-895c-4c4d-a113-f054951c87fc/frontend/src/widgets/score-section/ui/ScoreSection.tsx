import React from 'react';

export interface ScoreSectionProps {
  score: number;
}

export const ScoreSection: React.FC<ScoreSectionProps> = ({ score }) => {
  return (
    <div className="absolute top-4 right-4 bg-white/90 rounded-lg px-4 py-2 shadow-lg">
      <div className="text-lg font-bold text-gray-800">
        Score: <span className="text-blue-600">{score}</span>
      </div>
    </div>
  );
};
