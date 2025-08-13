import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StopwatchControls } from '../StopwatchControls';

describe('StopwatchControls', () => {
  const mockOnStartStop = vi.fn();
  const mockOnReset = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Start/Stop Button', () => {
    it('shows "Start" when stopwatch is not running', () => {
      render(
        <StopwatchControls
          isRunning={false}
          elapsedTime={0}
          onStartStop={mockOnStartStop}
          onReset={mockOnReset}
        />
      );

      const startStopButton = screen.getByTestId('start-stop-button');
      expect(startStopButton).toHaveTextContent('Start');
    });

    it('shows "Stop" when stopwatch is running', () => {
      render(
        <StopwatchControls
          isRunning={true}
          elapsedTime={5000}
          onStartStop={mockOnStartStop}
          onReset={mockOnReset}
        />
      );

      const startStopButton = screen.getByTestId('start-stop-button');
      expect(startStopButton).toHaveTextContent('Stop');
    });

    it('calls onStartStop when clicked', () => {
      render(
        <StopwatchControls
          isRunning={false}
          elapsedTime={0}
          onStartStop={mockOnStartStop}
          onReset={mockOnReset}
        />
      );

      const startStopButton = screen.getByTestId('start-stop-button');
      fireEvent.click(startStopButton);

      expect(mockOnStartStop).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reset Button', () => {
    it('is disabled when elapsed time is 0', () => {
      render(
        <StopwatchControls
          isRunning={false}
          elapsedTime={0}
          onStartStop={mockOnStartStop}
          onReset={mockOnReset}
        />
      );

      const resetButton = screen.getByTestId('reset-button');
      expect(resetButton).toBeDisabled();
    });

    it('is enabled when elapsed time is greater than 0', () => {
      render(
        <StopwatchControls
          isRunning={false}
          elapsedTime={5000}
          onStartStop={mockOnStartStop}
          onReset={mockOnReset}
        />
      );

      const resetButton = screen.getByTestId('reset-button');
      expect(resetButton).not.toBeDisabled();
    });

    it('calls onReset when clicked and enabled', () => {
      render(
        <StopwatchControls
          isRunning={false}
          elapsedTime={5000}
          onStartStop={mockOnStartStop}
          onReset={mockOnReset}
        />
      );

      const resetButton = screen.getByTestId('reset-button');
      fireEvent.click(resetButton);

      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });
  });

  it('renders both buttons', () => {
    render(
      <StopwatchControls
        isRunning={false}
        elapsedTime={0}
        onStartStop={mockOnStartStop}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByTestId('start-stop-button')).toBeInTheDocument();
    expect(screen.getByTestId('reset-button')).toBeInTheDocument();
  });
});
