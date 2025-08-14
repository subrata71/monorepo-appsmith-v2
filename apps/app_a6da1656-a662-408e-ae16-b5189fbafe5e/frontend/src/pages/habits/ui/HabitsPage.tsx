import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { Container } from '@/shared/ui/container';
import { Button } from '@/shared/ui/button';
import { HabitListCard } from '@/widgets/habit-list-card';

export const HabitsPage = React.memo(() => {
  return (
    <>
      <Helmet>
        <title>Your Habits | Habit Tracker</title>
      </Helmet>

      <Container>
        <div className="py-8">
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">Your Habits</h1>
                <p className="text-muted-foreground mt-2">
                  Track your daily habits and build consistency. Check off
                  habits as you complete them today.
                </p>
              </div>
              <Button asChild>
                <Link to="/add-habit">Add Habit</Link>
              </Button>
            </div>
          </div>

          <div className="max-w-2xl">
            <HabitListCard />
          </div>
        </div>
      </Container>
    </>
  );
});
