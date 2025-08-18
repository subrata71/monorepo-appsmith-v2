import React from 'react';
import { Container } from '@/shared';
import { RemindersListWidget } from '@/widgets/reminders-list';
import { useReminderStore } from '@/entities/reminder';

/**
 * HomePage
 *
 * Main page displaying the reminder list. Shows the total count of reminders
 * and renders the RemindersListWidget for the main functionality.
 */
export const HomePage = React.memo(() => {
  const reminders = useReminderStore(state => state.reminders);

  const reminderStats = React.useMemo(() => {
    const total = reminders.length;
    const completed = reminders.filter(r => r.isCompleted).length;
    const pending = total - completed;

    return { total, completed, pending };
  }, [reminders]);

  return (
    <Container className="py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            My Reminders
          </h1>
          <p className="text-muted-foreground">
            {reminderStats.total === 0
              ? 'No reminders yet'
              : `${reminderStats.pending} pending, ${reminderStats.completed} completed`}
          </p>
        </div>

        <RemindersListWidget />
      </div>
    </Container>
  );
});
