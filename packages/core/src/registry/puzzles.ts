import { PuzzleElement, Element } from '../schema';
import { newId } from '../ids';
import { deriveSeed } from '../puzzles/rng';
import { generateMaze, MazeOptions } from '../puzzles/maze';
import { generateWordSearch } from '../puzzles/wordsearch';
import { generateSudoku } from '../puzzles/sudoku';
import { generateWorksheet } from '../puzzles/worksheet';
import type { LayoutPrimitive } from '../layout';
import { DEFAULT_WORDSEARCH_THEMES } from '../puzzles/wordsearch';
import {
  Capabilities,
  ElementContext,
  ElementDefinition,
  PropertyField,
  PaletteEntry,
} from './types';

export const MIN_MAZE_CELL_MM = 3.5;
const MIN_CELL_MM = MIN_MAZE_CELL_MM;

// ==========================================
// Capabilities Matrix (DATA_MODEL.md lines 99-108)
// ==========================================

export const MAZE_CAPABILITIES: Capabilities = {
  rotate: false,
  flipH: false,
  opacity: false,
  typography: false,
  fill: false,
  stroke: true, // ya (dinding)
  engine: { label: 'Acak Labirin' },
  solutionKey: true,
};

export const WORDSEARCH_CAPABILITIES: Capabilities = {
  rotate: false,
  flipH: false,
  opacity: false,
  typography: false,
  fill: false,
  stroke: false,
  engine: { label: 'Acak Kisi' },
  solutionKey: true,
};

export const SUDOKU_CAPABILITIES: Capabilities = {
  rotate: false,
  flipH: false,
  opacity: false,
  typography: false,
  fill: false,
  stroke: false,
  engine: { label: 'Generate Baru' },
  solutionKey: true,
};

export const WORKSHEET_CAPABILITIES: Capabilities = {
  rotate: false,
  flipH: false,
  opacity: false,
  typography: false,
  fill: false,
  stroke: false,
  engine: { label: 'Acak Soal' },
  solutionKey: true,
};

export const IMAGE_CAPABILITIES: Capabilities = {
  rotate: true,
  flipH: true,
  opacity: true,
  typography: false,
  fill: false,
  stroke: false,
  engine: null,
  solutionKey: false,
};

export const SHAPE_CAPABILITIES: Capabilities = {
  rotate: true,
  flipH: true,
  opacity: true,
  typography: false,
  fill: true,
  stroke: true,
  engine: null,
  solutionKey: false,
};

// ==========================================
// Property Schemas & Cross-Field Validations
// ==========================================

export function validateMazeCrossField(el: unknown): string | null {
  const p = el as PuzzleElement;
  if (!p || p.type !== 'puzzle' || !p.params || p.params.kind !== 'maze') return null;
  const { rows, cols } = p.params;
  const cellSize = Math.min(p.w / cols, p.h / rows);
  if (cellSize < MIN_MAZE_CELL_MM) {
    return `Ukuran sel labirin (${cellSize.toFixed(1)} mm) di bawah batas minimum (${MIN_MAZE_CELL_MM} mm) untuk baris (${rows}) dan kolom (${cols}).`;
  }
  return null;
}

export function validateWordSearchCrossField(el: unknown): string | null {
  const p = el as PuzzleElement;
  if (!p || p.type !== 'puzzle' || !p.params || p.params.kind !== 'wordsearch') return null;
  const { size, words } = p.params;
  for (const word of words) {
    const clean = word.replace(/\s+/g, '');
    if (clean.length > size) {
      return `Kata "${word}" memiliki panjang ${clean.length} huruf yang melebihi ukuran kisi (${size}).`;
    }
  }
  return null;
}

