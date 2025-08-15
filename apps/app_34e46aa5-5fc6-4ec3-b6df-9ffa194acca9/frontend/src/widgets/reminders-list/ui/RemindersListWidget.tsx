import React from 'react';
import { Skeleton } from '@/shared/ui/skeleton';
import { useReminderStore, ReminderCard } from '@/entities/reminder';

/**
 * RemindersListWidget
 * 
 * Main widget for displaying the list of reminders. Manages the connection
 * between the reminder store and the individual reminder cards.
 */
export const RemindersListWidget = React.memo(() => {
  const reminders = useReminderStore(state => state.reminders);
  const loading = useReminderStore(state => state.loading);
  const markAsDone = useReminderStore(state => state.markAsDone);
  const removeReminder = useReminderStore(state => state.removeReminder);
  const loadReminders = useReminderStore(state => state.loadReminders);

  React.useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const handleMarkAsDone = React.useCallback((id: string) => {
    markAsDone(id);
  }, [markAsDone]);

  const handleDelete = React.useCallback((id: string) => {
    removeReminder(id);
  }, [removeReminder]);

  const sortedReminders = React.useMemo(() => {
    return [...reminders].sort((a, b) => {
      // Show incomplete reminders first
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      // Then sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [reminders]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (sortedReminders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg mb-2">No reminders yet</p>
        <p className="text-muted-foreground text-sm">
          Your reminder list is empty. Add some reminders to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedReminders.map((reminder) => (
        <ReminderCard
          key={reminder.id}
          reminder={reminder}
          onMarkAsDone={handleMarkAsDone}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
});