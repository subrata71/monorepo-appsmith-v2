/**
 * ScreenReaderAnnouncer Component
 *
 * Announces state changes to screen readers for accessibility.
 * Uses aria-live region to provide real-time updates to assistive technologies.
 */

import React, { useEffect, useRef } from 'react';

interface ScreenReaderAnnouncerProps {
  /** The message to announce to screen readers */
  message: string | null;
  /** Priority level for the announcement */
  priority?: 'polite' | 'assertive';
  /** Whether to clear the message after announcing */
  clearAfterAnnounce?: boolean;
}

export const ScreenReaderAnnouncer = ({
  message,
  priority = 'polite',
  clearAfterAnnounce = true,
}: ScreenReaderAnnouncerProps) => {
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && announcerRef.current) {
      // Set the message for screen readers
      announcerRef.current.textContent = message;

      if (clearAfterAnnounce) {
        // Clear the message after a short delay to allow screen readers to read it
        const timeout = setTimeout(() => {
          if (announcerRef.current) {
            announcerRef.current.textContent = '';
          }
        }, 1000);

        return () => clearTimeout(timeout);
      }
    }
  }, [message, clearAfterAnnounce]);

  return (
    <div
      ref={announcerRef}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      role="status"
    />
  );
};