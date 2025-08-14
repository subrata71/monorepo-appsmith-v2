import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { Container } from '@/shared/ui/container';
import { Button } from '@/shared/ui/button';
import { AddHabitCard } from '@/widgets/add-habit-card';

export const AddHabitPage = React.memo(() => {
  return (
    <>
      <Helmet>
        <title>Add Habit | Habit Tracker</title>
      </Helmet>

      <Container>
        <div className="py-8">
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">Add Habit</h1>
                <p className="text-muted-foreground mt-2">
                  Create custom habits to track during your session. These habits
                  will be stored locally and reset when you refresh the page.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/habits">Back to Habits</Link>
              </Button>
            </div>
          </div>

          <div className="max-w-2xl">
            <AddHabitCard />
          </div>
        </div>
      </Container>
    </>
  );
});