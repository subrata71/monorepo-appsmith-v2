import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/shared/ui/card';
import { MarkAsDoneButton } from '@/features/mark-as-done';
import { DeleteReminderButton } from '@/features/delete-reminder';
import { cn } from '@/shared/lib/utils';
import { useReminderStore } from '../model/store';
import type { Reminder } from '../model/types';

interface ReminderCardProps {
  reminder: Reminder;
}

/**
 * ReminderCard Component
 * 
 * Displays a single reminder with enhanced visual feedback for completion status,
 * smooth animations, and dedicated feature components for actions.
 */
export const ReminderCard = React.memo<ReminderCardProps>(({
  reminder,
}) => {
  const [justCompleted, setJustCompleted] = React.useState(false);
  const toggleCompletion = useReminderStore(state => state.toggleCompletion);

  const formattedDate = React.useMemo(() => {
    return formatDistanceToNow(new Date(reminder.createdAt), { addSuffix: true });
  }, [reminder.createdAt]);

  // Track completion status changes for animation
  React.useEffect(() => {
    if (reminder.isCompleted && !justCompleted) {
      setJustCompleted(true);
      // Reset animation state after animation completes
      const timer = setTimeout(() => setJustCompleted(false), 600);
      return () => clearTimeout(timer);
    }
  }, [reminder.isCompleted, justCompleted]);

  const handleTextClick = React.useCallback(() => {
    // Allow toggling completion by clicking on completed items
    if (reminder.isCompleted) {
      toggleCompletion(reminder.id);
    }
  }, [reminder.isCompleted, reminder.id, toggleCompletion]);

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    // Add keyboard accessibility
    if (event.key === 'Enter') {
      event.preventDefault();
      if (reminder.isCompleted) {
        toggleCompletion(reminder.id);
      } else {
        // Trigger mark as done functionality for uncompleted items
        const markAsDoneButton = event.currentTarget.querySelector('[data-reminder-id]');
        if (markAsDoneButton) {
          (markAsDoneButton as HTMLButtonElement).click();
        }
      }
    }
  }, [reminder.isCompleted, reminder.id, toggleCompletion]);

  return (
    <Card 
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        'transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500',
        reminder.isCompleted && 'opacity-70 scale-[0.98]',
        justCompleted && 'animate-pulse ring-2 ring-green-200 bg-green-50/50',
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p 
              className={cn(
                'text-sm font-medium transition-all duration-300',
                reminder.isCompleted 
                  ? 'line-through text-muted-foreground cursor-pointer hover:text-foreground' 
                  : 'text-foreground'
              )}
              onClick={handleTextClick}
              title={reminder.isCompleted ? 'Click to mark as incomplete' : undefined}
            >
              {reminder.text}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Created {formattedDate}
            </p>
            {reminder.isCompleted && (
              <p className="text-xs text-green-600 mt-1 font-medium">
                ✓ Completed
              </p>
            )}
          </div>
          
          <div className="flex gap-2 flex-shrink-0">
            <MarkAsDoneButton 
              reminderId={reminder.id}
              isCompleted={reminder.isCompleted}
            />
            <DeleteReminderButton 
              reminderId={reminder.id}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});