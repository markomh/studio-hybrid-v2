import { describe, it, expect } from 'vitest';
import { wrapText, measureText } from '../src/text';

describe('Text Measurement & Wrapping (I-1, I-2, FR-4)', () => {
  it('wraps short text into a single line', () => {
    const text = 'Judul Singkat';
    const lines = wrapText(text, 'sans', 14, 100);

    expect(lines.length).toBe(1);
    expect(lines[0].text).toBe(text);
    expect(lines[0].widthMm).toBeLessThanOrEqual(100);
    expect(lines[0].overflow).toBeFalsy();
  });

  it('wraps long text across multiple lines without exceeding box width', () => {
    const text =
      'Buku aktivitas ini berisi berbagai macam tantangan labirin, teka-teki pencarian kata, dan sudoku untuk mengasah kemampuan logika anak secara mandiri.';
    const boxWidthMm = 60;
    const lines = wrapText(text, 'sans', 12, boxWidthMm);

    expect(lines.length).toBeGreaterThan(1);
    for (const line of lines) {
      expect(line.widthMm).toBeLessThanOrEqual(boxWidthMm + 0.1);
    }
  });

  it('breaks a single oversized word that exceeds the box width and marks overflow', () => {
    const hugeWord = 'SupercalifragilisticexpialidociousLongWordForTestingBoundary';
    const narrowBoxMm = 15; // Very narrow box
    const lines = wrapText(hugeWord, 'sans', 14, narrowBoxMm);

    expect(lines.length).toBeGreaterThan(1);
    const hasOverflow = lines.some((l) => l.overflow === true);
    expect(hasOverflow).toBe(true);
  });

  it('produces deterministic output on repeated calls', () => {
    const text = 'Satu dua tiga empat lima enam tujuh delapan sembilan sepuluh.';
    const run1 = wrapText(text, 'serif', 12, 40);
    const run2 = wrapText(text, 'serif', 12, 40);

    expect(run1).toEqual(run2);
  });

  it('measures text with letter spacing correctly', () => {
    const text = 'SPACING';
    const normalWidth = measureText(text, 'sans', 12, 0);
    const spacedWidth = measureText(text, 'sans', 12, 2);

    expect(spacedWidth).toBeGreaterThan(normalWidth);
  });
});
