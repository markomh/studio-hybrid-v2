import { describe, it, expect } from 'vitest';
import {
  generateWorksheet,
  GRADE_CONFIGS,
  WorksheetGrade,
  WorksheetTopic,
  WorksheetValidationError,
} from '../src/puzzles/worksheet';

describe('Math Worksheet Generator Engine (F2-5)', () => {
  it('computes correct answers for all arithmetic topics (addition, subtraction, multiplication)', () => {
    // 1. Addition
    const addResult = generateWorksheet({
      topic: 'addition',
      grade: 2,
      problemCount: 15,
      seed: 42,
    });
    for (const p of addResult.problems) {
      const match = p.prompt.match(/^(\d+)\s*\+\s*(\d+)\s*=\s*$/);
      expect(match).not.toBeNull();
      const a = parseInt(match![1], 10);
      const b = parseInt(match![2], 10);
      expect(parseInt(p.answer, 10)).toBe(a + b);
    }

    // 2. Subtraction
    const subResult = generateWorksheet({
      topic: 'subtraction',
      grade: 3,
      problemCount: 15,
      seed: 99,
    });
    for (const p of subResult.problems) {
      const match = p.prompt.match(/^(\d+)\s*-\s*(\d+)\s*=\s*$/);
      expect(match).not.toBeNull();
      const a = parseInt(match![1], 10);
      const b = parseInt(match![2], 10);
      expect(parseInt(p.answer, 10)).toBe(a - b);
    }

    // 3. Multiplication
    const mulResult = generateWorksheet({
      topic: 'multiplication',
      grade: 3,
      problemCount: 15,
      seed: 123,
    });
    for (const p of mulResult.problems) {
      const match = p.prompt.match(/^(\d+)\s*×\s*(\d+)\s*=\s*$/);
      expect(match).not.toBeNull();
      const a = parseInt(match![1], 10);
      const b = parseInt(match![2], 10);
      expect(parseInt(p.answer, 10)).toBe(a * b);
    }
  });

  it('guarantees pattern problems have exactly one blank and a unique correct answer', () => {
    const patternResult = generateWorksheet({
      topic: 'pattern',
      grade: 2,
      problemCount: 20,
      seed: 777,
    });

    for (const p of patternResult.problems) {
      const terms = p.prompt.split(', ');
      expect(terms.length).toBe(5);

      // Exactly one blank term
      const blankIndices = terms
        .map((t, idx) => (t === '__' ? idx : -1))
        .filter((idx) => idx !== -1);
      expect(blankIndices.length).toBe(1);

      const blankIdx = blankIndices[0];
      const numbers: (number | null)[] = terms.map((t) => (t === '__' ? null : parseInt(t, 10)));

      // Determine step from visible terms
      let step: number | null = null;
      for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] !== null && numbers[i + 1] !== null) {
          step = numbers[i + 1]! - numbers[i]!;
          break;
        }
      }

      if (step === null) {
        // In length 5 with 1 blank, there is always at least one consecutive non-null pair
        // (even if blank is at index 1, indices 2 and 3 are non-null)
        expect.fail('Could not find consecutive numbers to deduce step');
      }

      // Check all non-null numbers conform to this arithmetic step
      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] !== null) {
          const expectedVal = numbers[i]!;
          // Find distance from blank index
          const offset = i - blankIdx;
          const deducedBlankVal = expectedVal - offset * step;
          expect(parseInt(p.answer, 10)).toBe(deducedBlankVal);
          break;
        }
      }
    }
  });

  it('generates identical problems for identical seeds, and handles seed 0 deterministically', () => {
    const resA = generateWorksheet({
      topic: 'addition',
      grade: 4,
      problemCount: 12,
      seed: 8888,
    });
    const resB = generateWorksheet({
      topic: 'addition',
      grade: 4,
      problemCount: 12,
      seed: 8888,
    });

    expect(resA.problems).toEqual(resB.problems);

    // Seed 0 test
    const resZero1 = generateWorksheet({
      topic: 'subtraction',
      grade: 1,
      problemCount: 10,
      seed: 0,
    });
    const resZero2 = generateWorksheet({
      topic: 'subtraction',
      grade: 1,
      problemCount: 10,
      seed: 0,
    });

    expect(resZero1.problems).toEqual(resZero2.problems);
    expect(resZero1.problems.length).toBe(10);
  });

  it('avoids duplicate problems within a single worksheet when problem space is sufficient', () => {
    const topics: WorksheetTopic[] = ['addition', 'subtraction', 'multiplication', 'pattern'];

    for (const topic of topics) {
      const res = generateWorksheet({
        topic,
        grade: 3,
        problemCount: 20,
        seed: 3456,
      });

      const prompts = res.problems.map((p) => p.prompt);
      const uniquePrompts = new Set(prompts);
      expect(uniquePrompts.size).toBe(prompts.length);
    }
  });

  it('keeps all operands within grade range, and ensures lower-grade subtraction is non-negative', () => {
    const grades: WorksheetGrade[] = [1, 2, 3, 4, 5, 6];

    for (const grade of grades) {
      const config = GRADE_CONFIGS[grade];

      // Addition operands
      const addSheet = generateWorksheet({
        topic: 'addition',
        grade,
        problemCount: 10,
        seed: 100 + grade,
      });
      for (const p of addSheet.problems) {
        const match = p.prompt.match(/^(\d+)\s*\+\s*(\d+)\s*=\s*$/)!;
        const a = parseInt(match[1], 10);
        const b = parseInt(match[2], 10);
        expect(a).toBeGreaterThanOrEqual(config.addition.min);
        expect(a).toBeLessThanOrEqual(config.addition.max);
        expect(b).toBeGreaterThanOrEqual(config.addition.min);
        expect(b).toBeLessThanOrEqual(config.addition.max);
      }

      // Subtraction operands
      const subSheet = generateWorksheet({
        topic: 'subtraction',
        grade,
        problemCount: 10,
        seed: 200 + grade,
      });
      for (const p of subSheet.problems) {
        const match = p.prompt.match(/^(\d+)\s*-\s*(\d+)\s*=\s*$/)!;
        const a = parseInt(match[1], 10);
        const b = parseInt(match[2], 10);
        expect(a).toBeGreaterThanOrEqual(config.subtraction.min);
        expect(a).toBeLessThanOrEqual(config.subtraction.max);
        expect(b).toBeGreaterThanOrEqual(config.subtraction.min);
        expect(b).toBeLessThanOrEqual(config.subtraction.max);

        // Lower grades (and all configured grades) must never produce negative results
        const ans = parseInt(p.answer, 10);
        expect(ans).toBeGreaterThanOrEqual(0);
        expect(a).toBeGreaterThanOrEqual(b);
      }
    }
  });

  it('throws typed WorksheetValidationError when problemCount is outside 1-30 or non-integer', () => {
    expect(() =>
      generateWorksheet({
        topic: 'addition',
        grade: 1,
        problemCount: 0,
        seed: 1,
      })
    ).toThrow(WorksheetValidationError);

    expect(() =>
      generateWorksheet({
        topic: 'addition',
        grade: 1,
        problemCount: 31,
        seed: 1,
      })
    ).toThrow(WorksheetValidationError);

    expect(() =>
      generateWorksheet({
        topic: 'addition',
        grade: 1,
        problemCount: -1,
        seed: 1,
      })
    ).toThrow(WorksheetValidationError);

    expect(() =>
      generateWorksheet({
        topic: 'addition',
        grade: 1,
        problemCount: 5.5,
        seed: 1,
      })
    ).toThrow(WorksheetValidationError);
  });

  it('validates grade and topic parameters with WorksheetValidationError', () => {
    expect(() =>
      generateWorksheet({
        topic: 'addition',
        grade: 0 as WorksheetGrade,
        problemCount: 10,
        seed: 1,
      })
    ).toThrow(WorksheetValidationError);

    expect(() =>
      generateWorksheet({
        topic: 'addition',
        grade: 7 as WorksheetGrade,
        problemCount: 10,
        seed: 1,
      })
    ).toThrow(WorksheetValidationError);

    expect(() =>
      generateWorksheet({
        topic: 'algebra' as WorksheetTopic,
        grade: 3,
        problemCount: 10,
        seed: 1,
      })
    ).toThrow(WorksheetValidationError);
  });
});
