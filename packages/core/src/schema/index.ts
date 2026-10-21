import { z } from 'zod';

export const ElementBaseSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  w: z.number().nonnegative(),
  h: z.number().nonnegative(),
  rotation: z.number(),
  opacity: z.number().min(0).max(1),
  locked: z.boolean(),
  hidden: z.boolean(),
});

export const TextElementSchema = ElementBaseSchema.extend({
  type: z.literal('text'),
  text: z.string(),
  fontFamily: z.enum(['sans', 'serif', 'comic', 'mono']),
  fontSizePt: z.number().positive(),
  lineHeight: z.number().positive(),
  letterSpacingPt: z.number(),
  bold: z.boolean(),
  italic: z.boolean(),
  underline: z.boolean(),
  caps: z.boolean(),
  align: z.enum(['left', 'center', 'right']),
  color: z.string(),
  placeholder: z.boolean().optional(),
});

export const MazeAlgorithmSchema = z.enum(['recursive-backtracker', 'prim', 'kruskal']);
export type MazeAlgorithm = z.infer<typeof MazeAlgorithmSchema>;

export const MazeParamsSchema = z.object({
  kind: z.literal('maze'),
  rows: z.number().int().min(2).max(60),
  cols: z.number().int().min(2).max(60),
  algorithm: MazeAlgorithmSchema,
  wallThicknessMm: z.number().positive(),
  wallColor: z.string(),
  solutionColor: z.string(),
  startIcon: z.string().optional(),
  finishIcon: z.string().optional(),
});
export type MazeParams = z.infer<typeof MazeParamsSchema>;

export const WordSearchParamsSchema = z.object({
  kind: z.literal('wordsearch'),
  size: z.number().int().min(8).max(20),
  words: z.array(z.string()),
  allowDiagonal: z.boolean(),
  allowReverse: z.boolean(),
});
export type WordSearchParams = z.infer<typeof WordSearchParamsSchema>;

export const SudokuParamsSchema = z.object({
  kind: z.literal('sudoku'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});
export type SudokuParams = z.infer<typeof SudokuParamsSchema>;

export const WorksheetTopicSchema = z.enum(['addition', 'subtraction', 'multiplication', 'pattern']);
export type WorksheetTopic = z.infer<typeof WorksheetTopicSchema>;

export const WorksheetParamsSchema = z.object({
  kind: z.literal('worksheet'),
  subject: z.string().default('math'),
  topic: WorksheetTopicSchema,
  grade: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
  problemCount: z.number().int().min(1).max(30),
});
export type WorksheetParams = z.infer<typeof WorksheetParamsSchema>;

export const PuzzleParamsSchema = z.discriminatedUnion('kind', [
  MazeParamsSchema,
  WordSearchParamsSchema,
  SudokuParamsSchema,
  WorksheetParamsSchema,
]);
export type PuzzleParams = z.infer<typeof PuzzleParamsSchema>;
export type PuzzleKind = PuzzleParams;

export const PuzzleElementSchema = ElementBaseSchema.extend({
  type: z.literal('puzzle'),
  params: PuzzleParamsSchema,
  seed: z.number().int(),
  showSolution: z.boolean(),
  kind: PuzzleParamsSchema.optional(),
});
export type PuzzleElement = z.infer<typeof PuzzleElementSchema>;

// Union for element types
export const ElementSchema = z.discriminatedUnion('type', [
  TextElementSchema,
  PuzzleElementSchema,
]);

export const NumberingSchema = z.object({
  style: z.enum(['arabic', 'roman-lower', 'roman-upper', 'none']),
  start: z.number().int().positive().optional(),
  suppressFirst: z.boolean().optional(),
});

export const PageRoleSchema = z.enum(['cover', 'front_matter', 'body', 'solutions', 'appendix']);

export const PageBorderSchema = z.enum(['none', 'simple', 'double', 'rounded', 'dots']);

export const PageSchema = z.object({
  id: z.string(),
  role: PageRoleSchema,
  numbering: NumberingSchema.optional(),
  border: PageBorderSchema.optional(),
  elements: z.array(ElementSchema),
});

export const TrimPresetSchema = z.enum(['letter', 'a4', '6x9', '8.5x8.5', 'custom']);

export const DocumentMetaSchema = z.object({
  name: z.string(),
  trim: z.object({
    preset: TrimPresetSchema,
    widthMm: z.number().positive(),
    heightMm: z.number().positive(),
  }),
  bleedMm: z.number().nonnegative(),
  paper: z.enum(['white', 'cream', 'color']),
  colorMode: z.enum(['color', 'grayscale']),
  margins: z.object({
    topMm: z.number().nonnegative(),
    bottomMm: z.number().nonnegative(),
    insideMm: z.number().nonnegative(),
    outsideMm: z.number().nonnegative(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const DocumentSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string(),
  meta: DocumentMetaSchema,
  pages: z.array(PageSchema),
});

export type ElementBase = z.infer<typeof ElementBaseSchema>;
export type TextElement = z.infer<typeof TextElementSchema>;
export type Element = z.infer<typeof ElementSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type PageRole = z.infer<typeof PageRoleSchema>;