export const MAZE_PROPERTY_SCHEMA: PropertyField[] = [
  {
    key: 'rows',
    labelKey: 'fields.mazeRows',
    kind: 'slider',
    group: 'basic',
    min: 2,
    max: 60,
    step: 1,
    validate: (_val, el) => validateMazeCrossField(el),
  },
  {
    key: 'cols',
    labelKey: 'fields.mazeCols',
    kind: 'slider',
    group: 'basic',
    min: 2,
    max: 60,
    step: 1,
    validate: (_val, el) => validateMazeCrossField(el),
  },
  {
    key: 'algorithm',
    labelKey: 'fields.mazeAlgorithm',
    kind: 'select',
    group: 'basic',
    options: [
      { value: 'recursive-backtracker', labelKey: 'maze.algorithm.recursiveBacktracker' },
      { value: 'prim', labelKey: 'maze.algorithm.prim' },
      { value: 'kruskal', labelKey: 'maze.algorithm.kruskal' },
    ],
  },
  {
    key: 'wallThicknessMm',
    labelKey: 'fields.wallThicknessMm',
    kind: 'slider',
    group: 'basic',
    unit: 'mm',
    min: 0.1,
    max: 5,
    step: 0.1,
  },
  {
    key: 'wallColor',
    labelKey: 'fields.wallColor',
    kind: 'color',
    group: 'basic',
  },
  {
    key: 'solutionColor',
    labelKey: 'fields.solutionColor',
    kind: 'color',
    group: 'advanced',
  },
];

export const WORDSEARCH_PROPERTY_SCHEMA: PropertyField[] = [
  {
    key: 'size',
    labelKey: 'fields.wordsearchSize',
    kind: 'slider',
    group: 'basic',
    min: 8,
    max: 20,
    step: 1,
    validate: (_val, el) => validateWordSearchCrossField(el),
  },
  {
    key: 'words',
    labelKey: 'fields.wordsearchWords',
    kind: 'textarea',
    group: 'basic',
    validate: (_val, el) => validateWordSearchCrossField(el),
  },
  {
    key: 'allowDiagonal',
    labelKey: 'fields.allowDiagonal',
    kind: 'switch',
    group: 'basic',
  },
  {
    key: 'allowReverse',
    labelKey: 'fields.allowReverse',
    kind: 'switch',
    group: 'basic',
  },
];

export const SUDOKU_PROPERTY_SCHEMA: PropertyField[] = [
  {
    key: 'difficulty',
    labelKey: 'fields.sudokuDifficulty',
    kind: 'select',
    group: 'basic',
    options: [
      { value: 'easy', labelKey: 'sudoku.difficulty.easy' },
      { value: 'medium', labelKey: 'sudoku.difficulty.medium' },
      { value: 'hard', labelKey: 'sudoku.difficulty.hard' },
    ],
  },
];

export const WORKSHEET_PROPERTY_SCHEMA: PropertyField[] = [
  {
    key: 'topic',
    labelKey: 'fields.worksheetTopic',
    kind: 'select',
    group: 'basic',
    options: [
      { value: 'addition', labelKey: 'worksheet.topic.addition' },
      { value: 'subtraction', labelKey: 'worksheet.topic.subtraction' },
      { value: 'multiplication', labelKey: 'worksheet.topic.multiplication' },
      { value: 'pattern', labelKey: 'worksheet.topic.pattern' },
    ],
  },
  {
    key: 'grade',
    labelKey: 'fields.worksheetGrade',
    kind: 'select',
    group: 'basic',
    min: 1,
    max: 6,
    options: [
      { value: '1', labelKey: 'worksheet.grade.1' },
      { value: '2', labelKey: 'worksheet.grade.2' },
      { value: '3', labelKey: 'worksheet.grade.3' },
      { value: '4', labelKey: 'worksheet.grade.4' },
      { value: '5', labelKey: 'worksheet.grade.5' },
      { value: '6', labelKey: 'worksheet.grade.6' },
    ],
  },
  {
    key: 'problemCount',
    labelKey: 'fields.worksheetProblemCount',
    kind: 'slider',
    group: 'basic',
    min: 1,
    max: 30,
    step: 1,
  },
];

// ==========================================
// createDefault Functions
// ==========================================

