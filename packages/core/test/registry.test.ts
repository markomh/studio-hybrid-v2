import { describe, it, expect } from 'vitest';
import {
  createRegistry,
  registerElement,
  getDefinition,
  requireDefinition,
  listDefinitions,
  getElementDefinition,
  ElementDefinition,
  ElementDefinitionNotFoundError,
  DuplicateElementDefinitionError,
  textDefinition,
  mazeDefinition,
  wordsearchDefinition,
  sudokuDefinition,
  worksheetDefinition,
  validateMazeCrossField,
  validateWordSearchCrossField,
  MIN_MAZE_CELL_MM,
  ElementContext,
} from '../src/registry';
import { ElementSchema, MazeAlgorithmSchema, PuzzleElement } from '../src/schema';
import { MAZE_GENERATORS } from '../src/puzzles/maze';

describe('Element Registry Engine (F2-6)', () => {
  const dummyDef: ElementDefinition = {
    type: 'dummy' as unknown as Element['type'],
    labelKey: 'elements.dummy',
    capabilities: {
      rotate: true,
      flipH: false,
      opacity: false,
      typography: true,
      fill: false,
      stroke: false,
      engine: null,
      solutionKey: false,
    },
    propertySchema: [],
    palette: [],
    createDefault: () => ({
      id: 'dummy-1',
      type: 'text',
      x: 0,
      y: 0,
      w: 10,
      h: 10,
      rotation: 0,
      opacity: 1,
      locked: false,
      hidden: false,
      text: 'Dummy',
      fontFamily: 'sans',
      fontSizePt: 12,
      lineHeight: 1,
      letterSpacingPt: 0,
      bold: false,
      italic: false,
      underline: false,
      caps: false,
      align: 'left',
      color: '#000000',
    }),
    layout: () => [],
  };

  const sampleContext: ElementContext = {
    pageWidthMm: 215.9,
    pageHeightMm: 279.4,
    margins: { topMm: 12.7, bottomMm: 12.7, leftMm: 12.7, rightMm: 12.7 },
  };

  it('allows registering and retrieving definitions in an isolated registry', () => {
    const reg = createRegistry();
    expect(reg.listDefinitions()).toHaveLength(0);

    reg.registerElement(dummyDef);

    expect(reg.listDefinitions()).toHaveLength(1);
    expect(reg.getDefinition('dummy')).toBe(dummyDef);
    expect(reg.requireDefinition('dummy')).toBe(dummyDef);
  });

  it('rejects registering duplicate element types with DuplicateElementDefinitionError', () => {
    const reg = createRegistry();
    reg.registerElement(dummyDef);

    expect(() => reg.registerElement(dummyDef)).toThrow(DuplicateElementDefinitionError);
    expect(() => reg.registerElement(dummyDef)).toThrow(
      'Tipe elemen "dummy" sudah terdaftar di registry.'
    );
  });

  it('returns undefined for unknown type on getDefinition and throws ElementDefinitionNotFoundError on requireDefinition', () => {
    const reg = createRegistry();

    expect(reg.getDefinition('unknown-type')).toBeUndefined();
    expect(() => reg.requireDefinition('unknown-type')).toThrow(ElementDefinitionNotFoundError);
    expect(() => reg.requireDefinition('unknown-type')).toThrow(
      'Definisi elemen untuk tipe "unknown-type" tidak ditemukan di registry.'
    );
  });

  it('keeps createRegistry() instances strictly isolated from each other and the global registry', () => {
    const reg1 = createRegistry();
    const reg2 = createRegistry();

    reg1.registerElement(dummyDef);

    expect(reg1.getDefinition('dummy')).toBe(dummyDef);
    expect(reg2.getDefinition('dummy')).toBeUndefined();

    // Global registry has default definitions pre-registered
    expect(getDefinition('text')).toBeDefined();
    expect(getDefinition('text')).toBe(textDefinition);
    expect(listDefinitions().length).toBeGreaterThanOrEqual(5);

    // Global requireDefinition works
    expect(requireDefinition('text')).toBe(textDefinition);

    // Global registerElement rejects registering duplicate text definition
    expect(() => registerElement(textDefinition)).toThrow(DuplicateElementDefinitionError);
  });

  it('matches the capabilities matrix exactly with the table in DATA_MODEL.md', () => {
    const CAPABILITIES_FIXTURE_FROM_DATA_MODEL = [
      {
        type: 'text',
        rotate: true,
        flipH: false,
        opacity: false,
        typography: true,
        fill: false,
        stroke: false,
        engine: null,
        solutionKey: false,
      },
      {
        type: 'image',
        rotate: true,
        flipH: true,
        opacity: true,
        typography: false,
        fill: false,
        stroke: false,
        engine: null,
        solutionKey: false,
      },
      {
        type: 'shape',
        rotate: true,
        flipH: true,
        opacity: true,
        typography: false,
        fill: true,
        stroke: true,
        engine: null,
        solutionKey: false,
      },
      {
        type: 'maze',
        rotate: false,
        flipH: false,
        opacity: false,
        typography: false,
        fill: false,
        stroke: true,
        engine: { label: 'Acak Labirin' },
        solutionKey: true,
      },
      {
        type: 'wordsearch',
        rotate: false,
        flipH: false,
        opacity: false,
        typography: false,
        fill: false,
        stroke: false,
        engine: { label: 'Acak Kisi' },
        solutionKey: true,
      },
      {
        type: 'sudoku',
        rotate: false,
        flipH: false,
        opacity: false,
        typography: false,
        fill: false,
        stroke: false,
        engine: { label: 'Generate Baru' },
        solutionKey: true,
      },
      {
        type: 'worksheet',
        rotate: false,
        flipH: false,
        opacity: false,
        typography: false,
        fill: false,
        stroke: false,
        engine: { label: 'Acak Soal' },
        solutionKey: true,
      },
    ];

    for (const expected of CAPABILITIES_FIXTURE_FROM_DATA_MODEL) {
      const def = requireDefinition(expected.type);
      expect(def.capabilities).toEqual({
        rotate: expected.rotate,
        flipH: expected.flipH,
        opacity: expected.opacity,
        typography: expected.typography,
        fill: expected.fill,
        stroke: expected.stroke,
        engine: expected.engine,
        solutionKey: expected.solutionKey,
      });
    }
  });

  it('guarantees every algorithm in MazeAlgorithmSchema enum has a registered generator', () => {
    const algorithms = MazeAlgorithmSchema.options;
    expect(algorithms.length).toBeGreaterThanOrEqual(3);

    for (const algo of algorithms) {
      const generator = MAZE_GENERATORS[algo];
      expect(generator).toBeDefined();
      expect(typeof generator).toBe('function');
    }
  });

  it('validates every propertySchema has unique keys, min < max, and non-empty options', () => {
    const definitions = listDefinitions();

    for (const def of definitions) {
      const keys = def.propertySchema.map((field) => field.key);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);

      for (const field of def.propertySchema) {
        if (field.min !== undefined && field.max !== undefined) {
          expect(field.min).toBeLessThan(field.max);
        }

        if (field.options !== undefined) {
          expect(field.options.length).toBeGreaterThan(0);
          for (const opt of field.options) {
            expect(opt.value).toBeDefined();
            expect(opt.value.length).toBeGreaterThan(0);
            expect(opt.labelKey).toBeDefined();
            expect(opt.labelKey.length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it('produces valid elements from createDefault that pass schema validation and carry non-zero seeds', () => {
    const puzzleDefinitions = [
      mazeDefinition,
      wordsearchDefinition,
      sudokuDefinition,
      worksheetDefinition,
    ];

    for (const def of puzzleDefinitions) {
      const element = def.createDefault(sampleContext);

      // Must parse cleanly via Zod ElementSchema
      const parsed = ElementSchema.parse(element);
      expect(parsed).toBeDefined();

      const puzzle = element as PuzzleElement;
      expect(puzzle.type).toBe('puzzle');
      expect(typeof puzzle.seed).toBe('number');
      expect(puzzle.seed).not.toBe(0);
      expect(puzzle.showSolution).toBe(false);

      // Resolves definition correctly via getElementDefinition
      const resolvedDef = getElementDefinition(puzzle);
      expect(resolvedDef).toBe(def);
    }
  });

  it('performs cross-field validation: word exceeding grid size returns Indonesian message mentioning fields', () => {
    const validElement = wordsearchDefinition.createDefault(sampleContext);
    expect(validateWordSearchCrossField(validElement)).toBeNull();

    const invalidElement: PuzzleElement = {
      ...validElement,
      params: {
        kind: 'wordsearch',
        size: 10,
        words: ['KUCING', 'SUPERLONGWORDEXCEEDING'], // 22 chars > 10
        allowDiagonal: true,
        allowReverse: false,
      },
    };

    const errorMsg = validateWordSearchCrossField(invalidElement);
    expect(errorMsg).not.toBeNull();
    // Must mention word and grid size in Indonesian
    expect(errorMsg).toContain('SUPERLONGWORDEXCEEDING');
    expect(errorMsg?.toLowerCase()).toContain('ukuran kisi');
    expect(errorMsg?.toLowerCase()).toContain('kata');
  });

  it('performs cross-field validation: maze cell below minimum size returns Indonesian message mentioning fields', () => {
    const validElement = mazeDefinition.createDefault(sampleContext);
    expect(validateMazeCrossField(validElement)).toBeNull();

    // Box size 20mm x 20mm with 50 rows and 50 cols -> cell size = 0.4mm (< MIN_MAZE_CELL_MM = 3.5mm)
    const invalidElement: PuzzleElement = {
      ...validElement,
      w: 20,
      h: 20,
      params: {
        kind: 'maze',
        rows: 50,
        cols: 50,
        algorithm: 'recursive-backtracker',
        wallThicknessMm: 0.5,
        wallColor: '#000000',
        solutionColor: '#2563eb',
      },
    };

    const errorMsg = validateMazeCrossField(invalidElement);
    expect(errorMsg).not.toBeNull();
    // Must mention maze cell, rows, cols in Indonesian
    expect(errorMsg?.toLowerCase()).toContain('sel labirin');
    expect(errorMsg?.toLowerCase()).toContain('baris');
    expect(errorMsg?.toLowerCase()).toContain('kolom');
    expect(MIN_MAZE_CELL_MM).toBe(3.5);
  });
});
