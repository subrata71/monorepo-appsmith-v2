/**
 * Confetti Component
 * 
 * Renders celebratory confetti animation for overlay.
 */

import React from 'react';

export interface ConfettiProps {
  active: boolean;
  className?: string;
}

export const Confetti = React.memo<ConfettiProps>(({ active, className }) => {
  if (!active) return null;

  // Generate random confetti pieces
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDelay: Math.random() * 3,
    color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#ff9ff3', '#54a0ff'][Math.floor(Math.random() * 6)]
  }));

  return (
    <>
      <style>
        {`
          @keyframes confetti-fall {
            0% {
              transform: translateY(-100vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
          
          .confetti-piece {
            animation: confetti-fall 3s linear infinite;
          }
        `}
      </style>
      <div className={`fixed inset-0 pointer-events-none z-50 overflow-hidden ${className || ''}`}>
        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className="confetti-piece absolute w-2 h-2 rounded-sm"
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              animationDelay: `${piece.animationDelay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
});

Confetti.displayName = 'Confetti';