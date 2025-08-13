/**
 * AffirmationFeedback Feature Component
 * 
 * Handles random selection of affirmation and triggers overlay/animation after mood submission.
 */

import React from 'react';
import { AffirmationMessage } from '@/entities/affirmation';
import { Confetti } from '@/shared/ui/confetti';
import { getRandomAffirmation } from '@/shared/lib/affirmation-storage';
import type { Affirmation } from '@/entities/affirmation';

export interface AffirmationFeedbackProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

export const AffirmationFeedback = React.memo<AffirmationFeedbackProps>(
  ({ open, onClose, className }) => {
    const [currentAffirmation, setCurrentAffirmation] = React.useState<Affirmation | null>(null);
    const [showConfetti, setShowConfetti] = React.useState(false);

    // Load random affirmation when overlay opens
    React.useEffect(() => {
      if (open && !currentAffirmation) {
        const affirmation = getRandomAffirmation();
        setCurrentAffirmation(affirmation);
        setShowConfetti(true);
        
        // Auto-hide confetti after 3 seconds
        const confettiTimer = setTimeout(() => {
          setShowConfetti(false);
        }, 3000);

        // Auto-close overlay after 4 seconds
        const closeTimer = setTimeout(() => {
          onClose();
        }, 4000);

        return () => {
          clearTimeout(confettiTimer);
          clearTimeout(closeTimer);
        };
      } else if (!open) {
        // Reset state when overlay closes
        setCurrentAffirmation(null);
        setShowConfetti(false);
      }
    }, [open, currentAffirmation, onClose]);

    // Handle click to close
    const handleOverlayClick = React.useCallback((e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }, [onClose]);

    // Handle escape key
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && open) {
          onClose();
        }
      };

      if (open) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [open, onClose]);

    if (!open || !currentAffirmation) {
      return null;
    }

    return (
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          } ${className || ''}`}
          onClick={handleOverlayClick}
        />

        {/* Overlay Content */}
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className={`bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 backdrop-blur-md 
                       border border-primary/20 rounded-3xl shadow-2xl p-8 max-w-md w-full 
                       transform transition-all duration-500 ${
                         open 
                           ? 'scale-100 opacity-100 translate-y-0' 
                           : 'scale-95 opacity-0 translate-y-4'
                       }`}
            onClick={(e) => e.stopPropagation()}
          >
            <AffirmationMessage message={currentAffirmation.message} />
            
            {/* Close button */}
            <div className="mt-6 text-center">
              <button
                onClick={onClose}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 
                          px-4 py-2 rounded-lg hover:bg-muted/50"
              >
                Tap to continue ✨
              </button>
            </div>
          </div>
        </div>

        {/* Confetti Animation */}
        <Confetti active={showConfetti} />
      </>
    );
  }
);

AffirmationFeedback.displayName = 'AffirmationFeedback';