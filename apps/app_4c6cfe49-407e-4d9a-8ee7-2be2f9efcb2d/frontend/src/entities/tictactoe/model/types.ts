/**
 * TicTacToe game domain types
 */

export type CellValue = '' | 'X' | 'O';

export type GameBoard = [
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
];

export type GameStatus = 'playing' | 'X-wins' | 'O-wins' | 'draw';

export type Player = 'X' | 'O';

export interface TicTacToeGame {
  id: string;
  board: GameBoard;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  createdAt: string;
  updatedAt: string;
}

export interface CellProps {
  value: CellValue;
  onClick?: () => void;
  disabled?: boolean;
  index: number;
}

export interface BoardProps {
  board: GameBoard;
  onCellClick?: (index: number) => void;
  disabled?: boolean;
}
