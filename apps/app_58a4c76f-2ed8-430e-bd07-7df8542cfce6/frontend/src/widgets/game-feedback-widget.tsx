import React from 'react';
import { Alert, AlertDescription } from '@/shared';
import { CheckCircle, XCircle } from 'lucide-react';

interface GameFeedbackWidgetProps {
  feedback?: string;
  outcome?: 'success' | 'failure';
  visible?: boolean;
  className?: string;
}

export const GameFeedbackWidget = React.memo(
  ({
    feedback = '',
    outcome = 'success',
    visible = false,
    className = '',
  }: GameFeedbackWidgetProps) => {
    if (!visible || !feedback) {
      return (
        <div className={`h-16 flex items-center justify-center ${className}`}>
          {/* Placeholder to maintain layout space */}
        </div>
      );
    }

    const isSuccess = outcome === 'success';
    const icon = isSuccess ? (
      <CheckCircle className="h-6 w-6 text-green-600" />
    ) : (
      <XCircle className="h-6 w-6 text-red-600" />
    );

    return (
      <div
        className={`
          h-16 flex items-center justify-center
          transition-all duration-300 ease-in-out
          ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          ${className}
        `}
      >
        <Alert
          className={`
            border-2 shadow-lg
            ${
              isSuccess
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }
          `}
        >
          <div className="flex items-center gap-3">
            {icon}
            <AlertDescription className="text-lg font-semibold">
              {feedback}
            </AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }
);
