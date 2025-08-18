import { create } from 'zustand';
import type {
  TicTacToeGame,
  GameBoard,
  Player,
  GameStatus,
} from '@/entities/tictactoe';

interface TicTacToeGameState {
  game: TicTacToeGame;
  makeMove: (index: number) => void;
  resetGame: () => void;
  startNewGame: () => void;
}

const initialBoard: GameBoard = ['', '', '', '', '', '', '', '', ''];

const createInitialGame = (): TicTacToeGame => ({
  id: crypto.randomUUID(),
  board: initialBoard,
  currentPlayer: 'X' as Player,
  status: 'playing' as GameStatus,
  winner: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const checkWinner = (board: GameBoard): Player | null => {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }

  return null;
};

const isDraw = (board: GameBoard): boolean => {
  return board.every(cell => cell !== '') && !checkWinner(board);
};

export const useTicTacToeGameStore = create<TicTacToeGameState>(set => ({
  game: createInitialGame(),

  makeMove: (index: number) => {
    set(state => {
      // Don't allow moves if game is over or cell is occupied
      if (state.game.status !== 'playing' || state.game.board[index] !== '') {
        return state;
      }

      const newBoard = [...state.game.board] as GameBoard;
      newBoard[index] = state.game.currentPlayer;

      const winner = checkWinner(newBoard);
      const isDrawGame = isDraw(newBoard);

      let newStatus: GameStatus = 'playing';
      if (winner) {
        newStatus = winner === 'X' ? 'X-wins' : 'O-wins';
      } else if (isDrawGame) {
        newStatus = 'draw';
      }

      const newGame: TicTacToeGame = {
        ...state.game,
        board: newBoard,
        currentPlayer: state.game.currentPlayer === 'X' ? 'O' : 'X',
        status: newStatus,
        winner,
        updatedAt: new Date().toISOString(),
      };

      return { game: newGame };
    });
  },

  resetGame: () => {
    set(() => ({
      game: createInitialGame(),
    }));
  },

  startNewGame: () => {
    set(() => ({
      game: createInitialGame(),
    }));
  },
}));
