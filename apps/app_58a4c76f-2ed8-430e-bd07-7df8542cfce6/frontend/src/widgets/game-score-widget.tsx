import React from 'react';

interface GameScoreWidgetProps {
  score?: number;
  className?: string;
}

export const GameScoreWidget = React.memo(
  ({ score = 0, className = '' }: GameScoreWidgetProps) => {
    return (
      <div className={`text-center ${className}`}>
        <h2 className="text-3xl font-bold text-foreground mb-2">Score</h2>
        <div className="text-6xl font-bold text-primary">{score}</div>
        <p className="text-lg text-muted-foreground mt-2">Successful tosses</p>
      </div>
    );
  }
);
