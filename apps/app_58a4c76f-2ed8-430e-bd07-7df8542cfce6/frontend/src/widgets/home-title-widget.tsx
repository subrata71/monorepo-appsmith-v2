import React from 'react';
import { cn } from '@/shared';

interface HomeTitleWidgetProps {
  text: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  align?: 'left' | 'center' | 'right';
  color?: string;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  fontFamily?: string;
}

const levelStyles = {
  h1: 'text-4xl md:text-6xl lg:text-7xl',
  h2: 'text-3xl md:text-5xl lg:text-6xl',
  h3: 'text-2xl md:text-4xl lg:text-5xl',
  h4: 'text-xl md:text-3xl lg:text-4xl',
  h5: 'text-lg md:text-2xl lg:text-3xl',
  h6: 'text-base md:text-xl lg:text-2xl',
};

const alignStyles = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const weightStyles = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const HomeTitleWidget = React.memo(
  ({
    text,
    level = 'h1',
    align = 'center',
    color = 'text-foreground',
    fontWeight = 'bold',
    fontFamily = 'font-sans',
  }: HomeTitleWidgetProps) => {
    const Component = level;

    return (
      <Component
        className={cn(
          levelStyles[level],
          alignStyles[align],
          weightStyles[fontWeight],
          color,
          fontFamily,
          'tracking-tight'
        )}
      >
        {text}
      </Component>
    );
  }
);
