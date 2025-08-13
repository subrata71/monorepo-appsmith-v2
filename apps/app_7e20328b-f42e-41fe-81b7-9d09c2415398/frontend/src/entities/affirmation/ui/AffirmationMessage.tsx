/**
 * AffirmationMessage Entity Component
 * 
 * Displays a positive affirmation message in playful, cheerful style.
 */

import React from 'react';

export interface AffirmationMessageProps {
  message: string;
  className?: string;
}

export const AffirmationMessage = React.memo<AffirmationMessageProps>(
  ({ message, className }) => {
    return (
      <div className={`text-center ${className || ''}`}>
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">
            🌟
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-primary mb-4 leading-relaxed">
          {message}
        </h2>
        
        <div className="flex justify-center items-center gap-2 text-lg text-muted-foreground">
          <span className="animate-pulse">✨</span>
          <span className="font-medium">You're doing amazing!</span>
          <span className="animate-pulse">✨</span>
        </div>
      </div>
    );
  }
);

AffirmationMessage.displayName = 'AffirmationMessage';