import React from 'react';
import { Container } from '@/shared';

export const GamePage = React.memo(() => {
  return (
    <Container className="flex-1 flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="max-w-2xl w-full space-y-12 text-center">
        <h1 className="text-4xl font-bold text-foreground">Game Screen</h1>
        <p className="text-lg text-muted-foreground">
          Tossing game will be implemented here.
        </p>
      </div>
    </Container>
  );
});
