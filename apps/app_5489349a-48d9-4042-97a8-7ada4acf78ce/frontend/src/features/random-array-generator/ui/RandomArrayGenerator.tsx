import React, { useCallback, useMemo } from 'react';
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';
import { useVisualizationStore } from '@/entities/visualization';
import { generateRandomArray } from '@/entities/visualization/lib/array-utils';
import { Shuffle } from 'lucide-react';

const ARRAY_SIZE_OPTIONS = Array.from({ length: 19 }, (_, i) => i + 2); // 2 to 20

export const RandomArrayGenerator = React.memo(() => {
  const arraySize = useVisualizationStore(state => state.arraySize);
  const setArraySize = useVisualizationStore(state => state.setArraySize);
  const setArray = useVisualizationStore(state => state.setArray);
  const setError = useVisualizationStore(state => state.setError);
  const status = useVisualizationStore(state => state.status);

  const handleArraySizeChange = useCallback(
    (value: string) => {
      const size = parseInt(value, 10);
      setArraySize(size);
    },
    [setArraySize]
  );

  const handleGenerateArray = useCallback(() => {
    try {
      const newArray = generateRandomArray(arraySize);
      setArray(newArray);
      setError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to generate array';
      setError(errorMessage);
    }
  }, [arraySize, setArray, setError]);

  const isDisabled = useMemo(() => status === 'running', [status]);

  return (
    <div className="space-y-2">
      <Label htmlFor="array-size-select">Random Array Generator</Label>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Label htmlFor="array-size-select" className="text-xs">
            Array Size
          </Label>
          <Select
            value={arraySize.toString()}
            onValueChange={handleArraySizeChange}
            disabled={isDisabled}
          >
            <SelectTrigger id="array-size-select" className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {ARRAY_SIZE_OPTIONS.map(size => (
                <SelectItem key={size} value={size.toString()}>
                  {size} numbers
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleGenerateArray}
          disabled={isDisabled}
          variant="outline"
          size="default"
          className="shrink-0"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Generate
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Generate a random array with numbers between 1 and 100
      </p>
    </div>
  );
});
