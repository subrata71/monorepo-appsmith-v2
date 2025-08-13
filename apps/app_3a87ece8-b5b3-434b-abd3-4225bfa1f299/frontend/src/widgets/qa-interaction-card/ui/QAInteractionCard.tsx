/**
 * QAInteractionCard Widget Component
 *
 * Widget to present a single question, manage answer selection, feedback display, 
 * and accessibility. Composes QAImmediateFeedback feature within a Card layout.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { QAImmediateFeedback } from '@/features/qa-immediate-feedback';
import type { QAInteractionCardProps } from '../model/types';

export const QAInteractionCard = React.memo(({
  question,
  onAnswered,
}: QAInteractionCardProps) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-lg font-semibold text-muted-foreground">
          Question and Answer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <QAImmediateFeedback
          question={question}
          onAnswered={onAnswered}
        />
      </CardContent>
    </Card>
  );
});