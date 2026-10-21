import { describe, it, expect } from 'vitest';
import {
  generateMaze,
  MAZE_ALGORITHMS,
  MazeValidationError,
} from '../src/puzzles/maze';

describe('Maze Generator Engine (F2-2 & F2-6)', () => {
  for (const algorithm of MAZE_ALGORITHMS) {
    it(`generates a perfect maze using algorithm "${algorithm}"`, () => {
      const rows = 10;
      const cols = 10;
      const result = generateMaze({
        rows,
        cols,
        algorithm,
        seed: 42,
      });

      expect(result.cells.length).toBe(rows);
      expect(result.cells[0].length).toBe(cols);

      // In a perfect maze of R*C cells, exactly R*C - 1 internal wall openings exist
      // Count total wall openings (each opened connection between 2 adjacent cells counts as 1 passage)
      let openPassages = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = result.cells[r][c];
          if (c + 1 < cols && !cell.walls.right) {
            openPassages++;
          }
          if (r + 1 < rows && !cell.walls.bottom) {
            openPassages++;
          }
        }
      }
      expect(openPassages).toBe(rows * cols - 1);

      // Verify solution path exists and connects start to finish
      expect(result.solutionPath.length).toBeGreaterThan(1);
      expect(result.solutionPath[0]).toEqual(result.start);
      expect(result.solutionPath[result.solutionPath.length - 1]).toEqual(result.finish);

      // Verify each step in solutionPath is contiguous without walls
      for (let i = 0; i < result.solutionPath.length - 1; i++) {
        const [r1, c1] = result.solutionPath[i];
        const [r2, c2] = result.solutionPath[i + 1];
        const dr = r2 - r1;
        const dc = c2 - c1;
        expect(Math.abs(dr) + Math.abs(dc)).toBe(1);

        const currentCell = result.cells[r1][c1];
        if (dr === 1) expect(currentCell.walls.bottom).toBe(false);
        if (dr === -1) expect(currentCell.walls.top).toBe(false);
        if (dc === 1) expect(currentCell.walls.right).toBe(false);
        if (dc === -1) expect(currentCell.walls.left).toBe(false);
      }
    });
  }

  it('generates identical mazes for identical seeds and handles seed 0 deterministically', () => {
    const resA = generateMaze({ rows: 8, cols: 8, algorithm: 'recursive-backtracker', seed: 555 });
    const resB = generateMaze({ rows: 8, cols: 8, algorithm: 'recursive-backtracker', seed: 555 });

    expect(resA.cells).toEqual(resB.cells);
    expect(resA.solutionPath).toEqual(resB.solutionPath);

    const resZero1 = generateMaze({ rows: 8, cols: 8, algorithm: 'prim', seed: 0 });
    const resZero2 = generateMaze({ rows: 8, cols: 8, algorithm: 'prim', seed: 0 });

    expect(resZero1.cells).toEqual(resZero2.cells);
    expect(resZero1.solutionPath).toEqual(resZero2.solutionPath);
  });

  it('throws typed MazeValidationError for out-of-bounds sizes', () => {
    expect(() =>
      generateMaze({ rows: 1, cols: 10, algorithm: 'recursive-backtracker', seed: 1 })
    ).toThrow(MazeValidationError);

    expect(() =>
      generateMaze({ rows: 10, cols: 61, algorithm: 'kruskal', seed: 1 })
    ).toThrow(MazeValidationError);
  });
});
