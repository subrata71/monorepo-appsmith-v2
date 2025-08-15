import React from 'react';
import { Skeleton } from '@/shared/ui/skeleton';
import { FadeTransition } from '@/shared/ui/fade-transition';
import { useReminderStore, ReminderCard } from '@/entities/reminder';

/**
 * RemindersListWidget
 * 
 * Main widget for displaying the list of reminders with smooth animations.
 * Uses FadeTransition for enhanced UX when reminders appear/disappear.
 */
export const RemindersListWidget = React.memo(() => {
  const reminders = useReminderStore(state => state.reminders);
  const loading = useReminderStore(state => state.loading);
  const loadReminders = useReminderStore(state => state.loadReminders);

  React.useEffect(() => {
    loadReminders();
  }, [loadReminders]);

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
          <FadeTransition key={index} in={true}>
            <Skeleton className="h-20 w-full" />
          </FadeTransition>
        ))}
      </div>
    );
  }

  if (sortedReminders.length === 0) {
    return (
      <FadeTransition in={true}>
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-2">No reminders yet</p>
          <p className="text-muted-foreground text-sm">
            Your reminder list is empty. Add some reminders to get started!
          </p>
        </div>
      </FadeTransition>
    );
  }

  return (
    <div className="space-y-4">
      {sortedReminders.map((reminder) => (
        <FadeTransition key={reminder.id} in={true}>
          <ReminderCard reminder={reminder} />
        </FadeTransition>
      ))}
    </div>
  );
});