import { gameRepo } from '../repositories/game.repo.js';
import { Game, NewGame } from '../db/schema.js';
import { FastifyInstance } from 'fastify';

type Direction = 'up' | 'down' | 'left' | 'right';
type GameGrid = number[][];

export function makeGameService(app: FastifyInstance) {
  const repo = app.repositories.game ?? gameRepo(app.db as any);

  // 2048 Game Logic Functions
  const initializeGrid = (): GameGrid => {
    const grid: GameGrid = Array(4).fill(null).map(() => Array(4).fill(0));
    addRandomTile(grid);
    addRandomTile(grid);
    return grid;
  };

  const addRandomTile = (grid: GameGrid): void => {
    const emptyCells: Array<[number, number]> = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (grid[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const moveGrid = (grid: GameGrid, direction: Direction): { newGrid: GameGrid; score: number; moved: boolean } => {
    const newGrid = grid.map(row => [...row]);
    let score = 0;
    let moved = false;

    const move = (arr: number[]): { newArr: number[]; points: number; hasMoved: boolean } => {
      const filtered = arr.filter(val => val !== 0);
      const newArr: number[] = [];
      let points = 0;
      let hasMoved = false;

      for (let i = 0; i < filtered.length; i++) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          newArr.push(filtered[i] * 2);
          points += filtered[i] * 2;
          i++; // Skip the next element as it's merged
        } else {
          newArr.push(filtered[i]);
        }
      }

      while (newArr.length < 4) {
        newArr.push(0);
      }

      hasMoved = !arr.every((val, idx) => val === newArr[idx]);
      return { newArr, points, hasMoved };
    };

    switch (direction) {
      case 'left':
        for (let row = 0; row < 4; row++) {
          const { newArr, points, hasMoved } = move(newGrid[row]);
          newGrid[row] = newArr;
          score += points;
          if (hasMoved) moved = true;
        }
        break;
      case 'right':
        for (let row = 0; row < 4; row++) {
          const { newArr, points, hasMoved } = move(newGrid[row].reverse());
          newGrid[row] = newArr.reverse();
          score += points;
          if (hasMoved) moved = true;
        }
        break;
      case 'up':
        for (let col = 0; col < 4; col++) {
          const column = [newGrid[0][col], newGrid[1][col], newGrid[2][col], newGrid[3][col]];
          const { newArr, points, hasMoved } = move(column);
          for (let row = 0; row < 4; row++) {
            newGrid[row][col] = newArr[row];
          }
          score += points;
          if (hasMoved) moved = true;
        }
        break;
      case 'down':
        for (let col = 0; col < 4; col++) {
          const column = [newGrid[3][col], newGrid[2][col], newGrid[1][col], newGrid[0][col]];
          const { newArr, points, hasMoved } = move(column);
          for (let row = 0; row < 4; row++) {
            newGrid[3 - row][col] = newArr[row];
          }
          score += points;
          if (hasMoved) moved = true;
        }
        break;
    }

    return { newGrid, score, moved };
  };

  const checkWin = (grid: GameGrid): boolean => {
    return grid.some(row => row.some(cell => cell === 2048));
  };

  const checkGameOver = (grid: GameGrid): boolean => {
    // Check for empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (grid[row][col] === 0) return false;
      }
    }

    // Check for possible merges
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = grid[row][col];
        if (
          (row < 3 && grid[row + 1][col] === current) ||
          (col < 3 && grid[row][col + 1] === current)
        ) {
          return false;
        }
      }
    }

    return true;
  };

  return {
    list: () => repo.findAll(),

    async get(id: string) {
      const found = await repo.findById(id);
      if (!found) throw new Error('Game not found');
      return found;
    },

    async initGame(): Promise<Game> {
      const grid = initializeGrid();
      const newGame: NewGame = {
        grid: grid as any,
        score: 0,
        bestScore: 0,
        status: 'playing',
      };
      return repo.create(newGame);
    },

    async move(id: string, direction: Direction): Promise<Game> {
      const game = await this.get(id);
      if (game.status !== 'playing') {
        throw new Error('Game is not in playing state');
      }

      const { newGrid, score: moveScore, moved } = moveGrid(game.grid as GameGrid, direction);
      
      if (!moved) {
        return game; // No change, return current game
      }

      addRandomTile(newGrid);
      const newScore = game.score + moveScore;
      const newBestScore = Math.max(game.bestScore, newScore);

      let status = game.status;
      if (checkWin(newGrid) && game.status === 'playing') {
        status = 'won';
      } else if (checkGameOver(newGrid)) {
        status = 'lost';
      }

      return repo.update(id, {
        grid: newGrid as any,
        score: newScore,
        bestScore: newBestScore,
        status,
      });
    },

    async reset(id: string): Promise<Game> {
      const game = await this.get(id);
      const grid = initializeGrid();
      
      return repo.update(id, {
        grid: grid as any,
        score: 0,
        status: 'playing',
      });
    },

    getLeaderboard: (limit: number = 10) => repo.findTopScores(limit),
  };
}

export type GameService = ReturnType<typeof makeGameService>;