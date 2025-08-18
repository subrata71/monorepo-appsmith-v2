import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Trophy, X } from 'lucide-react';

interface GameStatusOverlayProps {
  status: 'won' | 'lost';
  score: number;
  onNewGame: () => void;
  onClose: () => void;
}

export function GameStatusOverlay({ status, score, onNewGame, onClose }: GameStatusOverlayProps) {
  const isWin = status === 'won';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-8 max-w-md w-full mx-4 text-center">
        <div className="mb-6">
          {isWin ? (
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          ) : (
            <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
          )}
          
          <h2 className="text-3xl font-bold mb-2">
            {isWin ? 'You Win!' : 'Game Over'}
          </h2>
          
          <p className="text-muted-foreground mb-4">
            {isWin 
              ? 'Congratulations! You reached 2048!' 
              : 'No more moves available. Better luck next time!'
            }
          </p>
          
          <div className="text-lg font-semibold">
            Final Score: {score.toLocaleString()}
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button onClick={onNewGame} className="flex-1">
            Play Again
          </Button>
          
          {isWin && (
            <Button variant="outline" onClick={onClose} className="flex-1">
              Continue
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}