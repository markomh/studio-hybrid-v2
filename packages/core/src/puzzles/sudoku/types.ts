export type SudokuDifficulty = 'easy' | 'medium' | 'hard';

export interface SudokuOptions {
  difficulty: SudokuDifficulty;
  seed: number;
}

export interface SudokuResult {
  puzzle: number[][];
  solution: number[][];
  difficulty: SudokuDifficulty;
  actualClues: number;
}

export const CLUES: Record<SudokuDifficulty, number> = {
  easy: 36,
  medium: 30,
  hard: 24,
};
