/**
 * Note Textarea Component
 *
 * A large, borderless textarea specifically designed for note editing.
 * Provides auto-focus, auto-resize, and accessibility features for the note editor.
 */

import * as React from 'react';
import { Textarea } from './textarea';
import { cn } from '@/shared/lib/utils';

interface NoteTextareaProps extends React.ComponentProps<'textarea'> {
  /** Whether to auto-focus the textarea on mount */
  autoFocus?: boolean;
  /** Aria label for accessibility */
  'aria-label'?: string;
}

const NoteTextarea = React.memo(
  React.forwardRef<HTMLTextAreaElement, NoteTextareaProps>(
    (
      {
        className,
        autoFocus = false,
        'aria-label': ariaLabel,
        onChange,
        ...props
      },
      ref
    ) => {
      const textareaRef = React.useRef<HTMLTextAreaElement>(null);

      // Combine refs
      React.useImperativeHandle(ref, () => textareaRef.current!, []);

      // Auto-resize functionality
      const autoResize = React.useCallback(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          // Reset height to auto to get the correct scrollHeight
          textarea.style.height = 'auto';
          // Set height to scrollHeight to fit content
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
      }, []);

      // Handle auto-focus
      React.useEffect(() => {
        if (autoFocus && textareaRef.current) {
          textareaRef.current.focus();
        }
      }, [autoFocus]);

      // Handle initial resize and resize on content change
      React.useEffect(() => {
        autoResize();
      });

      const handleChange = React.useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          // Call auto-resize after content changes
          setTimeout(autoResize, 0);
          // Call the original onChange if provided
          if (onChange) {
            onChange(e);
          }
        },
        [autoResize, onChange]
      );

      return (
        <Textarea
          ref={textareaRef}
          className={cn(
            // Override default textarea styles for borderless, large appearance
            'border-none shadow-none bg-transparent p-0 text-lg leading-relaxed resize-none overflow-hidden',
            // Remove focus styles for minimal appearance
            'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-none',
            // Ensure proper typography
            'font-normal placeholder:text-muted-foreground',
            className
          )}
          aria-label={ariaLabel || 'Note content'}
          rows={1} // Start with minimal height, will auto-expand
          onChange={handleChange}
          {...props}
        />
      );
    }
  )
);

NoteTextarea.displayName = 'NoteTextarea';

export { NoteTextarea, type NoteTextareaProps };
