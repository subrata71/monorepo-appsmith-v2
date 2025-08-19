import React from 'react';

interface ResultsScoreWidgetProps {
  score: number;
  className?: string;
}

export const ResultsScoreWidget = React.memo(
  ({ score, className = '' }: ResultsScoreWidgetProps) => {
    return (
      <div className={`text-center ${className}`}>
        <h1 className="text-4xl font-bold text-foreground mb-4">Final Score</h1>
        <div className="text-8xl font-bold text-primary mb-4">{score}</div>
        <p className="text-xl text-muted-foreground">
          {score === 0
            ? 'Better luck next time!'
            : score === 1
              ? 'One successful toss!'
              : `${score} successful tosses!`}
        </p>
      </div>
    );
  }
);
