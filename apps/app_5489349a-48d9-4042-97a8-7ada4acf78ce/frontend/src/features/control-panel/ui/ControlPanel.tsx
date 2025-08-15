import React from 'react';
import { Button, Slider } from '@/shared/ui';
import { useVisualizationStore } from '@/entities/visualization';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

export const ControlPanel = React.memo(() => {
  const { 
    status, 
    animationSpeed, 
    array,
    currentStep,
    totalSteps,
    currentDescription,
    start, 
    pause,
    step, 
    reset, 
    setSpeed 
  } = useVisualizationStore();

  const handleStart = () => {
    start();
  };

  const handlePause = () => {
    pause();
  };

  const handleStep = () => {
    if (status === 'idle' || status === 'paused') {
      step();
    }
  };

  const handleReset = () => {
    reset();
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  const isDisabled = array.length === 0;
  const canStart = status === 'idle' || status === 'paused';
  const canPause = status === 'running';
  const canStep = (status === 'idle' || status === 'paused') && currentStep < totalSteps;
  const canReset = status !== 'idle' || currentStep > 0;

  const progressPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Control Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleStart}
          disabled={isDisabled || !canStart || status === 'completed'}
          className="flex items-center gap-2"
          variant={canStart ? 'default' : 'secondary'}
        >
          <Play className="h-4 w-4" />
          {status === 'paused' ? 'Resume' : 'Start'}
        </Button>

        <Button
          onClick={handlePause}
          disabled={!canPause}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Pause className="h-4 w-4" />
          Pause
        </Button>

        <Button
          onClick={handleStep}
          disabled={isDisabled || !canStep}
          variant="outline"
          className="flex items-center gap-2"
        >
          <SkipForward className="h-4 w-4" />
          Step
        </Button>

        <Button
          onClick={handleReset}
          disabled={!canReset}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Progress Display */}
      {totalSteps > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span className="text-muted-foreground">
              {currentStep} / {totalSteps}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Speed Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Animation Speed</label>
          <span className="text-sm text-muted-foreground">{animationSpeed.toFixed(1)}x</span>
        </div>
        
        <Slider
          value={[animationSpeed]}
          onValueChange={handleSpeedChange}
          min={0.2}
          max={3.0}
          step={0.1}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Slower</span>
          <span>Normal</span>
          <span>Faster</span>
        </div>
      </div>

      {/* Status and Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Status</span>
          <span className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
            status === 'idle' ? 'bg-gray-100 text-gray-700' :
            status === 'running' ? 'bg-blue-100 text-blue-700' :
            status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {status}
          </span>
        </div>
        
        {currentDescription && (
          <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
            {currentDescription}
          </div>
        )}
      </div>
    </div>
  );
});