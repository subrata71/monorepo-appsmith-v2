import { Button } from '@/shared/ui/button';
import { useResetGame, useInitGame } from '@/entities/game';
import { useGameStore } from '../model/gameStore';
import { RotateCcw, Play, HelpCircle } from 'lucide-react';

interface GameControlsProps {
  gameId?: string;
  onNewGame: () => void;
}

export function GameControls({ gameId, onNewGame }: GameControlsProps) {
  const resetGame = useResetGame();
  const initGame = useInitGame();
  const setShowInstructions = useGameStore(state => state.setShowInstructions);

  const handleNewGame = () => {
    initGame.mutate(undefined, {
      onSuccess: onNewGame,
    });
  };

  const handleResetGame = () => {
    if (gameId) {
      resetGame.mutate(gameId);
    }
  };

  const handleShowInstructions = () => {
    setShowInstructions(true);
  };

  return (
    <div className="flex gap-4 justify-center">
      <Button 
        onClick={handleNewGame}
        disabled={initGame.isPending}
        className="flex items-center gap-2"
      >
        <Play className="h-4 w-4" />
        New Game
      </Button>
      
      {gameId && (
        <Button 
          variant="outline"
          onClick={handleResetGame}
          disabled={resetGame.isPending}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      )}
      
      <Button 
        variant="ghost"
        onClick={handleShowInstructions}
        className="flex items-center gap-2"
      >
        <HelpCircle className="h-4 w-4" />
        Help
      </Button>
    </div>
  );
}