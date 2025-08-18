import React from 'react';
import { cn } from '@/shared/lib/utils';

interface NeonTextProps {
  text: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const NeonText = React.memo<NeonTextProps>(
  ({ text, color = '#00ffff', size = 'md', className }) => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-xl',
      xl: 'text-3xl font-bold',
    };

    return (
      <div
        className={cn(
          'font-mono tracking-wider select-none',
          sizeClasses[size],
          className
        )}
        style={{
          color: color,
          textShadow: `
          0 0 5px ${color},
          0 0 10px ${color},
          0 0 15px ${color},
          0 0 20px ${color}
        `,
        }}
      >
        {text}
      </div>
    );
  }
);
