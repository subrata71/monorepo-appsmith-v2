/**
 * CalculationResultDisplay - Business entity component for displaying calculation results and errors
 * Shows calculation results and error messages with appropriate visual styling
 */

import { Alert, AlertDescription } from '@/shared/ui/alert';

/**
 * Props for the CalculationResultDisplay component
 */
interface CalculationResultDisplayProps {
  /** Calculation result to display */
  result: number | null;
  /** Error message to display */
  error: string | null;
}

/**
 * CalculationResultDisplay component for showing calculation results
 * 
 * Features:
 * - Displays numeric results with clear formatting
 * - Shows error messages with appropriate styling
 * - Uses semantic HTML and ARIA attributes for accessibility
 * - Consistent visual design with the calculator theme
 */
export function CalculationResultDisplay({ 
  result, 
  error 
}: CalculationResultDisplayProps) {
  // Don't render anything if there's no result or error
  if (result === null && !error) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Result Display */}
      {result !== null && !error && (
        <div 
          className="text-center p-4 bg-green-50 border border-green-200 rounded-lg"
          role="status"
          aria-live="polite"
        >
          <p className="text-2xl font-bold text-green-800">
            {result}
          </p>
          <p className="text-sm text-green-600 mt-1">Result</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-center">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}