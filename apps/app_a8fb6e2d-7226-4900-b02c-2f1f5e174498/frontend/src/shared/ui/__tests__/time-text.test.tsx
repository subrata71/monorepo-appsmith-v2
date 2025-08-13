import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TimeText } from '../time-text';

describe('TimeText', () => {
  it('renders the time value correctly', () => {
    const { getByTestId } = render(<TimeText value="01:23:45" />);
    const timeElement = getByTestId('time-text');
    
    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveTextContent('01:23:45');
  });

  it('applies correct CSS classes', () => {
    const { getByTestId } = render(<TimeText value="00:00:00" />);
    const timeElement = getByTestId('time-text');
    
    expect(timeElement).toHaveClass('font-mono');
    expect(timeElement).toHaveClass('text-6xl');
    expect(timeElement).toHaveClass('font-bold');
    expect(timeElement).toHaveClass('tracking-wide');
    expect(timeElement).toHaveClass('tabular-nums');
  });

  it('accepts custom className', () => {
    const { getByTestId } = render(
      <TimeText value="00:00:00" className="custom-class" />
    );
    const timeElement = getByTestId('time-text');
    
    expect(timeElement).toHaveClass('custom-class');
    expect(timeElement).toHaveClass('font-mono'); // Should still have default classes
  });
});