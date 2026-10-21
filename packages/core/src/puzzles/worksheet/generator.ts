import { createRng } from '../rng';
import {
  WorksheetGrade,
  WorksheetOptions,
  WorksheetProblem,
  WorksheetResult,
  WorksheetTopic,
  WorksheetValidationError,
} from './types';

export interface GradeConfig {
  addition: { min: number; max: number };
  subtraction: { min: number; max: number; allowNegative: boolean };
  multiplication: { minA: number; maxA: number; minB: number; maxB: number };
  pattern: { minStart: number; maxStart: number; minStep: number; maxStep: number; length: number };
}

export const GRADE_CONFIGS: Record<WorksheetGrade, GradeConfig> = {
  1: {
    addition: { min: 1, max: 10 },
    subtraction: { min: 1, max: 10, allowNegative: false },
    multiplication: { minA: 1, maxA: 5, minB: 1, maxB: 5 },
    pattern: { minStart: 1, maxStart: 10, minStep: 1, maxStep: 3, length: 5 },
  },
  2: {
    addition: { min: 1, max: 50 },
    subtraction: { min: 1, max: 50, allowNegative: false },
    multiplication: { minA: 1, maxA: 9, minB: 1, maxB: 9 },
    pattern: { minStart: 1, maxStart: 30, minStep: 2, maxStep: 5, length: 5 },
  },
  3: {
    addition: { min: 10, max: 200 },
    subtraction: { min: 10, max: 200, allowNegative: false },
    multiplication: { minA: 2, maxA: 12, minB: 2, maxB: 12 },
    pattern: { minStart: 5, maxStart: 100, minStep: 2, maxStep: 10, length: 5 },
  },
  4: {
    addition: { min: 50, max: 999 },
    subtraction: { min: 50, max: 999, allowNegative: false },
    multiplication: { minA: 10, maxA: 99, minB: 2, maxB: 9 },
    pattern: { minStart: 10, maxStart: 200, minStep: 3, maxStep: 15, length: 5 },
  },
  5: {
    addition: { min: 100, max: 5000 },
    subtraction: { min: 100, max: 5000, allowNegative: false },
    multiplication: { minA: 10, maxA: 99, minB: 10, maxB: 99 },
    pattern: { minStart: 10, maxStart: 500, minStep: 5, maxStep: 25, length: 5 },
  },
  6: {
    addition: { min: 500, max: 20000 },
    subtraction: { min: 500, max: 20000, allowNegative: false },
    multiplication: { minA: 100, maxA: 999, minB: 10, maxB: 99 },
    pattern: { minStart: 20, maxStart: 1000, minStep: 5, maxStep: 50, length: 5 },
  },
};

const VALID_TOPICS: WorksheetTopic[] = ['addition', 'subtraction', 'multiplication', 'pattern'];

export function generateWorksheet(options: WorksheetOptions): WorksheetResult {
  const { topic, grade, problemCount, seed } = options;

  if (!Number.isInteger(problemCount) || problemCount < 1 || problemCount > 30) {
    throw new WorksheetValidationError(
      `Jumlah soal worksheet harus berupa bilangan bulat antara 1 dan 30, diterima: ${problemCount}.`
    );
  }

  if (!Number.isInteger(grade) || grade < 1 || grade > 6) {
    throw new WorksheetValidationError(
      `Tingkat kelas (grade) harus antara 1 dan 6, diterima: ${grade}.`
    );
  }

  if (!VALID_TOPICS.includes(topic)) {
    throw new WorksheetValidationError(
      `Topik worksheet tidak valid: "${topic}". Topik yang didukung: ${VALID_TOPICS.join(', ')}.`
    );
  }

  const rng = createRng(seed);
  const gradeConfig = GRADE_CONFIGS[grade];
  const problems: WorksheetProblem[] = [];
  const seenKeys = new Set<string>();

  for (let i = 0; i < problemCount; i++) {
    const id = `problem-${i + 1}`;
    let prompt = '';
    let answer = '';
    let attempts = 0;

    while (attempts < 50) {
      attempts++;

      if (topic === 'addition') {
        const { min, max } = gradeConfig.addition;
        const a = rng.int(min, max);
        const b = rng.int(min, max);
        const key = `${a}+${b}`;

        if (!seenKeys.has(key) || attempts >= 49) {
          seenKeys.add(key);
          prompt = `${a} + ${b} = `;
          answer = String(a + b);
          break;
        }
      } else if (topic === 'subtraction') {
        const { min, max, allowNegative } = gradeConfig.subtraction;
        let a = rng.int(min, max);
        let b = rng.int(min, max);

        // Lower grades (and default elementary arithmetic) do not yield negative numbers
        if (!allowNegative && a < b) {
          const temp = a;
          a = b;
          b = temp;
        }

        const key = `${a}-${b}`;
        if (!seenKeys.has(key) || attempts >= 49) {
          seenKeys.add(key);
          prompt = `${a} - ${b} = `;
          answer = String(a - b);
          break;
        }
      } else if (topic === 'multiplication') {
        const { minA, maxA, minB, maxB } = gradeConfig.multiplication;
        const a = rng.int(minA, maxA);
        const b = rng.int(minB, maxB);
        const key = `${a}×${b}`;

        if (!seenKeys.has(key) || attempts >= 49) {
          seenKeys.add(key);
          prompt = `${a} × ${b} = `;
          answer = String(a * b);
          break;
        }
      } else if (topic === 'pattern') {
        const { minStart, maxStart, minStep, maxStep, length } = gradeConfig.pattern;
        const start = rng.int(minStart, maxStart);
        const step = rng.int(minStep, maxStep);
        const blankIdx = rng.int(0, length - 1);
        const key = `${start}:${step}:${blankIdx}`;

        if (!seenKeys.has(key) || attempts >= 49) {
          seenKeys.add(key);
          const terms: string[] = [];
          for (let t = 0; t < length; t++) {
            const val = start + t * step;
            if (t === blankIdx) {
              terms.push('__');
              answer = String(val);
            } else {
              terms.push(String(val));
            }
          }
          prompt = terms.join(', ');
          break;
        }
      }
    }

    problems.push({ id, prompt, answer });
  }

  return { problems };
}
