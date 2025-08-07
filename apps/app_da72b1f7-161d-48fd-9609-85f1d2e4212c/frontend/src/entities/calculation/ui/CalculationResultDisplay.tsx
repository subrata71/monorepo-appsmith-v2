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
 * - Displays numeric results in large, bold, prominent formatting (text-5xl, font-extrabold)
 * - Shows error messages with prominent red styling for clear visibility
 * - Uses semantic HTML and ARIA attributes for accessibility
 * - Immediate visual feedback with proper spacing and visual hierarchy
 * - Consistent visual design with enhanced typography for maximum clarity
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
    <div className="space-y-4">
      {/* Result Display - Large and Bold */}
      {result !== null && !error && (
        <div 
          className="text-center p-6 bg-green-50 border border-green-200 rounded-lg"
          role="status"
          aria-live="polite"
        >
          <p className="text-5xl font-extrabold text-green-800 mb-2">
            {result}
          </p>
          <p className="text-sm text-green-600">Result</p>
        </div>
      )}

      {/* Error Display - Prominent styling */}
      {error && (
        <Alert variant="destructive" className="text-center p-6">
          <AlertDescription className="text-xl font-bold">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}