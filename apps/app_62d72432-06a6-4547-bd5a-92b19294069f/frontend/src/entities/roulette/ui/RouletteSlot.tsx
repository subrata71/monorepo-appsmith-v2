import { memo } from 'react';
import type { RouletteSlot as RouletteSlotType } from '../model/types';

interface RouletteSlotProps {
  slot: RouletteSlotType;
  index: number;
  totalSlots: number;
  highlighted?: boolean;
  radius: number;
}

export const RouletteSlot = memo<RouletteSlotProps>(
  ({ slot, index, totalSlots, highlighted = false, radius }) => {
    const angle = (360 / totalSlots) * index;

    // Calculate position for the slot
    const centerX = 200;
    const centerY = 200;
    const startAngle = (angle - 360 / totalSlots / 2) * (Math.PI / 180);
    const endAngle = (angle + 360 / totalSlots / 2) * (Math.PI / 180);

    const x1 = centerX + (radius - 40) * Math.cos(startAngle);
    const y1 = centerY + (radius - 40) * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(startAngle);
    const y2 = centerY + radius * Math.sin(startAngle);
    const x3 = centerX + radius * Math.cos(endAngle);
    const y3 = centerY + radius * Math.sin(endAngle);
    const x4 = centerX + (radius - 40) * Math.cos(endAngle);
    const y4 = centerY + (radius - 40) * Math.sin(endAngle);

    // Text position
    const textAngle = angle * (Math.PI / 180);
    const textRadius = radius - 20;
    const textX = centerX + textRadius * Math.cos(textAngle);
    const textY = centerY + textRadius * Math.sin(textAngle);

    const getSlotColor = () => {
      if (highlighted) return '#fbbf24'; // yellow for highlighting
      switch (slot.color) {
        case 'red':
          return '#dc2626';
        case 'black':
          return '#1f2937';
        case 'green':
          return '#16a34a';
        default:
          return '#6b7280';
      }
    };

    const textColor =
      slot.color === 'black'
        ? '#ffffff'
        : slot.color === 'red'
          ? '#ffffff'
          : slot.color === 'green'
            ? '#ffffff'
            : '#000000';

    return (
      <g>
        {/* Slot segment */}
        <path
          d={`M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${radius - 40} ${radius - 40} 0 0 0 ${x1} ${y1}`}
          fill={getSlotColor()}
          stroke="#ffffff"
          strokeWidth="1"
        />

        {/* Number text */}
        <text
          x={textX}
          y={textY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={highlighted ? '#000000' : textColor}
          fontSize="12"
          fontWeight="bold"
          transform={`rotate(${angle}, ${textX}, ${textY})`}
        >
          {slot.number}
        </text>
      </g>
    );
  }
);
