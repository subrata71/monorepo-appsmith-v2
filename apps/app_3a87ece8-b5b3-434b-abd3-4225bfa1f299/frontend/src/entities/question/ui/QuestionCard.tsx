/**
 * QuestionCard Component
 *
 * Displays question text and answer options.
 * Used during quiz navigation.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import type { Question, QuestionCallbacks } from '../model/types';

interface QuestionCardProps {
  question: Question;
  onAnswer: QuestionCallbacks['onAnswer'];
}

export const QuestionCard = ({ question, onAnswer }: QuestionCardProps) => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl">{question.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {question.options.map(option => (
            <button
              key={option.id}
              onClick={() => onAnswer(option.id)}
              className="w-full p-3 text-left border rounded-lg hover:bg-muted transition-colors"
            >
              {option.text}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
