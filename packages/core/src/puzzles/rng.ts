/**
 * Rng interface providing deterministic random operations.
 */
export interface Rng {
  /**
   * Generates a pseudo-random floating-point number in [0, 1).
   */
  next(): number;

  /**
   * Generates a pseudo-random integer in [min, max] (inclusive).
   */
  int(min: number, max: number): number;

  /**
   * Picks a random element from a non-empty array.
   * Throws an Error if array is empty.
   */
  pick<T>(array: readonly T[]): T;

  /**
   * Returns a shuffled copy of the array using the Fisher-Yates algorithm.
   * Does not mutate the original array.
   */
  shuffle<T>(array: readonly T[]): T[];
}

/**
 * Creates a deterministic PRNG using the Mulberry32 algorithm.
 * Supports any 32-bit integer seed, including seed = 0.
 */
export function createRng(seed: number): Rng {
  let s = seed >>> 0;

  function next(): number {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function int(min: number, max: number): number {
    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }
    const range = max - min + 1;
    return Math.floor(next() * range) + min;
  }

  function pick<T>(array: readonly T[]): T {
    if (array.length === 0) {
      throw new Error('Cannot pick an element from an empty array.');
    }
    const index = int(0, array.length - 1);
    return array[index];
  }

  function shuffle<T>(array: readonly T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = int(0, i);
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  return {
    next,
    int,
    pick,
    shuffle,
  };
}

/**
 * Derives a new deterministic 32-bit integer seed from a base seed and label.
 */
export function deriveSeed(seed: number, label: string): number {
  let h = (seed ^ 0x811c9dc5) >>> 0;
  for (let i = 0; i < label.length; i++) {
    h ^= label.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}
