import { cn } from '@/shared/lib/utils';

interface GameTileProps {
  value: number;
  className?: string;
}

const getTileStyles = (value: number): string => {
  const baseStyles = 'flex items-center justify-center rounded-lg font-bold text-lg transition-all duration-200 ease-in-out';
  
  if (value === 0) {
    return cn(baseStyles, 'bg-gray-200 text-transparent');
  }
  
  const styles: Record<number, string> = {
    2: 'bg-gray-100 text-gray-700',
    4: 'bg-gray-200 text-gray-700',
    8: 'bg-orange-200 text-white',
    16: 'bg-orange-300 text-white',
    32: 'bg-orange-400 text-white',
    64: 'bg-orange-500 text-white',
    128: 'bg-yellow-400 text-white text-base',
    256: 'bg-yellow-500 text-white text-base',
    512: 'bg-yellow-600 text-white text-sm',
    1024: 'bg-red-400 text-white text-sm',
    2048: 'bg-red-500 text-white text-sm animate-pulse',
  };
  
  return cn(baseStyles, styles[value] || 'bg-red-600 text-white text-xs');
};

export function GameTile({ value, className }: GameTileProps) {
  return (
    <div className={cn(getTileStyles(value), className)}>
      {value > 0 && value.toLocaleString()}
    </div>
  );
}