import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, useNavigationStore, useResultsUiStore, ROUTES } from '@/shared';

interface ResultsRestartButtonWidgetProps {
  disabled?: boolean;
  className?: string;
}

export const ResultsRestartButtonWidget = React.memo(
  ({ disabled = false, className = '' }: ResultsRestartButtonWidgetProps) => {
    const navigate = useNavigate();
    const isNavigating = useNavigationStore(state => state.isNavigating);
    const startNavigation = useNavigationStore(state => state.startNavigation);
    const completeNavigation = useNavigationStore(state => state.completeNavigation);
    
    const isRestarting = useResultsUiStore(state => state.isRestarting);
    const startRestart = useResultsUiStore(state => state.startRestart);
    const completeRestart = useResultsUiStore(state => state.completeRestart);

    const handleRestart = useCallback(() => {
      if (isNavigating || isRestarting || disabled) return;

      startNavigation();
      startRestart();

      // Small delay to show button feedback before navigation
      setTimeout(() => {
        navigate(ROUTES.GAME);
        completeNavigation();
        completeRestart();
      }, 150);
    }, [
      isNavigating, 
      isRestarting, 
      disabled, 
      startNavigation, 
      startRestart,
      navigate, 
      completeNavigation, 
      completeRestart
    ]);

    const buttonDisabled = disabled || isNavigating || isRestarting;

    return (
      <Button
        onClick={handleRestart}
        size="lg"
        variant="default"
        disabled={buttonDisabled}
        className={`min-w-[200px] ${className}`}
        aria-label="Restart the game and play again"
      >
        {isRestarting || isNavigating ? 'Restarting...' : 'Play Again'}
      </Button>
    );
  }
);