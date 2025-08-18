import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/ui/tooltip';
import { useReminderStore } from '@/entities/reminder';
import { cn } from '@/shared/lib/utils';

interface DeleteReminderButtonProps {
  reminderId: string;
  className?: string;
}

/**
 * DeleteReminderButton Component
 *
 * Dedicated feature component for deleting reminders.
 * Provides enhanced UX with loading states and confirmation feedback.
 */
export const DeleteReminderButton = React.memo<DeleteReminderButtonProps>(
  ({ reminderId, className }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const removeReminder = useReminderStore(state => state.removeReminder);

    const handleDelete = React.useCallback(async () => {
      if (isLoading) return;

      setIsLoading(true);

      // Simulate async operation with small delay for UX feedback
      setTimeout(() => {
        removeReminder(reminderId);
        setIsLoading(false);
      }, 100);
    }, [removeReminder, reminderId, isLoading]);

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
            className={cn(
              'h-8 w-8 p-0 transition-all duration-200',
              'text-red-600 hover:text-red-700 hover:bg-red-50',
              'disabled:opacity-50',
              className
            )}
          >
            <Trash2
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isLoading && 'animate-pulse'
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isLoading ? 'Deleting...' : 'Delete reminder'}
        </TooltipContent>
      </Tooltip>
    );
  }
);

DeleteReminderButton.displayName = 'DeleteReminderButton';
