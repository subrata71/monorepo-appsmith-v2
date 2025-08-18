import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AlarmTimeWidget } from '@/widgets/alarm-time';
import { Container } from '@/shared/ui';
import type { Alarm } from '@app/shared';

/**
 * AlarmTimeSelectionPage - Page for setting alarm time
 *
 * This page allows users to set and confirm their alarm time using a simple
 * and intuitive interface with a time picker control.
 */
export const AlarmTimeSelectionPage = React.memo(() => {
  const handleTimeChange = React.useCallback((time: string) => {
    // Optional: Add any page-level side effects when time changes
    console.log('Alarm time changed:', time);
  }, []);

  const handleConfirm = React.useCallback((time: string, alarm: Alarm) => {
    // Optional: Add any page-level side effects after successful save
    console.log('Alarm saved successfully:', { time, alarm });
  }, []);

  return (
    <>
      <Helmet>
        <title>Set Alarm Time | App</title>
      </Helmet>

      <Container className="py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Set Alarm Time
            </h1>
            <p className="text-muted-foreground">
              Choose the time for your alarm. You can update it anytime.
            </p>
          </div>

          {/* Alarm Time Widget */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <AlarmTimeWidget
                onChangeTime={handleTimeChange}
                onConfirm={handleConfirm}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
});

AlarmTimeSelectionPage.displayName = 'AlarmTimeSelectionPage';
