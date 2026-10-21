/**
 * Direction vector [dr, dc] for word placement.
 * dr: change in row (-1: up, 0: same, 1: down)
 * dc: change in column (-1: left, 0: same, 1: right)
 */
export type WordSearchDirection = [dr: number, dc: number] & {
  dr: number;
  dc: number;
  name: string;
  isDiagonal: boolean;
  isReverse: boolean;
};

export type WordSearchSkipReason =
  | 'too_long'
  | 'too_short'
  | 'duplicate'
  | 'no_space'
  | 'invalid_chars';

export interface WordSearchSkipped {
  word: string;
  reason: WordSearchSkipReason;
}

export interface WordSearchPlacement {
  word: string;
  row: number;
  col: number;
  dir: WordSearchDirection;
}

export interface WordSearchOptions {
  size: number;
  words: readonly string[];
  allowDiagonal: boolean;
  allowReverse: boolean;
  seed: number;
}

export interface WordSearchResult {
  grid: string[][];
  placements: WordSearchPlacement[];
  skipped: WordSearchSkipped[];
}

export interface WordSearchTheme {
  id: string;
  name: string;
  words: readonly string[];
}
