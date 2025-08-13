import React from 'react';
import type { SmileyFaceProps, MouthType, EyeType } from '../model/types';
import { MOUTH_OPTIONS, EYE_OPTIONS } from '../model/types';
import { cn } from '@/shared/lib/utils';

export const SmileyFace = React.memo<SmileyFaceProps>(({
  mouth = 'happy',
  eyes = 'normal',
  color = '#FFD700',
  size = 100,
  className
}) => {
  const mouthPath = MOUTH_OPTIONS[mouth as MouthType] || MOUTH_OPTIONS.happy;
  const eyeConfig = EYE_OPTIONS[eyes as EyeType] || EYE_OPTIONS.normal;

  const renderEyes = () => {
    if (typeof eyeConfig.left === 'string') {
      // Closed/wink eyes - render as lines
      return (
        <>
          <path
            d={eyeConfig.left}
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {typeof eyeConfig.right === 'string' ? (
            <path
              d={eyeConfig.right}
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <circle
              cx={eyeConfig.right.cx}
              cy={eyeConfig.right.cy}
              r={eyeConfig.right.r}
              fill="black"
            />
          )}
        </>
      );
    } else {
      // Normal eyes - render as circles
      return (
        <>
          <circle
            cx={eyeConfig.left.cx}
            cy={eyeConfig.left.cy}
            r={eyeConfig.left.r}
            fill="black"
          />
          <circle
            cx={eyeConfig.right.cx}
            cy={eyeConfig.right.cy}
            r={eyeConfig.right.r}
            fill="black"
          />
        </>
      );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn('transition-all duration-300 ease-in-out', className)}
      role="img"
      aria-label={`Smiley face with ${mouth} mouth, ${eyes} eyes, and ${color} color`}
    >
      {/* Face circle */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill={color}
        stroke="black"
        strokeWidth="2"
      />
      
      {/* Eyes */}
      {renderEyes()}
      
      {/* Mouth */}
      <path
        d={mouthPath}
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
});