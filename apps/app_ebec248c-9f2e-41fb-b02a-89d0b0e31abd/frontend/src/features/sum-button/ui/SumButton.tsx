import React from 'react';
import { Button } from '@/shared/ui/button';
import { useSumCalculatorStore } from '@/entities/sum-calculator';

export interface SumButtonProps {
  enabled?: boolean;
  onClick?: () => void;
}

export const SumButton = React.memo<SumButtonProps>(
  ({ enabled: externalEnabled, onClick: externalOnClick }) => {
    // Use individual selectors as per Zustand rules
    const isButtonEnabled = useSumCalculatorStore(
      state => state.isButtonEnabled
    );
    const calculateSum = useSumCalculatorStore(state => state.calculateSum);

    // Use external props if provided, otherwise use store state
    const isEnabled =
      externalEnabled !== undefined ? externalEnabled : isButtonEnabled;

    const handleClick = React.useCallback(() => {
      if (externalOnClick) {
        externalOnClick();
      } else {
        calculateSum();
      }
    }, [externalOnClick, calculateSum]);

    return (
      <Button
        type="button"
        disabled={!isEnabled}
        onClick={handleClick}
        variant="default"
        size="default"
      >
        Sum
      </Button>
    );
  }
);

SumButton.displayName = 'SumButton';
