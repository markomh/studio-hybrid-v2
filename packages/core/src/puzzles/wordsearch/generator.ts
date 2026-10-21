import { createRng } from '../rng';
import {
  WordSearchDirection,
  WordSearchOptions,
  WordSearchResult,
  WordSearchPlacement,
  WordSearchSkipped,
} from './types';

export const MAX_ATTEMPTS = 150;

function createDirection(dr: number, dc: number, name: string): WordSearchDirection {
  const arr = [dr, dc] as unknown as WordSearchDirection;
  arr.dr = dr;
  arr.dc = dc;
  arr.name = name;
  arr.isDiagonal = dr !== 0 && dc !== 0;
  arr.isReverse = dr < 0 || dc < 0;
  return arr;
}

export function normalizeWord(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .toUpperCase();
}

export function generateWordSearch(options: WordSearchOptions): WordSearchResult {
  const { size, words, allowDiagonal, allowReverse, seed } = options;

  if (size < 8 || size > 20) {
    throw new Error(`Ukuran kisi word search harus antara 8 dan 20, diterima: ${size}.`);
  }

  const rng = createRng(seed);
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));

  const skipped: WordSearchSkipped[] = [];
  const placements: WordSearchPlacement[] = [];

  // 1. Build directions list
  const directions: WordSearchDirection[] = [
    createDirection(0, 1, 'right'),
    createDirection(1, 0, 'down'),
  ];

  if (allowDiagonal) {
    directions.push(createDirection(1, 1, 'down-right'));
    directions.push(createDirection(-1, 1, 'up-right'));
  }

  if (allowReverse) {
    directions.push(createDirection(0, -1, 'left'));
    directions.push(createDirection(-1, 0, 'up'));
    if (allowDiagonal) {
      directions.push(createDirection(-1, -1, 'up-left'));
      directions.push(createDirection(1, -1, 'down-left'));
    }
  }

  // 2. Normalize and filter words
  interface CandidateWord {
    original: string;
    normalized: string;
  }
  const candidates: CandidateWord[] = [];
  const seenNormalized = new Set<string>();

  for (const raw of words) {
    const normalized = normalizeWord(raw);

    if (normalized.length === 0 || !/^[A-Z]+$/.test(normalized)) {
      skipped.push({ word: raw, reason: 'invalid_chars' });
      continue;
    }

    if (normalized.length < 2) {
      skipped.push({ word: raw, reason: 'too_short' });
      continue;
    }

    if (normalized.length > size) {
      skipped.push({ word: raw, reason: 'too_long' });
      continue;
    }

    if (seenNormalized.has(normalized)) {
      skipped.push({ word: raw, reason: 'duplicate' });
      continue;
    }

    seenNormalized.add(normalized);
    candidates.push({ original: raw, normalized });
  }

  // 3. Sort candidates by length descending for optimal packing
  const sorted = [...candidates].sort((a, b) => b.normalized.length - a.normalized.length);

  // 4. Place words
  for (const { original, normalized } of sorted) {
    let placed = false;
    let attempts = 0;
    const len = normalized.length;

    while (!placed && attempts < MAX_ATTEMPTS) {
      attempts++;
      const dir = rng.pick(directions);
      const [dr, dc] = dir;

      const minR = dr < 0 ? len - 1 : 0;
      const maxR = dr > 0 ? size - len : size - 1;
      const minC = dc < 0 ? len - 1 : 0;
      const maxC = dc > 0 ? size - len : size - 1;

      if (minR > maxR || minC > maxC) continue;

      const startR = rng.int(minR, maxR);
      const startC = rng.int(minC, maxC);

      let canPlace = true;
      for (let i = 0; i < len; i++) {
        const r = startR + dr * i;
        const c = startC + dc * i;
        const cell = grid[r][c];
        if (cell !== '' && cell !== normalized[i]) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        for (let i = 0; i < len; i++) {
          const r = startR + dr * i;
          const c = startC + dc * i;
          grid[r][c] = normalized[i];
        }

        placements.push({
          word: normalized,
          row: startR,
          col: startC,
          dir,
        });
        placed = true;
      }
    }

    if (!placed) {
      skipped.push({ word: original, reason: 'no_space' });
    }
  }

  // 5. Fill remaining empty cells with random letters from rng
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        const letterIndex = rng.int(0, alphabet.length - 1);
        grid[r][c] = alphabet[letterIndex];
      }
    }
  }

  return {
    grid,
    placements,
    skipped,
  };
}