export function createDefaultMazeElement(ctx: ElementContext): PuzzleElement {
  const availW = Math.max(30, ctx.pageWidthMm - ctx.margins.leftMm - ctx.margins.rightMm);
  const availH = Math.max(30, ctx.pageHeightMm - ctx.margins.topMm - ctx.margins.bottomMm);
  const size = Math.min(120, availW, availH);
  const mazeParams = {
    kind: 'maze' as const,
    rows: 20,
    cols: 20,
    algorithm: 'recursive-backtracker' as const,
    wallThicknessMm: 0.5,
    wallColor: '#000000',
    solutionColor: '#2563eb',
  };

  return {
    id: newId(),
    type: 'puzzle',
    x: ctx.margins.leftMm,
    y: ctx.margins.topMm,
    w: size,
    h: size,
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    params: mazeParams,
    kind: mazeParams,
    seed: deriveSeed(1001, 'maze-default') || 1001,
    showSolution: false,
  };
}

export function createDefaultWordSearchElement(ctx: ElementContext): PuzzleElement {
  const availW = Math.max(30, ctx.pageWidthMm - ctx.margins.leftMm - ctx.margins.rightMm);
  const availH = Math.max(30, ctx.pageHeightMm - ctx.margins.topMm - ctx.margins.bottomMm);
  const size = Math.min(130, availW, availH);
  const defaultWords = [...DEFAULT_WORDSEARCH_THEMES[0].words.slice(0, 8)];
  const wsParams = {
    kind: 'wordsearch' as const,
    size: 12,
    words: defaultWords,
    allowDiagonal: true,
    allowReverse: false,
  };

  return {
    id: newId(),
    type: 'puzzle',
    x: ctx.margins.leftMm,
    y: ctx.margins.topMm,
    w: size,
    h: size,
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    params: wsParams,
    kind: wsParams,
    seed: deriveSeed(2002, 'wordsearch-default') || 2002,
    showSolution: false,
  };
}

export function createDefaultSudokuElement(ctx: ElementContext): PuzzleElement {
  const availW = Math.max(30, ctx.pageWidthMm - ctx.margins.leftMm - ctx.margins.rightMm);
  const availH = Math.max(30, ctx.pageHeightMm - ctx.margins.topMm - ctx.margins.bottomMm);
  const size = Math.min(120, availW, availH);
  const sudokuParams = {
    kind: 'sudoku' as const,
    difficulty: 'medium' as const,
  };

  return {
    id: newId(),
    type: 'puzzle',
    x: ctx.margins.leftMm,
    y: ctx.margins.topMm,
    w: size,
    h: size,
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    params: sudokuParams,
    kind: sudokuParams,
    seed: deriveSeed(3003, 'sudoku-default') || 3003,
    showSolution: false,
  };
}

export function createDefaultWorksheetElement(ctx: ElementContext): PuzzleElement {
  const availW = Math.max(30, ctx.pageWidthMm - ctx.margins.leftMm - ctx.margins.rightMm);
  const availH = Math.max(30, ctx.pageHeightMm - ctx.margins.topMm - ctx.margins.bottomMm);
  const worksheetParams = {
    kind: 'worksheet' as const,
    subject: 'math',
    topic: 'addition' as const,
    grade: 2 as const,
    problemCount: 12,
  };

  return {
    id: newId(),
    type: 'puzzle',
    x: ctx.margins.leftMm,
    y: ctx.margins.topMm,
    w: Math.min(140, availW),
    h: Math.min(180, availH),
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    params: worksheetParams,
    kind: worksheetParams,
    seed: deriveSeed(4004, 'worksheet-default') || 4004,
    showSolution: false,
  };
}

// ==========================================
// Palettes
// ==========================================

export const MAZE_PALETTE: PaletteEntry<PuzzleElement>[] = [
  {
    id: 'puzzle-maze',
    labelKey: 'palette.maze',
    descriptionKey: 'palette.mazeDesc',
    icon: 'Grid',
    keywords: ['labirin', 'maze', 'puzzle', 'permainan'],
    create: createDefaultMazeElement,
  },
];

