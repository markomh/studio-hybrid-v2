import { describe, it, expect } from 'vitest';
import {
  layoutMazeElement,
  wordsearchDefinition,
  sudokuDefinition,
  worksheetDefinition,
} from '../src/registry/puzzles';
import { PuzzleElement } from '../src/schema';
import { generateMaze } from '../src/puzzles/maze';
import { generateWordSearch } from '../src/puzzles/wordsearch';
import { generateSudoku } from '../src/puzzles/sudoku';
import { generateWorksheet } from '../src/puzzles/worksheet';
import {
  PathPrimitive,
  LinePrimitive,
  TextLinePrimitive,
  layout,
  createDocument,
  MIN_CELL_MM,
} from '../src';

describe('Puzzle Layout Engine (F2-7)', () => {
  const sampleElement: PuzzleElement = {
    id: 'test-puzzle-1',
    type: 'puzzle',
    x: 10,
    y: 10,
    w: 100,
    h: 100,
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    seed: 12345,
    showSolution: false,
    params: {
      kind: 'maze',
      rows: 10,
      cols: 10,
      algorithm: 'recursive-backtracker',
      wallThicknessMm: 0.5,
      wallColor: '#000000',
      solutionColor: '#2563eb',
    },
  };

  it('layout.maze.test.ts: wall segments match closed/open walls and primitives stay within element box', () => {
    const primitives = layoutMazeElement(sampleElement);
    expect(primitives.length).toBeGreaterThan(0);

    const rows = 10;
    const cols = 10;
    const maze = generateMaze({ rows, cols, algorithm: 'recursive-backtracker', seed: 12345 });

    let expectedWallsCount = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = maze.cells[r][c];
        if (cell.walls.top) expectedWallsCount++;
        if (cell.walls.left) expectedWallsCount++;
        if (r === rows - 1 && cell.walls.bottom) expectedWallsCount++;
        if (c === cols - 1 && cell.walls.right) expectedWallsCount++;
      }
    }

    const linePrimitives = primitives.filter((p) => p.kind === 'line');
    expect(linePrimitives.length).toBe(expectedWallsCount);

    // Verify all primitives stay within element bounding box [x, y, x+w, y+h] (with tolerance 1e-6)
    for (const p of primitives) {
      if (p.kind === 'line') {
        const line = p as LinePrimitive;
        expect(line.x1).toBeGreaterThanOrEqual(sampleElement.x - 1e-6);
        expect(line.x1).toBeLessThanOrEqual(sampleElement.x + sampleElement.w + 1e-6);
        expect(line.y1).toBeGreaterThanOrEqual(sampleElement.y - 1e-6);
        expect(line.y1).toBeLessThanOrEqual(sampleElement.y + sampleElement.h + 1e-6);
        expect(line.x2).toBeGreaterThanOrEqual(sampleElement.x - 1e-6);
        expect(line.x2).toBeLessThanOrEqual(sampleElement.x + sampleElement.w + 1e-6);
        expect(line.y2).toBeGreaterThanOrEqual(sampleElement.y - 1e-6);
        expect(line.y2).toBeLessThanOrEqual(sampleElement.y + sampleElement.h + 1e-6);
      } else if (p.kind === 'text') {
        const text = p as TextLinePrimitive;
        expect(text.x).toBeGreaterThanOrEqual(sampleElement.x - 1e-6);
        expect(text.x).toBeLessThanOrEqual(sampleElement.x + sampleElement.w + 1e-6);
        expect(text.y).toBeGreaterThanOrEqual(sampleElement.y - 1e-6);
        expect(text.y).toBeLessThanOrEqual(sampleElement.y + sampleElement.h + 1e-6);
      }
    }

    // Verify start & finish markers are present
    const texts = primitives.filter((p) => p.kind === 'text') as TextLinePrimitive[];
    const startMarker = texts.find((t) => t.text === 'S');
    const finishMarker = texts.find((t) => t.text === 'F');
    expect(startMarker).toBeDefined();
    expect(finishMarker).toBeDefined();
  });

  it('showSolution = true adds exactly one solution Path, false has none', () => {
    const primitivesWithout = layoutMazeElement(sampleElement);
    expect(primitivesWithout.filter((p) => p.kind === 'path')).toHaveLength(0);

    const primitivesWith = layoutMazeElement({ ...sampleElement, showSolution: true });
    const paths = primitivesWith.filter((p) => p.kind === 'path');
    expect(paths).toHaveLength(1);
    expect(paths[0].kind).toBe('path');
    const pathPrim = paths[0] as PathPrimitive;
    expect(pathPrim.d).toContain('M ');
  });

  it('wordsearch layout produces size^2 text primitives matching grid, and solution marks placed words', () => {
    const size = 8;
    const wsElement: PuzzleElement = {
      ...sampleElement,
      params: {
        kind: 'wordsearch',
        size,
        words: ['KUCING', 'ANJING'],
        allowDiagonal: true,
        allowReverse: false,
      },
    };

    const def = wordsearchDefinition;
    const ctx = {
      pageWidthMm: 200,
      pageHeightMm: 200,
      margins: { topMm: 10, bottomMm: 10, leftMm: 10, rightMm: 10 },
    };
    const primitives = def.layout(wsElement, ctx);
    const textPrimitives = primitives.filter((p) => p.kind === 'text');
    expect(textPrimitives.length).toBe(size * size);

    const ws = generateWordSearch({
      size,
      words: ['KUCING', 'ANJING'],
      allowDiagonal: true,
      allowReverse: false,
      seed: 12345,
    });
    for (let i = 0; i < textPrimitives.length; i++) {
      const r = Math.floor(i / size);
      const c = i % size;
      const textPrim = textPrimitives[i] as TextLinePrimitive;
      expect(textPrim.text).toBe(ws.grid[r][c]);
    }

    // When showSolution = true, lines mark the words while text count remains exactly size^2
    const solvedPrimitives = def.layout({ ...wsElement, showSolution: true }, ctx);
    const solvedTexts = solvedPrimitives.filter((p) => p.kind === 'text');
    expect(solvedTexts.length).toBe(size * size);
    const solutionLines = solvedPrimitives.filter((p) => p.kind === 'line');
    expect(solutionLines.length).toBe(ws.placements.length);
  });

  it('sudoku layout has 4 heavy vertical and 4 heavy horizontal lines, and correct clues/solution numbers', () => {
    const sudokuElement: PuzzleElement = {
      ...sampleElement,
      params: {
        kind: 'sudoku',
        difficulty: 'medium',
      },
    };

    const def = sudokuDefinition;
    const primitives = def.layout(sudokuElement, {
      pageWidthMm: 200,
      pageHeightMm: 200,
      margins: { topMm: 10, bottomMm: 10, leftMm: 10, rightMm: 10 },
    });

    const lines = primitives.filter((p) => p.kind === 'line') as LinePrimitive[];
    expect(lines.length).toBe(20);

    const heavyHorizontal = lines.filter((l) => l.strokeWidth >= 1.0 && Math.abs(l.y1 - l.y2) < 1e-6);
    const heavyVertical = lines.filter((l) => l.strokeWidth >= 1.0 && Math.abs(l.x1 - l.x2) < 1e-6);
    expect(heavyHorizontal.length).toBe(4);
    expect(heavyVertical.length).toBe(4);

    const sudoku = generateSudoku({ difficulty: 'medium', seed: 12345 });
    let clueCount = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (sudoku.puzzle[r][c] !== 0) clueCount++;
      }
    }

    const texts = primitives.filter((p) => p.kind === 'text');
    expect(texts.length).toBe(clueCount);

    const solvedPrimitives = def.layout(
      { ...sudokuElement, showSolution: true },
      { pageWidthMm: 200, pageHeightMm: 200, margins: { topMm: 10, bottomMm: 10, leftMm: 10, rightMm: 10 } }
    );
    const solvedTexts = solvedPrimitives.filter((p) => p.kind === 'text');
    expect(solvedTexts.length).toBe(81);
  });

  it('worksheet layout generates problem prompts, answer lines, and solution answers', () => {
    const worksheetElement: PuzzleElement = {
      ...sampleElement,
      params: {
        kind: 'worksheet',
        subject: 'math',
        topic: 'addition',
        grade: 2,
        problemCount: 8,
      },
    };

    const def = worksheetDefinition;
    const ctx = {
      pageWidthMm: 200,
      pageHeightMm: 200,
      margins: { topMm: 10, bottomMm: 10, leftMm: 10, rightMm: 10 },
    };

    const primitives = def.layout(worksheetElement, ctx);
    const textPrimitives = primitives.filter((p) => p.kind === 'text') as TextLinePrimitive[];
    const linePrimitives = primitives.filter((p) => p.kind === 'line') as LinePrimitive[];

    // 8 problems -> 8 question prompts and 8 answer lines
    expect(textPrimitives.length).toBe(8);
    expect(linePrimitives.length).toBe(8);
    expect(textPrimitives[0].text).toMatch(/^1\.\s+/);

    // All primitives remain inside element bounds
    for (const p of linePrimitives) {
      expect(p.x1).toBeGreaterThanOrEqual(worksheetElement.x - 1e-6);
      expect(p.x2).toBeLessThanOrEqual(worksheetElement.x + worksheetElement.w + 1e-6);
      expect(p.y1).toBeGreaterThanOrEqual(worksheetElement.y - 1e-6);
      expect(p.y2).toBeLessThanOrEqual(worksheetElement.y + worksheetElement.h + 1e-6);
    }

    // When showSolution = true, answer texts are rendered
    const solvedPrimitives = def.layout({ ...worksheetElement, showSolution: true }, ctx);
    const solvedTexts = solvedPrimitives.filter((p) => p.kind === 'text');
    expect(solvedTexts.length).toBe(16); // 8 questions + 8 answers

    const wsData = generateWorksheet({
      topic: 'addition',
      grade: 2,
      problemCount: 8,
      seed: 12345,
    });
    const answerTexts = solvedTexts.map((t) => (t as TextLinePrimitive).text);
    for (const prob of wsData.problems) {
      expect(answerTexts).toContain(prob.answer);
    }
  });

  it('cell size below MIN_CELL_MM does not alter geometry but adds a warning in layout result', () => {
    // 50 rows in a 50mm box -> cellSize = 1mm < MIN_CELL_MM (3.5mm)
    const smallMazeElement: PuzzleElement = {
      ...sampleElement,
      w: 50,
      h: 50,
      params: {
        kind: 'maze',
        rows: 50,
        cols: 50,
        algorithm: 'recursive-backtracker',
        wallThicknessMm: 0.2,
        wallColor: '#000000',
        solutionColor: '#2563eb',
      },
    };

    const doc = createDocument('letter');
    doc.pages[0].elements = [smallMazeElement];

    const result = layout(doc, doc.pages[0].id);

    // Geometry is computed as expected (cellSize = 1 mm)
    const lines = result.primitives.filter(
      (p) => p.kind === 'line' && p.elementId === smallMazeElement.id
    ) as LinePrimitive[];
    expect(lines.length).toBeGreaterThan(0);
    // Wall line lengths match cell size (1 mm)
    const firstHorizontalLine = lines.find((l) => Math.abs(l.y1 - l.y2) < 1e-6);
    expect(firstHorizontalLine).toBeDefined();
    expect(Math.abs(firstHorizontalLine!.x2 - firstHorizontalLine!.x1)).toBeCloseTo(1.0, 3);

    // Warning is emitted
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings.some((w) => w.includes(`${MIN_CELL_MM}`))).toBe(true);
  });

  it('produces identical deterministic layouts on repeated calls', () => {
    const p1 = layoutMazeElement(sampleElement);
    const p2 = layoutMazeElement(sampleElement);
    expect(p1).toEqual(p2);

    const wsEl: PuzzleElement = {
      ...sampleElement,
      params: { kind: 'wordsearch', size: 10, words: ['TEST'], allowDiagonal: true, allowReverse: false },
    };
    expect(wordsearchDefinition.layout(wsEl, { pageWidthMm: 200, pageHeightMm: 200, margins: { topMm: 10, bottomMm: 10, leftMm: 10, rightMm: 10 } }))
      .toEqual(wordsearchDefinition.layout(wsEl, { pageWidthMm: 200, pageHeightMm: 200, margins: { topMm: 10, bottomMm: 10, leftMm: 10, rightMm: 10 } }));

    const sdkEl: PuzzleElement = {
      ...sampleElement,
      params: { kind: 'sudoku', difficulty: 'easy' },
    };
    expect(sudokuDefinition.layout(sdkEl, { pageWidthMm: 200, pageHeightMm: 200, margins: { topMm: 10, bottomMm: 10, leftMm: 10, rightMm: 10 } }))
      .toEqual(sudokuDefinition.layout(sdkEl, { pageWidthMm: 200, pageHeightMm: 200, margins: { topMm: 10, bottomMm: 10, leftMm: 10, rightMm: 10 } }));

    const wksEl: PuzzleElement = {
      ...sampleElement,
      params: { kind: 'worksheet', subject: 'math', topic: 'subtraction', grade: 2, problemCount: 6 },
    };
    expect(worksheetDefinition.layout(wksEl, { pageWidthMm: 200, pageHeightMm: 200, margins: { topMm: 10, bottomMm: 10, leftMm: 10, rightMm: 10 } }))
      .toEqual(worksheetDefinition.layout(wksEl, { pageWidthMm: 200, pageHeightMm: 200, margins: { topMm: 10, bottomMm: 10, leftMm: 10, rightMm: 10 } }));
  });
});
