/**
 * Daily Entry Edit Button Component
 *
 * Button component specifically for triggering edit mode on daily entries
 */

import React from 'react';
import { Button } from '@/shared/ui/button';
import { Edit } from 'lucide-react';

interface DailyEntryEditButtonProps {
  /** Handler for when the button is clicked */
  onClick?: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Button variant */
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  /** Button size */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Additional CSS classes */
  className?: string;
}

export const DailyEntryEditButton = React.memo<DailyEntryEditButtonProps>(
  ({
    onClick,
    disabled = false,
    variant = 'outline',
    size = 'sm',
    className = '',
  }) => {
    return (
      <Button
        onClick={onClick}
        disabled={disabled}
        variant={variant}
        size={size}
        className={className}
      >
        <Edit className="h-4 w-4 mr-2" />
        Edit Entry
      </Button>
    );
  }
);