export const WORDSEARCH_PALETTE: PaletteEntry<PuzzleElement>[] = [
  {
    id: 'puzzle-wordsearch',
    labelKey: 'palette.wordsearch',
    descriptionKey: 'palette.wordsearchDesc',
    icon: 'Search',
    keywords: ['kata', 'wordsearch', 'kisi', 'puzzle', 'cari kata'],
    create: createDefaultWordSearchElement,
  },
];

export const SUDOKU_PALETTE: PaletteEntry<PuzzleElement>[] = [
  {
    id: 'puzzle-sudoku',
    labelKey: 'palette.sudoku',
    descriptionKey: 'palette.sudokuDesc',
    icon: 'Hash',
    keywords: ['sudoku', 'angka', 'puzzle', 'logika'],
    create: createDefaultSudokuElement,
  },
];

export const WORKSHEET_PALETTE: PaletteEntry<PuzzleElement>[] = [
  {
    id: 'puzzle-worksheet',
    labelKey: 'palette.worksheet',
    descriptionKey: 'palette.worksheetDesc',
    icon: 'FileText',
    keywords: ['worksheet', 'matematika', 'soal', 'latihan'],
    create: createDefaultWorksheetElement,
  },
];

// ==========================================
// Layout Functions for Puzzles (F2-7)
// ==========================================

export function layoutMazeElement(el: PuzzleElement, ctx?: ElementContext): LayoutPrimitive[] {
  const params = el.params;
  if (!params || params.kind !== 'maze') return [];

  const {
    rows,
    cols,
    algorithm,
    wallThicknessMm = 0.5,
    wallColor = '#000000',
    solutionColor = '#2563eb',
    startIcon = 'S',
    finishIcon = 'F',
  } = params;
  const seed = el.seed ?? 123;

  const maze = generateMaze({
    rows,
    cols,
    algorithm: algorithm as MazeOptions['algorithm'],
    seed,
  });

  const cellSize = Math.min(el.w / cols, el.h / rows);
  if (cellSize < MIN_CELL_MM) {
    ctx?.warnings?.push(
      `Ukuran sel labirin (${cellSize.toFixed(1)} mm) di bawah batas minimum (${MIN_CELL_MM} mm).`
    );
  }

  const gridW = cols * cellSize;
  const gridH = rows * cellSize;
  const offsetX = el.x + (el.w - gridW) / 2;
  const offsetY = el.y + (el.h - gridH) / 2;

  const primitives: LayoutPrimitive[] = [];

  // Draw cells and walls
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = maze.cells[r][c];
      const cx = offsetX + c * cellSize;
      const cy = offsetY + r * cellSize;

      if (cell.walls.top) {
        primitives.push({
          kind: 'line',
          elementId: el.id,
          x1: cx,
          y1: cy,
          x2: cx + cellSize,
          y2: cy,
          stroke: wallColor,
          strokeWidth: wallThicknessMm,
        });
      }
      if (cell.walls.left) {
        primitives.push({
          kind: 'line',
          elementId: el.id,
          x1: cx,
          y1: cy,
          x2: cx,
          y2: cy + cellSize,
          stroke: wallColor,
          strokeWidth: wallThicknessMm,
        });
      }
      // Bottom outer wall for last row
      if (r === rows - 1 && cell.walls.bottom) {
        primitives.push({
          kind: 'line',
          elementId: el.id,
          x1: cx,
          y1: cy + cellSize,
          x2: cx + cellSize,
          y2: cy + cellSize,
          stroke: wallColor,
          strokeWidth: wallThicknessMm,
        });
      }
      // Right outer wall for last col
      if (c === cols - 1 && cell.walls.right) {
        primitives.push({
          kind: 'line',
          elementId: el.id,
          x1: cx + cellSize,
          y1: cy,
          x2: cx + cellSize,
          y2: cy + cellSize,
          stroke: wallColor,
          strokeWidth: wallThicknessMm,
        });
      }
    }
  }

  // Start & finish icons/markers
  if (startIcon) {
    const [sr, sc] = maze.start;
    primitives.push({
      kind: 'text',
      elementId: el.id,
      text: startIcon,
      x: offsetX + (sc + 0.5) * cellSize,
      y: offsetY + (sr + 0.68) * cellSize,
      widthMm: cellSize,
      fontSizePt: Math.min(10, Math.max(6, cellSize * 1.8)),
      fontFamily: 'sans',
      color: '#16a34a',
      align: 'center',
    });
  }
  if (finishIcon) {
    const [fr, fc] = maze.finish;
    primitives.push({
      kind: 'text',
      elementId: el.id,
      text: finishIcon,
      x: offsetX + (fc + 0.5) * cellSize,
      y: offsetY + (fr + 0.68) * cellSize,
      widthMm: cellSize,
      fontSizePt: Math.min(10, Math.max(6, cellSize * 1.8)),
      fontFamily: 'sans',
      color: '#dc2626',
      align: 'center',
    });
  }

  // Solution path if showSolution is true
  if (el.showSolution && maze.solutionPath.length > 0) {
    let d = '';
    for (let i = 0; i < maze.solutionPath.length; i++) {
      const [sr, sc] = maze.solutionPath[i];
      const px = offsetX + (sc + 0.5) * cellSize;
      const py = offsetY + (sr + 0.5) * cellSize;
      d += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
    }
    primitives.push({
      kind: 'path',
      elementId: el.id,
      d,
      stroke: solutionColor,
      strokeWidth: Math.max(0.75, cellSize * 0.25),
      fill: 'undefined',
    });
  }

  return primitives;
}

