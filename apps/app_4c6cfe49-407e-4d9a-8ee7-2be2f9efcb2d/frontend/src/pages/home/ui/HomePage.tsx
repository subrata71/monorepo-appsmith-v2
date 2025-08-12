import React from 'react';
import { Helmet } from 'react-helmet-async';
import { TicTacToeWidget } from '@/widgets/tic-tac-toe-game';

export const HomePage = React.memo(() => {
  return (
    <>
      <Helmet>
        <title>TicTacToe Game</title>
      </Helmet>

      <TicTacToeWidget />
    </>
  );
});
