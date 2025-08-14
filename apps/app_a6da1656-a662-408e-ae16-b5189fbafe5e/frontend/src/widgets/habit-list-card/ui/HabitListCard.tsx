import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { HabitList } from '@/features/habit-list';

export const HabitListCard = React.memo(() => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Habits</CardTitle>
      </CardHeader>
      <CardContent>
        <HabitList />
      </CardContent>
    </Card>
  );
});