export function layoutWordSearchElement(el: PuzzleElement, ctx?: ElementContext): LayoutPrimitive[] {
  const params = el.params;
  if (!params || params.kind !== 'wordsearch') return [];

  const { size, words, allowDiagonal, allowReverse } = params;
  const seed = el.seed ?? 456;

  const ws = generateWordSearch({
    size,
    words: words && words.length > 0 ? words : ['PUZZLE'],
    allowDiagonal: !!allowDiagonal,
    allowReverse: !!allowReverse,
    seed,
  });

  const cellSize = Math.min(el.w / size, el.h / size);
  if (cellSize < MIN_CELL_MM) {
    ctx?.warnings?.push(
      `Ukuran sel wordsearch (${cellSize.toFixed(1)} mm) di bawah batas minimum (${MIN_CELL_MM} mm).`
    );
  }

  const gridW = size * cellSize;
  const gridH = size * cellSize;
  const offsetX = el.x + (el.w - gridW) / 2;
  const offsetY = el.y + (el.h - gridH) / 2;

  const primitives: LayoutPrimitive[] = [];

  // Solution markers (drawn first so letters remain legible on top)
  if (el.showSolution && ws.placements.length > 0) {
    for (const p of ws.placements) {
      const cleanWord = p.word.replace(/\s+/g, '');
      const len = cleanWord.length;
      if (len === 0) continue;

      const startX = offsetX + (p.col + 0.5) * cellSize;
      const startY = offsetY + (p.row + 0.5) * cellSize;
      const endCol = p.col + p.dir.dc * (len - 1);
      const endRow = p.row + p.dir.dr * (len - 1);
      const endX = offsetX + (endCol + 0.5) * cellSize;
      const endY = offsetY + (endRow + 0.5) * cellSize;

      primitives.push({
        kind: 'line',
        elementId: el.id,
        x1: startX,
        y1: startY,
        x2: endX,
        y2: endY,
        stroke: '#2563eb',
        strokeWidth: Math.max(1.5, cellSize * 0.7),
        opacity: 0.35,
      });
    }
  }

  // Letters per cell
  const fontSizePt = Math.min(14, cellSize * 2.5);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const char = ws.grid[r][c] || 'A';
      const cx = offsetX + (c + 0.5) * cellSize;
      // Baseline adjustment for centered text
      const cy = offsetY + (r + 0.65) * cellSize;

      primitives.push({
        kind: 'text',
        elementId: el.id,
        text: char,
        x: cx,
        y: cy,
        widthMm: cellSize,
        fontSizePt,
        fontFamily: 'sans',
        color: '#000000',
        align: 'center',
      });
    }
  }

  return primitives;
}

