import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/ui/tooltip';
import { useReminderStore } from '@/entities/reminder';
import { cn } from '@/shared/lib/utils';

interface MarkAsDoneButtonProps {
  reminderId: string;
  isCompleted: boolean;
  className?: string;
}

/**
 * MarkAsDoneButton Component
 *
 * Dedicated feature component for marking reminders as completed.
 * Provides enhanced UX with loading states, animations, and feedback.
 */
export const MarkAsDoneButton = React.memo<MarkAsDoneButtonProps>(
  ({ reminderId, isCompleted, className }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);
    const markAsDone = useReminderStore(state => state.markAsDone);

    const handleMarkAsDone = React.useCallback(async () => {
      if (isCompleted || isLoading) return;

      setIsLoading(true);

      // Simulate async operation with small delay for UX feedback
      setTimeout(() => {
        markAsDone(reminderId);
        setIsLoading(false);
        setShowSuccess(true);

        // Create a celebration effect
        const button = document.querySelector(
          `[data-reminder-id="${reminderId}"]`
        );
        if (button) {
          // Add temporary celebration class
          button.classList.add('animate-bounce');
          setTimeout(() => {
            button.classList.remove('animate-bounce');
          }, 500);
        }

        // Reset success state after animation
        setTimeout(() => {
          setShowSuccess(false);
        }, 1000);
      }, 150);
    }, [markAsDone, reminderId, isCompleted, isLoading]);

    // Don't render if already completed
    if (isCompleted) {
      return null;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            data-reminder-id={reminderId}
            variant="ghost"
            size="sm"
            onClick={handleMarkAsDone}
            disabled={isLoading}
            className={cn(
              'h-8 w-8 p-0 transition-all duration-200',
              'text-green-600 hover:text-green-700 hover:bg-green-50',
              'disabled:opacity-50',
              showSuccess && 'animate-pulse bg-green-100 text-green-800',
              className
            )}
          >
            <Check
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isLoading && 'animate-spin',
                showSuccess && 'scale-110'
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isLoading ? 'Marking as done...' : 'Mark as done'}
        </TooltipContent>
      </Tooltip>
    );
  }
);

MarkAsDoneButton.displayName = 'MarkAsDoneButton';
