import { createRng, Rng, deriveSeed } from '../rng';
import {
  GeneratedMaze,
  MazeAlgorithm,
  MazeCell,
  MazeCorner,
  MazeOptions,
  MazeValidationError,
} from './types';

export const MAZE_ALGORITHMS: readonly MazeAlgorithm[] = [
  'recursive-backtracker',
  'prim',
  'kruskal',
] as const;

function createEmptyGrid(rows: number, cols: number): MazeCell[][] {
  const cells: MazeCell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: MazeCell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        x: c,
        y: r,
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false,
      });
    }
    cells.push(row);
  }
  return cells;
}

const DIRECTIONS = [
  { dr: -1, dc: 0, wall: 'top', oppWall: 'bottom' },
  { dr: 0, dc: 1, wall: 'right', oppWall: 'left' },
  { dr: 1, dc: 0, wall: 'bottom', oppWall: 'top' },
  { dr: 0, dc: -1, wall: 'left', oppWall: 'right' },
] as const;

function generateRecursiveBacktracker(cells: MazeCell[][], rows: number, cols: number, rng: Rng): void {
  const stack: [number, number][] = [];
  cells[0][0].visited = true;
  stack.push([0, 0]);

  while (stack.length > 0) {
    const [cr, cc] = stack[stack.length - 1];
    const neighbors: { r: number; c: number; dirIdx: number }[] = [];

    for (let i = 0; i < DIRECTIONS.length; i++) {
      const nr = cr + DIRECTIONS[i].dr;
      const nc = cc + DIRECTIONS[i].dc;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !cells[nr][nc].visited) {
        neighbors.push({ r: nr, c: nc, dirIdx: i });
      }
    }

    if (neighbors.length > 0) {
      const chosen = rng.pick(neighbors);
      const dir = DIRECTIONS[chosen.dirIdx];

      cells[cr][cc].walls[dir.wall] = false;
      cells[chosen.r][chosen.c].walls[dir.oppWall] = false;

      cells[chosen.r][chosen.c].visited = true;
      stack.push([chosen.r, chosen.c]);
    } else {
      stack.pop();
    }
  }
}

function generatePrim(cells: MazeCell[][], rows: number, cols: number, rng: Rng): void {
  const inMaze: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  interface WallEntry {
    r1: number;
    c1: number;
    r2: number;
    c2: number;
    dirIdx: number;
  }
  const walls: WallEntry[] = [];

  function addCellWalls(r: number, c: number): void {
    inMaze[r][c] = true;
    for (let i = 0; i < DIRECTIONS.length; i++) {
      const nr = r + DIRECTIONS[i].dr;
      const nc = c + DIRECTIONS[i].dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !inMaze[nr][nc]) {
        walls.push({ r1: r, c1: c, r2: nr, c2: nc, dirIdx: i });
      }
    }
  }

  addCellWalls(0, 0);

  while (walls.length > 0) {
    const idx = rng.int(0, walls.length - 1);
    const wall = walls[idx];
    walls[idx] = walls[walls.length - 1];
    walls.pop();

    if (!inMaze[wall.r2][wall.c2]) {
      const dir = DIRECTIONS[wall.dirIdx];
      cells[wall.r1][wall.c1].walls[dir.wall] = false;
      cells[wall.r2][wall.c2].walls[dir.oppWall] = false;
      addCellWalls(wall.r2, wall.c2);
    }
  }
}

function generateKruskal(cells: MazeCell[][], rows: number, cols: number, rng: Rng): void {
  const total = rows * cols;
  const parent = new Int32Array(total);
  for (let i = 0; i < total; i++) parent[i] = i;

  function find(i: number): number {
    let root = i;
    while (root !== parent[root]) root = parent[root];
    let curr = i;
    while (curr !== root) {
      const next = parent[curr];
      parent[curr] = root;
      curr = next;
    }
    return root;
  }

  function union(i: number, j: number): boolean {
    const ri = find(i);
    const rj = find(j);
    if (ri !== rj) {
      parent[ri] = rj;
      return true;
    }
    return false;
  }

  interface Edge {
    r1: number;
    c1: number;
    r2: number;
    c2: number;
    dirIdx: number;
  }

  const allEdges: Edge[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Right edge
      if (c + 1 < cols) {
        allEdges.push({ r1: r, c1: c, r2: r, c2: c + 1, dirIdx: 1 });
      }
      // Bottom edge
      if (r + 1 < rows) {
        allEdges.push({ r1: r, c1: c, r2: r + 1, c2: c, dirIdx: 2 });
      }
    }
  }

  const shuffled = rng.shuffle(allEdges);

  for (const edge of shuffled) {
    const id1 = edge.r1 * cols + edge.c1;
    const id2 = edge.r2 * cols + edge.c2;

    if (union(id1, id2)) {
      const dir = DIRECTIONS[edge.dirIdx];
      cells[edge.r1][edge.c1].walls[dir.wall] = false;
      cells[edge.r2][edge.c2].walls[dir.oppWall] = false;
    }
  }
}

