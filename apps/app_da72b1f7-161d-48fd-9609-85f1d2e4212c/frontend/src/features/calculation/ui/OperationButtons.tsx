/**
 * OperationButtons - Feature component for arithmetic operation selection
 * Renders four large, horizontally arranged operation buttons with selection highlighting
 */

import { Button } from '@/shared/ui/button';
import { useCalculationStore } from '../model/calculationStore';
import type { Operation } from '@/entities/calculation/model/types';

/**
 * Props for the OperationButtons component
 */
interface OperationButtonsProps {
  /** Currently selected operation for visual highlighting */
  selectedOperation?: Operation | null;
  /** Callback when an operation is selected */
  onSelect: (operation: Operation) => void;
  /** Whether operation buttons should be disabled */
  disabled?: boolean;
}

/**
 * Operation button configuration
 */
const operations = [
  { key: 'add' as const, label: '+', ariaLabel: 'Addition' },
  { key: 'subtract' as const, label: '−', ariaLabel: 'Subtraction' },
  { key: 'multiply' as const, label: '×', ariaLabel: 'Multiplication' },
  { key: 'divide' as const, label: '÷', ariaLabel: 'Division' },
];

/**
 * OperationButtons component for selecting arithmetic operations
 *
 * Features:
 * - Four large, horizontally arranged buttons
 * - Visual highlighting of selected operation
 * - Full keyboard accessibility with ARIA labels
 * - Immediate calculation trigger on selection
 * - Consistent with design system button variants
 */
export function OperationButtons({
  selectedOperation,
  onSelect,
  disabled = false,
}: OperationButtonsProps) {
  const calculate = useCalculationStore(state => state.calculate);

  const handleOperationClick = (operation: Operation) => {
    onSelect(operation);
    // Trigger calculation immediately after operation selection
    calculate();
  };

  return (
    <div
      className="grid grid-cols-4 gap-3"
      role="group"
      aria-label="Arithmetic operations"
    >
      {operations.map(({ key, label, ariaLabel }) => (
        <Button
          key={key}
          variant={selectedOperation === key ? 'default' : 'outline'}
          size="lg"
          onClick={() => handleOperationClick(key)}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-pressed={selectedOperation === key}
          className="h-14 text-xl font-semibold min-w-0 flex-1"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