export function layoutSudokuElement(el: PuzzleElement, ctx?: ElementContext): LayoutPrimitive[] {
  const params = el.params;
  if (!params || params.kind !== 'sudoku') return [];

  const { difficulty } = params;
  const seed = el.seed ?? 789;

  const sudoku = generateSudoku({
    difficulty: (difficulty as 'easy' | 'medium' | 'hard') || 'medium',
    seed,
  });

  const cellSize = Math.min(el.w / 9, el.h / 9);
  if (cellSize < MIN_CELL_MM) {
    ctx?.warnings?.push(
      `Ukuran sel sudoku (${cellSize.toFixed(1)} mm) di bawah batas minimum (${MIN_CELL_MM} mm).`
    );
  }

  const board = el.showSolution ? sudoku.solution : sudoku.puzzle;
  const gridW = 9 * cellSize;
  const gridH = 9 * cellSize;
  const offsetX = el.x + (el.w - gridW) / 2;
  const offsetY = el.y + (el.h - gridH) / 2;

  const primitives: LayoutPrimitive[] = [];
  const fontSizePt = Math.min(16, cellSize * 2.8);

  // Draw 9x9 grid cells and 3x3 heavy boxes
  // 10 horizontal lines (4 heavy at r=0,3,6,9 and 6 thin)
  for (let r = 0; r <= 9; r++) {
    const isHeavyH = r % 3 === 0;
    primitives.push({
      kind: 'line',
      elementId: el.id,
      x1: offsetX,
      y1: offsetY + r * cellSize,
      x2: offsetX + gridW,
      y2: offsetY + r * cellSize,
      stroke: '#000000',
      strokeWidth: isHeavyH ? 1.0 : 0.3,
    });
  }

  // 10 vertical lines (4 heavy at c=0,3,6,9 and 6 thin)
  for (let c = 0; c <= 9; c++) {
    const isHeavyV = c % 3 === 0;
    primitives.push({
      kind: 'line',
      elementId: el.id,
      x1: offsetX + c * cellSize,
      y1: offsetY,
      x2: offsetX + c * cellSize,
      y2: offsetY + gridH,
      stroke: '#000000',
      strokeWidth: isHeavyV ? 1.0 : 0.3,
    });
  }

  // Render numbers
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val !== 0) {
        const cx = offsetX + (c + 0.5) * cellSize;
        const cy = offsetY + (r + 0.68) * cellSize;
        primitives.push({
          kind: 'text',
          elementId: el.id,
          text: String(val),
          x: cx,
          y: cy,
          widthMm: cellSize,
          fontSizePt,
          fontFamily: 'sans',
          color: '#000000',
          align: 'center',
        });
      }
    }
  }

  return primitives;
}

export function layoutWorksheetElement(el: PuzzleElement): LayoutPrimitive[] {
  const params = el.params;
  if (!params || params.kind !== 'worksheet') return [];

  const { topic, grade, problemCount } = params;
  const seed = el.seed ?? 999;

  const worksheet = generateWorksheet({
    topic: topic || 'addition',
    grade: grade || 2,
    problemCount: problemCount || 10,
    seed,
  });

  const primitives: LayoutPrimitive[] = [];
  const cols = problemCount > 15 ? 3 : problemCount > 8 ? 2 : 1;
  const rowsPerCol = Math.ceil(worksheet.problems.length / cols);
  const colWidth = el.w / cols;
  const rowHeight = el.h / Math.max(1, rowsPerCol);

  worksheet.problems.forEach((prob, idx) => {
    const col = Math.floor(idx / rowsPerCol);
    const row = idx % rowsPerCol;
    const px = el.x + col * colWidth + 2;
    const py = el.y + (row + 0.65) * rowHeight;
    const colAvailW = colWidth - 4;
    const promptWidth = colAvailW * 0.55;
    const lineX1 = px + promptWidth;
    const lineX2 = px + colAvailW;

    // 1. Nomor dan soal
    primitives.push({
      kind: 'text',
      elementId: el.id,
      text: `${idx + 1}. ${prob.prompt}`,
      x: px,
      y: py,
      widthMm: promptWidth,
      fontSizePt: Math.min(12, Math.max(8, rowHeight * 0.4 * 2.8)),
      fontFamily: 'sans',
      color: '#000000',
      align: 'left',
    });

    // 2. Garis jawaban
    primitives.push({
      kind: 'line',
      elementId: el.id,
      x1: lineX1,
      y1: py,
      x2: lineX2,
      y2: py,
      stroke: '#000000',
      strokeWidth: 0.3,
    });

    // 3. Jawaban saat showSolution = true
    if (el.showSolution) {
      primitives.push({
        kind: 'text',
        elementId: el.id,
        text: prob.answer,
        x: (lineX1 + lineX2) / 2,
        y: py - 0.5,
        widthMm: lineX2 - lineX1,
        fontSizePt: Math.min(12, Math.max(8, rowHeight * 0.4 * 2.8)),
        fontFamily: 'sans',
        color: '#2563eb',
        align: 'center',
      });
    }
  });

  return primitives;
}

