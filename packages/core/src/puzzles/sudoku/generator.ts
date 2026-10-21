import { createRng, Rng } from '../rng';
import { SudokuOptions, SudokuResult, CLUES } from './types';

/**
 * Counts the number of valid solutions for a 9x9 Sudoku grid up to `limit`.
 * Uses bitmask constraints with Minimum Remaining Values (MRV) heuristic.
 */
export function countSolutions(grid: number[][], limit = 2): number {
  const rowMask = new Uint16Array(9);
  const colMask = new Uint16Array(9);
  const boxMask = new Uint16Array(9);

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = grid[r][c];
      if (val !== 0) {
        const mask = 1 << val;
        rowMask[r] |= mask;
        colMask[c] |= mask;
        const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
        boxMask[b] |= mask;
      }
    }
  }

  let count = 0;

  function search(): void {
    if (count >= limit) return;

    let bestR = -1;
    let bestC = -1;
    let bestMask = 0;
    let minCandidates = 10;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
          const used = rowMask[r] | colMask[c] | boxMask[b];
          const available = (~used) & 0x3fe; // bits 1..9

          let num = 0;
          let temp = available;
          while (temp > 0) {
            temp &= temp - 1;
            num++;
          }

          if (num === 0) return; // Branch has no candidates, backtrack

          if (num < minCandidates) {
            minCandidates = num;
            bestR = r;
            bestC = c;
            bestMask = available;
            if (num === 1) break;
          }
        }
      }
      if (minCandidates === 1) break;
    }

    if (bestR === -1) {
      count++;
      return;
    }

    const b = Math.floor(bestR / 3) * 3 + Math.floor(bestC / 3);
    for (let d = 1; d <= 9; d++) {
      const mask = 1 << d;
      if (bestMask & mask) {
        grid[bestR][bestC] = d;
        rowMask[bestR] |= mask;
        colMask[bestC] |= mask;
        boxMask[b] |= mask;

        search();

        grid[bestR][bestC] = 0;
        rowMask[bestR] &= ~mask;
        colMask[bestC] &= ~mask;
        boxMask[b] &= ~mask;

        if (count >= limit) return;
      }
    }
  }

  search();
  return count;
}

/**
 * Generates a full, valid 9x9 Sudoku solution board using seeded backtracking.
 */
export function generateFullBoard(rng: Rng): number[][] {
  const board: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  const rowMask = new Uint16Array(9);
  const colMask = new Uint16Array(9);
  const boxMask = new Uint16Array(9);

  // 1. Fill the 3 independent diagonal 3x3 boxes (boxes 0, 4, 8)
  for (let box = 0; box < 9; box += 4) {
    const digits = rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let idx = 0;
    const startR = Math.floor(box / 3) * 3;
    const startC = (box % 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const d = digits[idx++];
        board[startR + r][startC + c] = d;
        const mask = 1 << d;
        rowMask[startR + r] |= mask;
        colMask[startC + c] |= mask;
        boxMask[box] |= mask;
      }
    }
  }

  // 2. Fill remaining empty cells with seeded backtracking
  function fillRemaining(r: number, c: number): boolean {
    if (r === 9) return true;
    const nextR = c === 8 ? r + 1 : r;
    const nextC = c === 8 ? 0 : c + 1;

    if (board[r][c] !== 0) {
      return fillRemaining(nextR, nextC);
    }

    const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    const used = rowMask[r] | colMask[c] | boxMask[b];
    const available = (~used) & 0x3fe;

    const digits: number[] = [];
    for (let d = 1; d <= 9; d++) {
      if (available & (1 << d)) {
        digits.push(d);
      }
    }

    const shuffled = rng.shuffle(digits);
    for (const d of shuffled) {
      const mask = 1 << d;
      board[r][c] = d;
      rowMask[r] |= mask;
      colMask[c] |= mask;
      boxMask[b] |= mask;

      if (fillRemaining(nextR, nextC)) return true;

      board[r][c] = 0;
      rowMask[r] &= ~mask;
      colMask[c] &= ~mask;
      boxMask[b] &= ~mask;
    }

    return false;
  }

  fillRemaining(0, 0);
  return board;
}

/**
 * Removes cells from a full board while guaranteeing a unique solution.
 */
function digHoles(
  fullBoard: number[][],
  rng: Rng,
  targetClues: number
): { puzzle: number[][]; actualClues: number } {
  let bestPuzzle: number[][] = fullBoard.map((row) => [...row]);
  let bestClues = 81;

  // Up to 3 attempts with different random position orders to reach target clues
  for (let attempt = 0; attempt < 3; attempt++) {
    const puzzle = fullBoard.map((row) => [...row]);
    const positions: [number, number][] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        positions.push([r, c]);
      }
    }
    const shuffled = rng.shuffle(positions);
    let clues = 81;

    for (const [r, c] of shuffled) {
      if (clues <= targetClues) break;
      const val = puzzle[r][c];
      puzzle[r][c] = 0;

      // Unique solution check: must have exactly 1 solution
      if (countSolutions(puzzle, 2) === 1) {
        clues--;
      } else {
        puzzle[r][c] = val; // Restore cell if uniqueness is lost
      }
    }

    if (clues < bestClues) {
      bestClues = clues;
      bestPuzzle = puzzle;
    }
    if (bestClues <= targetClues) break;
  }

  return { puzzle: bestPuzzle, actualClues: bestClues };
}

/**
 * Generates a valid 9x9 Sudoku puzzle with a unique solution and clue count according to difficulty.
 */
export function generateSudoku(options: SudokuOptions): SudokuResult {
  const { difficulty, seed } = options;

  if (difficulty !== 'easy' && difficulty !== 'medium' && difficulty !== 'hard') {
    throw new Error(`Tingkat kesulitan sudoku tidak valid: "${difficulty}". Pilihan: easy, medium, hard.`);
  }

  const targetClues = CLUES[difficulty];
  const rng = createRng(seed);

  const solution = generateFullBoard(rng);
  const { puzzle, actualClues } = digHoles(solution, rng, targetClues);

  return {
    puzzle,
    solution,
    difficulty,
    actualClues,
  };
}
