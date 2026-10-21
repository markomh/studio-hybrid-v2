import { describe, it, expect } from 'vitest';
import {
  generateSudoku,
  CLUES,
  SudokuDifficulty,
} from '../src/puzzles/sudoku';

/**
 * Independent backtracking solver written inside the test suite to verify uniqueness.
 */
function solveIndependently(grid: number[][], maxSolutions = 2): number[][][] {
  const solutions: number[][][] = [];
  const b = grid.map((r) => [...r]);

  function isSafe(row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (b[row][i] === num || b[i][col] === num) return false;
    }
    const boxR = Math.floor(row / 3) * 3;
    const boxC = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (b[boxR + r][boxC + c] === num) return false;
      }
    }
    return true;
  }

  function search(): boolean {
    if (solutions.length >= maxSolutions) return true;

    // Pick first empty cell
    let emptyR = -1;
    let emptyC = -1;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (b[r][c] === 0) {
          emptyR = r;
          emptyC = c;
          break;
        }
      }
      if (emptyR !== -1) break;
    }

    if (emptyR === -1) {
      solutions.push(b.map((row) => [...row]));
      return solutions.length >= maxSolutions;
    }

    for (let num = 1; num <= 9; num++) {
      if (isSafe(emptyR, emptyC, num)) {
        b[emptyR][emptyC] = num;
        if (search() && solutions.length >= maxSolutions) return true;
        b[emptyR][emptyC] = 0;
      }
    }

    return false;
  }

  search();
  return solutions;
}

function isValidSudokuBoard(board: number[][]): boolean {
  if (board.length !== 9) return false;
  for (let r = 0; r < 9; r++) {
    if (board[r].length !== 9) return false;
    const rowDigits = new Set<number>();
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val < 1 || val > 9 || rowDigits.has(val)) return false;
      rowDigits.add(val);
    }
  }

  for (let c = 0; c < 9; c++) {
    const colDigits = new Set<number>();
    for (let r = 0; r < 9; r++) {
      const val = board[r][c];
      if (colDigits.has(val)) return false;
      colDigits.add(val);
    }
  }

  for (let box = 0; box < 9; box++) {
    const boxDigits = new Set<number>();
    const startR = Math.floor(box / 3) * 3;
    const startC = (box % 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const val = board[startR + r][startC + c];
        if (boxDigits.has(val)) return false;
        boxDigits.add(val);
      }
    }
  }

  return true;
}

describe('Sudoku Generator Engine (F2-4)', () => {
  it('validates solution board: every row, col, and 3x3 box contains digits 1-9 exactly once', () => {
    const result = generateSudoku({ difficulty: 'easy', seed: 42 });
    expect(isValidSudokuBoard(result.solution)).toBe(true);
  });

  it('guarantees puzzle is strictly consistent with solution (filled cells match)', () => {
    const result = generateSudoku({ difficulty: 'medium', seed: 99 });
    let nonZeroCount = 0;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const pVal = result.puzzle[r][c];
        const sVal = result.solution[r][c];
        if (pVal !== 0) {
          nonZeroCount++;
          expect(pVal).toBe(sVal);
        }
      }
    }

    expect(result.actualClues).toBe(nonZeroCount);
  });

  const difficulties: SudokuDifficulty[] = ['easy', 'medium', 'hard'];

  for (const diff of difficulties) {
    it(`verifies independent solver finds exactly 1 solution for 20 distinct seeds on "${diff}"`, () => {
      const clueCounts: number[] = [];

      for (let seed = 1; seed <= 20; seed++) {
        const result = generateSudoku({ difficulty: diff, seed });

        // Check solution validity
        expect(isValidSudokuBoard(result.solution)).toBe(true);

        // Check puzzle consistency
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (result.puzzle[r][c] !== 0) {
              expect(result.puzzle[r][c]).toBe(result.solution[r][c]);
            }
          }
        }

        // Independent solver verification: must find exactly 1 solution
        const independentSolutions = solveIndependently(result.puzzle, 2);
        expect(independentSolutions.length).toBe(1);
        expect(independentSolutions[0]).toEqual(result.solution);

        clueCounts.push(result.actualClues);
      }

      // Log clue counts summary for evidence
      // eslint-disable-next-line no-console
      console.log(`[Evidence] Actual clues summary for ${diff} (target ${CLUES[diff]}):`, clueCounts);

      // Check clue accuracy requirements
      const target = CLUES[diff];
      const exactMatches = clueCounts.filter((c) => c === target).length;
      expect(exactMatches).toBeGreaterThanOrEqual(18);

      for (const count of clueCounts) {
        expect(Math.abs(count - target)).toBeLessThanOrEqual(2);
      }
    });
  }

  it('handles seed 0 deterministically and produces identical puzzles for identical seeds', () => {
    const resA = generateSudoku({ difficulty: 'hard', seed: 1234 });
    const resB = generateSudoku({ difficulty: 'hard', seed: 1234 });

    expect(resA.puzzle).toEqual(resB.puzzle);
    expect(resA.solution).toEqual(resB.solution);
    expect(resA.actualClues).toBe(resB.actualClues);

    const resZero1 = generateSudoku({ difficulty: 'medium', seed: 0 });
    const resZero2 = generateSudoku({ difficulty: 'medium', seed: 0 });

    expect(resZero1.puzzle).toEqual(resZero2.puzzle);
    expect(resZero1.solution).toEqual(resZero2.solution);
    expect(isValidSudokuBoard(resZero1.solution)).toBe(true);
  });

  it('generates hard puzzles in <= 500 ms per puzzle (average of 20 seeds)', () => {
    const timings: number[] = [];

    for (let seed = 100; seed < 120; seed++) {
      const start = performance.now();
      generateSudoku({ difficulty: 'hard', seed });
      const duration = performance.now() - start;
      timings.push(duration);
    }

    const avgMs = timings.reduce((a, b) => a + b, 0) / timings.length;
    // eslint-disable-next-line no-console
    console.log(`[Evidence] Average generation time for hard: ${avgMs.toFixed(2)} ms`);

    expect(avgMs).toBeLessThanOrEqual(500);
  });
});
