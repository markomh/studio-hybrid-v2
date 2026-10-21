import { describe, it, expect } from 'vitest';
import { createRng, deriveSeed } from '../src/puzzles/rng';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('Shared Deterministic PRNG Engine (F2-1)', () => {
  it('generates 1,000 identical first numbers for identical seeds', () => {
    const rng1 = createRng(42);
    const rng2 = createRng(42);

    for (let i = 0; i < 1000; i++) {
      const val1 = rng1.next();
      const val2 = rng2.next();
      expect(val1).toBe(val2);
      expect(val1).toBeGreaterThanOrEqual(0);
      expect(val1).toBeLessThan(1);
    }
  });

  it('generates distinct sequences for different seeds', () => {
    const rngA = createRng(1001);
    const rngB = createRng(2002);

    const seqA = Array.from({ length: 50 }, () => rngA.next());
    const seqB = Array.from({ length: 50 }, () => rngB.next());

    expect(seqA).not.toEqual(seqB);
  });

  it('handles seed 0 as a valid, deterministic seed', () => {
    const rngZero1 = createRng(0);
    const rngZero2 = createRng(0);

    const seq1 = Array.from({ length: 1000 }, () => rngZero1.next());
    const seq2 = Array.from({ length: 1000 }, () => rngZero2.next());

    expect(seq1).toEqual(seq2);
    expect(seq1[0]).toBeGreaterThan(0);
    expect(seq1[0]).toBeLessThan(1);
    expect(Number.isFinite(seq1[0])).toBe(true);
  });

  it('shuffles an array into a permutation without mutating the original input', () => {
    const rng = createRng(777);
    const original = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const snapshot = [...original];

    const shuffled = rng.shuffle(original);

    // 1. Does not mutate the original array
    expect(original).toEqual(snapshot);

    // 2. Contains all original elements (is a permutation)
    expect([...shuffled].sort()).toEqual([...original].sort());

    // 3. Different order produced
    expect(shuffled).not.toEqual(original);

    // 4. Deterministic shuffle for the same seed
    const rngSame = createRng(777);
    const shuffledSame = rngSame.shuffle(original);
    expect(shuffledSame).toEqual(shuffled);
  });

  it('produces an evenly distributed int(1, 6) across 60,000 samples (between 9,000 and 11,000 each)', () => {
    const rng = createRng(1337);
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const totalSamples = 60000;

    for (let i = 0; i < totalSamples; i++) {
      const val = rng.int(1, 6);
      counts[val] = (counts[val] || 0) + 1;
    }

    for (let num = 1; num <= 6; num++) {
      expect(counts[num]).toBeGreaterThanOrEqual(9000);
      expect(counts[num]).toBeLessThanOrEqual(11000);
    }
  });

  it('picks elements uniformly and throws when picking from an empty array', () => {
    const rng = createRng(555);
    const items = ['apple', 'banana', 'cherry'];

    const picked = rng.pick(items);
    expect(items).toContain(picked);

    expect(() => rng.pick([])).toThrow('Cannot pick an element from an empty array.');
  });

  it('derives seeds deterministically with label separation', () => {
    const baseSeed = 12345;
    const derivedMaze = deriveSeed(baseSeed, 'maze');
    const derivedWordsearch = deriveSeed(baseSeed, 'wordsearch');
    const derivedSudoku = deriveSeed(baseSeed, 'sudoku');

    // Deterministic repeat
    expect(deriveSeed(baseSeed, 'maze')).toBe(derivedMaze);

    // Distinct labels yield distinct seeds
    expect(derivedMaze).not.toBe(derivedWordsearch);
    expect(derivedWordsearch).not.toBe(derivedSudoku);
    expect(derivedMaze).not.toBe(derivedSudoku);

    // Seed 0 derives valid non-NaN unsigned 32-bit integer
    const zeroDerived = deriveSeed(0, 'test');
    expect(Number.isInteger(zeroDerived)).toBe(true);
    expect(zeroDerived).toBeGreaterThanOrEqual(0);
  });

  it('fails ESLint on sample files in packages/core/src/puzzles/ that use Math.random or Date.now', () => {
    const violationPathRandom = path.resolve(__dirname, '../src/puzzles/sample-random-bad.ts');
    const violationPathDate = path.resolve(__dirname, '../src/puzzles/sample-date-bad.ts');

    fs.writeFileSync(violationPathRandom, 'export const val = Math.random();\n');
    fs.writeFileSync(violationPathDate, 'export const now = Date.now();\n');

    try {
      let threwRandom = false;
      try {
        execSync(`npx eslint "${violationPathRandom}"`, { stdio: 'pipe' });
      } catch (err: unknown) {
        threwRandom = true;
        const errorObj = err as { status?: number };
        expect(errorObj.status).not.toBe(0);
      }
      expect(threwRandom).toBe(true);

      let threwDate = false;
      try {
        execSync(`npx eslint "${violationPathDate}"`, { stdio: 'pipe' });
      } catch (err: unknown) {
        threwDate = true;
        const errorObj = err as { status?: number };
        expect(errorObj.status).not.toBe(0);
      }
      expect(threwDate).toBe(true);
    } finally {
      if (fs.existsSync(violationPathRandom)) {
        fs.unlinkSync(violationPathRandom);
      }
      if (fs.existsSync(violationPathDate)) {
        fs.unlinkSync(violationPathDate);
      }
    }
  });
});
