import { describe, it, expect } from 'vitest';
import {
  generateWordSearch,
  normalizeWord,
  MAX_ATTEMPTS,
  DEFAULT_WORDSEARCH_THEMES,
} from '../src/puzzles/wordsearch';

describe('Word Search Generator Engine (F2-3)', () => {
  const sampleWords = ['KUCING', 'ANJING', 'KELINCI', 'GAJAH', 'HARIMAU', 'SINGA'];

  it('places words such that reading from (row, col) in direction dir produces the exact word', () => {
    const result = generateWordSearch({
      size: 12,
      words: sampleWords,
      allowDiagonal: true,
      allowReverse: true,
      seed: 42,
    });

    expect(result.placements.length).toBeGreaterThan(0);

    for (const placement of result.placements) {
      const { word, row, col, dir } = placement;
      const [dr, dc] = dir;
      let readWord = '';

      for (let i = 0; i < word.length; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        expect(r).toBeGreaterThanOrEqual(0);
        expect(r).toBeLessThan(12);
        expect(c).toBeGreaterThanOrEqual(0);
        expect(c).toBeLessThan(12);
        readWord += result.grid[r][c];
      }

      expect(readWord).toBe(word);
    }
  });

  it('enforces directional constraints: no diagonal when allowDiagonal=false, no reverse when allowReverse=false', () => {
    // 1. allowDiagonal = false, allowReverse = false -> only right ([0, 1]) and down ([1, 0])
    const noDiagNoRev = generateWordSearch({
      size: 14,
      words: sampleWords,
      allowDiagonal: false,
      allowReverse: false,
      seed: 101,
    });

    for (const p of noDiagNoRev.placements) {
      const [dr, dc] = p.dir;
      // No diagonal: at least one delta is 0
      expect(dr === 0 || dc === 0).toBe(true);
      // No reverse: no negative deltas
      expect(dr).toBeGreaterThanOrEqual(0);
      expect(dc).toBeGreaterThanOrEqual(0);
      expect(p.dir.isDiagonal).toBe(false);
      expect(p.dir.isReverse).toBe(false);
    }

    // 2. allowDiagonal = true, allowReverse = false -> no negative deltas except up-right [-1, 1] which is reverse in row
    // When allowReverse = false: directions are [0, 1], [1, 0], [1, 1], [-1, 1] (or only forward directions)
    const diagNoRev = generateWordSearch({
      size: 14,
      words: sampleWords,
      allowDiagonal: true,
      allowReverse: false,
      seed: 202,
    });

    for (const p of diagNoRev.placements) {
      // Directions when allowReverse is false must not include reverse left [0, -1], reverse up [-1, 0], or reverse diagonals [-1, -1], [1, -1]
      expect(p.dir.name).not.toBe('left');
      expect(p.dir.name).not.toBe('up');
      expect(p.dir.name).not.toBe('up-left');
      expect(p.dir.name).not.toBe('down-left');
    }

    // 3. allowDiagonal = false, allowReverse = true -> directions: right, down, left, up (no diagonals)
    const noDiagRev = generateWordSearch({
      size: 14,
      words: sampleWords,
      allowDiagonal: false,
      allowReverse: true,
      seed: 303,
    });

    for (const p of noDiagRev.placements) {
      expect(p.dir.isDiagonal).toBe(false);
      expect(p.dir[0] === 0 || p.dir[1] === 0).toBe(true);
    }
  });

  it('produces identical grids and placements for identical seeds, and handles seed 0 deterministically', () => {
    const seed = 98765;
    const resA = generateWordSearch({
      size: 10,
      words: sampleWords,
      allowDiagonal: true,
      allowReverse: true,
      seed,
    });

    const resB = generateWordSearch({
      size: 10,
      words: sampleWords,
      allowDiagonal: true,
      allowReverse: true,
      seed,
    });

    expect(resA.grid).toEqual(resB.grid);
    expect(resA.placements).toEqual(resB.placements);
    expect(resA.skipped).toEqual(resB.skipped);

    // Seed 0 test
    const resZero1 = generateWordSearch({
      size: 10,
      words: sampleWords,
      allowDiagonal: false,
      allowReverse: false,
      seed: 0,
    });
    const resZero2 = generateWordSearch({
      size: 10,
      words: sampleWords,
      allowDiagonal: false,
      allowReverse: false,
      seed: 0,
    });

    expect(resZero1.grid).toEqual(resZero2.grid);
    expect(resZero1.placements).toEqual(resZero2.placements);
    expect(resZero1.grid.length).toBe(10);
    expect(resZero1.grid[0].length).toBe(10);
  });

  it('normalizes words (uppercase, spaces, diacritics) and rejects characters outside A-Z', () => {
    expect(normalizeWord('café au lait')).toBe('CAFEAULAIT');
    expect(normalizeWord('kucing   imut')).toBe('KUCINGIMUT');

    const result = generateWordSearch({
      size: 12,
      words: ['kucing', 'Kucing', 'KUCING', 'Café', '123BAD', 'PUZZLE#9'],
      allowDiagonal: false,
      allowReverse: false,
      seed: 77,
    });

    // '123BAD' and 'PUZZLE#9' contain non-A-Z characters -> skipped with 'invalid_chars'
    expect(result.skipped).toContainEqual({ word: '123BAD', reason: 'invalid_chars' });
    expect(result.skipped).toContainEqual({ word: 'PUZZLE#9', reason: 'invalid_chars' });

    // 'Kucing' and 'KUCING' are duplicates of 'kucing' -> skipped with 'duplicate'
    const duplicates = result.skipped.filter((s) => s.reason === 'duplicate');
    expect(duplicates.length).toBe(2);

    // 'Café' normalized to CAFE and placed successfully
    const cafePlacement = result.placements.find((p) => p.word === 'CAFE');
    expect(cafePlacement).toBeDefined();
  });

  it('skips words longer than grid size with reason too_long and duplicate words with duplicate', () => {
    const result = generateWordSearch({
      size: 8,
      words: [
        'SEMBILANHURUF', // length 13 > 8
        'HARIMAU',
        'HARIMAU',      // duplicate
        'SINGA',
      ],
      allowDiagonal: false,
      allowReverse: false,
      seed: 88,
    });

    expect(result.skipped).toContainEqual({ word: 'SEMBILANHURUF', reason: 'too_long' });
    expect(result.skipped).toContainEqual({ word: 'HARIMAU', reason: 'duplicate' });
  });

  it('marks words that cannot fit as no_space without looping indefinitely (< 1s limit)', () => {
    // Pack a tiny 8x8 grid with many long words that cannot all fit without conflict
    const crowdedWords = [
      'ABCDEFGH',
      'BCDEFGHA',
      'CDEFGHA',
      'DEFGHIJ',
      'EFGHIJK',
      'FGHIJKL',
      'GHIJKLM',
      'HIJKLMN',
      'IJKLMNO',
      'JKLMNOP',
    ];

    const startTime = performance.now();
    const result = generateWordSearch({
      size: 8,
      words: crowdedWords,
      allowDiagonal: false,
      allowReverse: false,
      seed: 999,
    });
    const durationMs = performance.now() - startTime;

    expect(durationMs).toBeLessThan(1000); // Must complete within 1 second

    const noSpace = result.skipped.filter((s) => s.reason === 'no_space');
    expect(noSpace.length).toBeGreaterThan(0);
    expect(MAX_ATTEMPTS).toBe(150);
  });

  it('contains zero empty cells in the generated grid, and validates size between 8 and 20', () => {
    const sizes = [8, 10, 15, 20];

    for (const size of sizes) {
      const result = generateWordSearch({
        size,
        words: sampleWords,
        allowDiagonal: true,
        allowReverse: true,
        seed: 1234,
      });

      expect(result.grid.length).toBe(size);
      for (let r = 0; r < size; r++) {
        expect(result.grid[r].length).toBe(size);
        for (let c = 0; c < size; c++) {
          const char = result.grid[r][c];
          expect(char).toBeDefined();
          expect(char.length).toBe(1);
          expect(/^[A-Z]$/.test(char)).toBe(true);
        }
      }
    }

    // Invalid sizes throw Error
    expect(() =>
      generateWordSearch({
        size: 7,
        words: sampleWords,
        allowDiagonal: false,
        allowReverse: false,
        seed: 1,
      })
    ).toThrow('Ukuran kisi word search harus antara 8 dan 20');

    expect(() =>
      generateWordSearch({
        size: 21,
        words: sampleWords,
        allowDiagonal: false,
        allowReverse: false,
        seed: 1,
      })
    ).toThrow('Ukuran kisi word search harus antara 8 dan 20');
  });

  it('provides default themes with at least 5 themes and 12 words each', () => {
    expect(DEFAULT_WORDSEARCH_THEMES.length).toBeGreaterThanOrEqual(5);

    for (const theme of DEFAULT_WORDSEARCH_THEMES) {
      expect(theme.id).toBeDefined();
      expect(theme.name).toBeDefined();
      expect(theme.words.length).toBeGreaterThanOrEqual(12);

      for (const word of theme.words) {
        expect(/^[A-Z]+$/.test(word)).toBe(true);
        expect(word.length).toBeGreaterThanOrEqual(2);
      }
    }
  });
});
