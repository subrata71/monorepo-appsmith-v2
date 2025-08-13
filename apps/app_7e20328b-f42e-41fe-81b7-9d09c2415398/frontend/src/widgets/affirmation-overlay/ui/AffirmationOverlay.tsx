/**
 * AffirmationOverlay Widget
 * 
 * Overlay card that appears after mood submission, displaying randomly selected 
 * affirmation with confetti animation. Disables background interaction, 
 * auto-dismisses after delay or on tap.
 */

import React from 'react';
import { AffirmationFeedback } from '@/features/affirmation-feedback';

export interface AffirmationOverlayProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

export const AffirmationOverlay = React.memo<AffirmationOverlayProps>(
  ({ open, onClose, className }) => {
    return (
      <AffirmationFeedback 
        open={open} 
        onClose={onClose} 
        className={className}
      />
    );
  }
);

AffirmationOverlay.displayName = 'AffirmationOverlay';