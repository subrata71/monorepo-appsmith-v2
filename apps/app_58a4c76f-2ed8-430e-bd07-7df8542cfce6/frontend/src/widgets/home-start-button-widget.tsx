import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, useNavigationStore, ROUTES } from '@/shared';

interface HomeStartButtonWidgetProps {
  text: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  fullWidth?: boolean;
  color?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  disabled?: boolean;
}

export const HomeStartButtonWidget = React.memo(
  ({
    text,
    size = 'lg',
    fullWidth = false,
    color = 'default',
    disabled = false,
  }: HomeStartButtonWidgetProps) => {
    const navigate = useNavigate();
    const isNavigating = useNavigationStore(state => state.isNavigating);
    const startNavigation = useNavigationStore(state => state.startNavigation);
    const completeNavigation = useNavigationStore(
      state => state.completeNavigation
    );

    const handleClick = useCallback(() => {
      if (isNavigating || disabled) return;

      startNavigation();

      // Small delay to show button feedback before navigation
      setTimeout(() => {
        navigate(ROUTES.GAME);
        completeNavigation();
      }, 150);
    }, [isNavigating, disabled, startNavigation, navigate, completeNavigation]);

    return (
      <Button
        onClick={handleClick}
        size={size}
        variant={color}
        disabled={disabled || isNavigating}
        className={fullWidth ? 'w-full' : undefined}
      >
        {isNavigating ? 'Starting...' : text}
      </Button>
    );
  }
);
