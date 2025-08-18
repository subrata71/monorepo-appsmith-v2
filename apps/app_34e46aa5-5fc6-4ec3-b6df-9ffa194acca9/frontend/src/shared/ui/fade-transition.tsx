import React from 'react';
import { cn } from '@/shared/lib/utils';

interface FadeTransitionProps {
  in: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * FadeTransition Component
 *
 * Provides smooth fade animations for entering and leaving elements.
 * Used primarily for reminder items and other dynamic content.
 */
export const FadeTransition = React.memo<FadeTransitionProps>(
  ({ in: show, children, className = '' }) => {
    const [shouldRender, setShouldRender] = React.useState(show);

    React.useEffect(() => {
      if (show) {
        setShouldRender(true);
      }
    }, [show]);

    const handleTransitionEnd = React.useCallback(() => {
      if (!show) {
        setShouldRender(false);
      }
    }, [show]);

    if (!shouldRender) {
      return null;
    }

    return (
      <div
        className={cn(
          'transition-all duration-300 ease-out',
          show
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-2',
          className
        )}
        onTransitionEnd={handleTransitionEnd}
      >
        {children}
      </div>
    );
  }
);

FadeTransition.displayName = 'FadeTransition';
