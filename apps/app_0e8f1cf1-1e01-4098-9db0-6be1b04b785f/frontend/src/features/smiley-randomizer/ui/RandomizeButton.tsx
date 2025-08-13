import React from 'react';
import { Shuffle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useSmileyStore } from '@/entities/smiley';

export interface RandomizeButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const RandomizeButton = React.memo<RandomizeButtonProps>(({
  onClick,
  children,
  className,
  disabled = false
}) => {
  const randomize = useSmileyStore((state) => state.randomize);

  const handleClick = () => {
    randomize();
    onClick?.();
  };

  return (
    <Button
      onClick={handleClick}
      className={className}
      disabled={disabled}
      size="lg"
      variant="default"
      aria-label="Randomize smiley face features"
    >
      <Shuffle className="mr-2 h-5 w-5" />
      {children || 'Randomize'}
    </Button>
  );
});