// ==========================================
// Element Definitions
// ==========================================

export const mazeDefinition: ElementDefinition<PuzzleElement> = {
  type: 'maze' as unknown as PuzzleElement['type'],
  labelKey: 'elements.maze',
  capabilities: MAZE_CAPABILITIES,
  propertySchema: MAZE_PROPERTY_SCHEMA,
  palette: MAZE_PALETTE,
  createDefault: createDefaultMazeElement,
  layout: layoutMazeElement,
};

export const wordsearchDefinition: ElementDefinition<PuzzleElement> = {
  type: 'wordsearch' as unknown as PuzzleElement['type'],
  labelKey: 'elements.wordsearch',
  capabilities: WORDSEARCH_CAPABILITIES,
  propertySchema: WORDSEARCH_PROPERTY_SCHEMA,
  palette: WORDSEARCH_PALETTE,
  createDefault: createDefaultWordSearchElement,
  layout: layoutWordSearchElement,
};

export const sudokuDefinition: ElementDefinition<PuzzleElement> = {
  type: 'sudoku' as unknown as PuzzleElement['type'],
  labelKey: 'elements.sudoku',
  capabilities: SUDOKU_CAPABILITIES,
  propertySchema: SUDOKU_PROPERTY_SCHEMA,
  palette: SUDOKU_PALETTE,
  createDefault: createDefaultSudokuElement,
  layout: layoutSudokuElement,
};

export const worksheetDefinition: ElementDefinition<PuzzleElement> = {
  type: 'worksheet' as unknown as PuzzleElement['type'],
  labelKey: 'elements.worksheet',
  capabilities: WORKSHEET_CAPABILITIES,
  propertySchema: WORKSHEET_PROPERTY_SCHEMA,
  palette: WORKSHEET_PALETTE,
  createDefault: createDefaultWorksheetElement,
  layout: layoutWorksheetElement,
};

// Structural stubs for non-puzzle elements from DATA_MODEL.md capabilities table
export const imageDefinition: ElementDefinition<Element> = {
  type: 'image' as unknown as Element['type'],
  labelKey: 'elements.image',
  capabilities: IMAGE_CAPABILITIES,
  propertySchema: [],
  palette: [],
  createDefault: () =>
    ({
      id: newId(),
      type: 'image' as unknown as Element['type'],
      x: 10,
      y: 10,
      w: 50,
      h: 50,
      rotation: 0,
      opacity: 1,
      locked: false,
      hidden: false,
    } as unknown as Element),
  layout: () => [],
};

export const shapeDefinition: ElementDefinition<Element> = {
  type: 'shape' as unknown as Element['type'],
  labelKey: 'elements.shape',
  capabilities: SHAPE_CAPABILITIES,
  propertySchema: [],
  palette: [],
  createDefault: () =>
    ({
      id: newId(),
      type: 'shape' as unknown as Element['type'],
      x: 10,
      y: 10,
      w: 50,
      h: 50,
      rotation: 0,
      opacity: 1,
      locked: false,
      hidden: false,
    } as unknown as Element),
  layout: () => [],
};
