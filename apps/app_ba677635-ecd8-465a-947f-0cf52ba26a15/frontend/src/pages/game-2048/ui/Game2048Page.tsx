import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Container } from '@/shared/ui/container';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Keyboard, Smartphone } from 'lucide-react';

import { 
  GameGrid, 
  GameStats, 
  GameControls, 
  GameStatusOverlay, 
  useGameStore 
} from '@/features/game-2048';
import { useGame, useInitGame, type Game } from '@/entities/game';

export function Game2048Page() {
  const [showOverlay, setShowOverlay] = useState(false);
  
  const currentGameId = useGameStore(state => state.currentGameId);
  const showInstructions = useGameStore(state => state.showInstructions);
  const setCurrentGameId = useGameStore(state => state.setCurrentGameId);
  const setIsPlaying = useGameStore(state => state.setIsPlaying);
  const setShowInstructions = useGameStore(state => state.setShowInstructions);
  
  const initGame = useInitGame();
  const { data: game } = useGame(currentGameId || '');

  // Initialize game on mount
  useEffect(() => {
    if (!currentGameId) {
      initGame.mutate(undefined, {
        onSuccess: (newGame) => {
          setCurrentGameId(newGame.id);
          setIsPlaying(true);
        },
      });
    }
  }, [currentGameId, initGame, setCurrentGameId, setIsPlaying]);

  // Handle game status changes
  useEffect(() => {
    if (game && (game.status === 'won' || game.status === 'lost')) {
      if (!showOverlay) {
        setShowOverlay(true);
        setIsPlaying(false);
      }
    }
  }, [game, showOverlay, setIsPlaying]);

  const handleNewGame = (newGame: Game) => {
    setCurrentGameId(newGame.id);
    setIsPlaying(true);
    setShowOverlay(false);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    setIsPlaying(true); // Allow continuing after win
  };

  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

  if (!game && !initGame.isPending) {
    return (
      <Container className="py-8">
        <Alert>
          <AlertDescription>
            Failed to load game. Please refresh the page to try again.
          </AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>2048 Game</title>
      </Helmet>

      <Container className="py-8 space-y-8">
        {/* Hero Section */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">2048</h1>
          <p className="text-muted-foreground">
            Join the tiles, get to 2048!
          </p>
          <div className="text-sm text-muted-foreground">
            Use your arrow keys or swipe to move tiles
          </div>
        </div>

        {/* Game Stats */}
        {game && (
          <GameStats 
            score={game.score} 
            bestScore={game.bestScore} 
          />
        )}

        {/* Game Grid */}
        <div className="flex justify-center">
          {game ? (
            <GameGrid 
              grid={game.grid}
              gameId={game.id}
              gameStatus={game.status}
            />
          ) : (
            <div className="grid grid-cols-4 gap-2 p-4 bg-gray-300 rounded-lg shadow-lg max-w-md mx-auto">
              {Array.from({ length: 16 }, (_, i) => (
                <div 
                  key={i} 
                  className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          )}
        </div>

        {/* Game Controls */}
        <GameControls 
          gameId={game?.id}
          onNewGame={handleNewGame}
        />

        {/* Mobile Instructions */}
        <div className="md:hidden text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <Smartphone className="h-4 w-4" />
            Swipe to move tiles
          </div>
        </div>

        {/* Desktop Instructions */}
        <div className="hidden md:block text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <Keyboard className="h-4 w-4" />
            Use arrow keys to move tiles
          </div>
        </div>
      </Container>

      {/* Game Status Overlay */}
      {showOverlay && game && (game.status === 'won' || game.status === 'lost') && (
        <GameStatusOverlay
          status={game.status}
          score={game.score}
          onNewGame={() => {
            initGame.mutate(undefined, {
              onSuccess: handleNewGame,
            });
          }}
          onClose={handleCloseOverlay}
        />
      )}

      {/* Instructions Dialog */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to Play 2048</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Use your <strong>arrow keys</strong> (or swipe on mobile) to move the tiles. 
              When two tiles with the same number touch, they <strong>merge</strong> into one!
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Goal:</h4>
              <p>Create a tile with the number <strong>2048</strong> to win!</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Rules:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>New tiles appear after each move</li>
                <li>The game ends when you can't make any more moves</li>
                <li>You can continue playing after reaching 2048</li>
              </ul>
            </div>
            
            <Button onClick={handleCloseInstructions} className="w-full">
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}