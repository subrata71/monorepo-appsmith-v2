/**
 * Daily Entry Card Component
 *
 * Displays the saved daily entry in a card format with edit capability
 */

import React, { useCallback } from 'react';
import { DailyEntryEditButton } from './DailyEntryEditButton';

interface DailyEntryCardProps {
  /** The sentence content of the entry */
  sentence: string;
  /** Handler for when edit is clicked */
  onEdit?: () => void;
  /** Whether editing is allowed */
  canEdit: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const DailyEntryCard = React.memo<DailyEntryCardProps>(
  ({ sentence, onEdit, canEdit, className = '' }) => {
    const handleEdit = useCallback(() => {
      if (onEdit && canEdit) {
        onEdit();
      }
    }, [onEdit, canEdit]);

    return (
      <div className={`space-y-4 ${className}`}>
        {/* Display the saved sentence */}
        <blockquote className="border-l-4 border-primary pl-4 italic text-lg leading-relaxed">
          "{sentence}"
        </blockquote>

        {/* Edit button section */}
        {canEdit && (
          <div className="flex justify-end">
            <DailyEntryEditButton onClick={handleEdit} disabled={!canEdit} />
          </div>
        )}

        {/* Time restriction notice */}
        {!canEdit && (
          <div className="text-sm text-muted-foreground text-center py-2">
            This entry can no longer be edited as the day has ended.
          </div>
        )}
      </div>
    );
  }
);
