import { Document, TrimPresetSchema } from './index';

const PRESET_DIMENSIONS: Record<Exclude<z.infer<typeof TrimPresetSchema>, 'custom'>, { widthMm: number; heightMm: number }> = {
  letter: { widthMm: 215.9, heightMm: 279.4 },
  a4: { widthMm: 210, heightMm: 297 },
  '6x9': { widthMm: 152.4, heightMm: 228.6 },
  '8.5x8.5': { widthMm: 215.9, heightMm: 215.9 },
};

export function createDocument(
  preset: 'letter' | 'a4' | '6x9' | '8.5x8.5' | 'custom' = 'letter',
  customWidthMm?: number,
  customHeightMm?: number
): Document {
  let widthMm = 215.9;
  let heightMm = 279.4;

  if (preset === 'custom' && customWidthMm && customHeightMm) {
    widthMm = customWidthMm;
    heightMm = customHeightMm;
  } else if (preset !== 'custom' && PRESET_DIMENSIONS[preset]) {
    widthMm = PRESET_DIMENSIONS[preset].widthMm;
    heightMm = PRESET_DIMENSIONS[preset].heightMm;
  }

  const now = new Date().toISOString();

  return {
    schemaVersion: 1,
    id: `doc-${Date.now()}`,
    meta: {
      name: 'Buku Baru',
      trim: {
        preset,
        widthMm,
        heightMm,
      },
      bleedMm: 3.175,
      paper: 'white',
      colorMode: 'grayscale',
      margins: {
        topMm: 12.7,
        bottomMm: 12.7,
        insideMm: 15.0,
        outsideMm: 12.7,
      },
      createdAt: now,
      updatedAt: now,
    },
    pages: [
      {
        id: `page-${Date.now()}-1`,
        role: 'cover',
        elements: [],
      },
    ],
  };
}
import { z } from 'zod';
