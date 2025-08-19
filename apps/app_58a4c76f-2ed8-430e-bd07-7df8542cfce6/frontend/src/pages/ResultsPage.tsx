import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, useResultsUiStore, ROUTES } from '@/shared';
import { ResultsScoreWidget, ResultsRestartButtonWidget } from '@/widgets';

export const ResultsPage = React.memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const finalScore = useResultsUiStore(state => state.finalScore);
  const setFinalScore = useResultsUiStore(state => state.setFinalScore);

  useEffect(() => {
    // Get the score from navigation state if available
    const scoreFromState = location.state?.score;

    if (typeof scoreFromState === 'number') {
      setFinalScore(scoreFromState);
    } else if (finalScore === 0 && typeof scoreFromState !== 'number') {
      // If no score is provided and store is empty, redirect to home
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [location.state, setFinalScore, finalScore, navigate]);

  return (
    <Container className="flex-1 flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="max-w-2xl w-full space-y-12 text-center">
        <div className="space-y-8">
          <ResultsScoreWidget score={finalScore} />

          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              {finalScore > 5
                ? 'Excellent performance!'
                : finalScore > 2
                  ? 'Good job!'
                  : finalScore > 0
                    ? 'Not bad for a try!'
                    : "Don't give up - practice makes perfect!"}
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <ResultsRestartButtonWidget />
        </div>
      </div>
    </Container>
  );
});
