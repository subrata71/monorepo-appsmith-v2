import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StopwatchDisplay } from '../StopwatchDisplay';

describe('StopwatchDisplay', () => {
  it('renders the stopwatch display correctly', () => {
    const { getByTestId } = render(<StopwatchDisplay elapsedTime={0} />);
    const displayElement = getByTestId('stopwatch-display');

    expect(displayElement).toBeInTheDocument();
  });

  it('formats and displays elapsed time correctly', () => {
    const { getByTestId } = render(<StopwatchDisplay elapsedTime={3661000} />);
    const timeElement = getByTestId('time-text');

    expect(timeElement).toHaveTextContent('01:01:01');
  });

  it('displays zero time correctly', () => {
    const { getByTestId } = render(<StopwatchDisplay elapsedTime={0} />);
    const timeElement = getByTestId('time-text');

    expect(timeElement).toHaveTextContent('00:00:00');
  });

  it('applies custom className to TimeText', () => {
    const { getByTestId } = render(
      <StopwatchDisplay elapsedTime={0} className="custom-time-class" />
    );
    const timeElement = getByTestId('time-text');

    expect(timeElement).toHaveClass('custom-time-class');
  });
});
