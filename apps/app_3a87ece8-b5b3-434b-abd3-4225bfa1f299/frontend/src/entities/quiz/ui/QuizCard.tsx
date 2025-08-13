/**
 * QuizCard Component
 *
 * Displays quiz title and instructions.
 * Used in the quiz start screen.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui';
import type { Quiz } from '../model/types';

interface QuizCardProps {
  quiz: Quiz;
}

export const QuizCard = ({ quiz }: QuizCardProps) => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {quiz.title}
        </CardTitle>
        {quiz.instructions && (
          <CardDescription className="text-center text-lg">
            {quiz.instructions}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-center text-sm text-muted-foreground">
          {quiz.questions.length}{' '}
          {quiz.questions.length === 1 ? 'question' : 'questions'}
        </div>
      </CardContent>
    </Card>
  );
};