export function solveMazeBFS(
  cells: MazeCell[][],
  start: [number, number],
  end: [number, number]
): [number, number][] {
  const rows = cells.length;
  const cols = cells[0].length;
  const queue: [number, number][] = [start];
  const visited = new Set<string>();
  const parent = new Map<string, [number, number]>();

  const startKey = `${start[0]},${start[1]}`;
  visited.add(startKey);

  while (queue.length > 0) {
    const [cr, cc] = queue.shift()!;
    if (cr === end[0] && cc === end[1]) {
      const path: [number, number][] = [];
      let curr: [number, number] | undefined = end;
      while (curr) {
        path.push(curr);
        const k = `${curr[0]},${curr[1]}`;
        curr = parent.get(k);
      }
      return path.reverse();
    }

    const currentCell = cells[cr][cc];

    for (const dir of DIRECTIONS) {
      const hasWall = currentCell.walls[dir.wall];
      if (!hasWall) {
        const nr = cr + dir.dr;
        const nc = cc + dir.dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const key = `${nr},${nc}`;
          if (!visited.has(key)) {
            visited.add(key);
            parent.set(key, [cr, cc]);
            queue.push([nr, nc]);
          }
        }
      }
    }
  }

  return [];
}

function resolveCorner(
  corner: MazeCorner | undefined,
  rows: number,
  cols: number,
  rng: Rng,
  isStart: boolean
): [number, number] {
  if (!corner) {
    return isStart ? [0, 0] : [rows - 1, cols - 1];
  }

  switch (corner) {
    case 'topLeft':
      return [0, 0];
    case 'topRight':
      return [0, cols - 1];
    case 'bottomLeft':
      return [rows - 1, 0];
    case 'bottomRight':
      return [rows - 1, cols - 1];
    case 'random': {
      const corners: [number, number][] = [
        [0, 0],
        [0, cols - 1],
        [rows - 1, 0],
        [rows - 1, cols - 1],
      ];
      return rng.pick(corners);
    }
  }
}

export const MAZE_GENERATORS: Record<MazeAlgorithm, (cells: MazeCell[][], rows: number, cols: number, rng: Rng) => void> = {
  'recursive-backtracker': generateRecursiveBacktracker,
  'prim': generatePrim,
  'kruskal': generateKruskal,
};

export function generateMaze(options: MazeOptions): GeneratedMaze {
  const { rows, cols, algorithm, seed, startCorner, finishCorner } = options;

  if (!Number.isInteger(rows) || rows < 2 || rows > 60) {
    throw new MazeValidationError(`Jumlah baris labirin harus antara 2 dan 60, diterima: ${rows}.`);
  }
  if (!Number.isInteger(cols) || cols < 2 || cols > 60) {
    throw new MazeValidationError(`Jumlah kolom labirin harus antara 2 dan 60, diterima: ${cols}.`);
  }

  const generator = MAZE_GENERATORS[algorithm];
  if (!generator) {
    throw new MazeValidationError(`Algoritma labirin tidak valid: "${algorithm}".`);
  }

  const rng = createRng(seed);
  const cells = createEmptyGrid(rows, cols);

  generator(cells, rows, cols, rng);

  const cornerRng = createRng(deriveSeed(seed, 'corners'));
  const start = resolveCorner(startCorner, rows, cols, cornerRng, true);
  const finish = resolveCorner(finishCorner, rows, cols, cornerRng, false);

  const solutionPath = solveMazeBFS(cells, start, finish);

  return {
    cells,
    solutionPath,
    start,
    finish,
  };
}
