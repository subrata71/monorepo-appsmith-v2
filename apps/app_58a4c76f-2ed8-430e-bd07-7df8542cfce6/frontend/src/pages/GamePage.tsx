import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, ROUTES } from '@/shared';
import {
  GameTossButtonWidget,
  GameFeedbackWidget,
  GameScoreWidget,
} from '@/widgets';

export const GamePage = React.memo(() => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [outcome, setOutcome] = useState<'success' | 'failure'>('success');
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [score, setScore] = useState(0);

  const handleToss = useCallback(() => {
    // Simulate toss outcome (roughly 50% chance of success)
    const isSuccess = Math.random() > 0.5;

    setOutcome(isSuccess ? 'success' : 'failure');
    setFeedback(isSuccess ? 'Success!' : 'Try Again!');
    setFeedbackVisible(true);

    // Update score if successful
    if (isSuccess) {
      setScore(prev => prev + 1);
    }
  }, []);

  const handleEndGame = useCallback(() => {
    navigate(ROUTES.RESULTS, { state: { score } });
  }, [navigate, score]);

  // Auto-hide feedback after 1.5 seconds
  useEffect(() => {
    if (feedbackVisible) {
      const timer = setTimeout(() => {
        setFeedbackVisible(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [feedbackVisible]);

  return (
    <Container className="flex-1 flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="max-w-2xl w-full space-y-12 text-center">
        <h1 className="text-4xl font-bold text-foreground">Game Screen</h1>

        {/* Score Display */}
        <GameScoreWidget score={score} className="mb-8" />

        <p className="text-lg text-muted-foreground">
          Press the button below to toss!
        </p>

        {/* Feedback Display Area */}
        <GameFeedbackWidget
          feedback={feedback}
          outcome={outcome}
          visible={feedbackVisible}
          className="mb-8"
        />

        <div className="mt-16 space-y-6">
          <GameTossButtonWidget
            text="TOSS!"
            onToss={handleToss}
            ariaLabel="Press to simulate a toss"
          />
          
          <Button
            onClick={handleEndGame}
            variant="outline"
            size="lg"
            className="min-w-[160px]"
          >
            End Game
          </Button>
        </div>
      </div>
    </Container>
  );
});
