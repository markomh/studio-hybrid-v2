export type MazeAlgorithm = 'recursive-backtracker' | 'prim' | 'kruskal';

export type MazeCorner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'random';

export interface MazeCellWalls {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export interface MazeCell {
  x: number;
  y: number;
  walls: MazeCellWalls;
  visited?: boolean;
}

export interface MazeOptions {
  rows: number;
  cols: number;
  algorithm: MazeAlgorithm;
  seed: number;
  startCorner?: MazeCorner;
  finishCorner?: MazeCorner;
}

export interface GeneratedMaze {
  cells: MazeCell[][];
  solutionPath: [number, number][];
  start: [number, number];
  finish: [number, number];
}

export class MazeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MazeValidationError';
  }
}
