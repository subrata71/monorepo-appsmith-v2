import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Check, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/ui/tooltip';
import type { Reminder } from '../model/types';

interface ReminderCardProps {
  reminder: Reminder;
  onMarkAsDone: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * ReminderCard Component
 * 
 * Displays a single reminder with visual distinction for completion status
 * and action buttons for marking as done and deleting.
 */
export const ReminderCard = React.memo<ReminderCardProps>(({
  reminder,
  onMarkAsDone,
  onDelete,
}) => {
  const handleMarkAsDone = React.useCallback(() => {
    onMarkAsDone(reminder.id);
  }, [onMarkAsDone, reminder.id]);

  const handleDelete = React.useCallback(() => {
    onDelete(reminder.id);
  }, [onDelete, reminder.id]);

  const formattedDate = React.useMemo(() => {
    return formatDistanceToNow(new Date(reminder.createdAt), { addSuffix: true });
  }, [reminder.createdAt]);

  return (
    <Card className={`transition-opacity duration-200 ${reminder.isCompleted ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${
              reminder.isCompleted 
                ? 'line-through text-muted-foreground' 
                : 'text-foreground'
            }`}>
              {reminder.text}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Created {formattedDate}
            </p>
          </div>
          
          <div className="flex gap-2 flex-shrink-0">
            {!reminder.isCompleted && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAsDone}
                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mark as done</TooltipContent>
              </Tooltip>
            )}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete reminder</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});