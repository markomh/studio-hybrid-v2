import { describe, it, expect } from 'vitest';
import { createDocument, layout, ptToMm } from '../src';

describe('Document Layout Engine (I-1, I-6, FR-4)', () => {
  it('calculates text coordinates at (20, 30) mm from font metrics stably', () => {
    const doc = createDocument('letter');
    doc.pages[0].elements = [
      {
        id: 'text-1',
        type: 'text',
        x: 20,
        y: 30,
        w: 100,
        h: 40,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        text: 'Judul Dokumen Uji',
        fontFamily: 'sans',
        fontSizePt: 16,
        lineHeight: 1.2,
        letterSpacingPt: 0,
        bold: false,
        italic: false,
        underline: false,
        caps: false,
        align: 'left',
        color: '#000000',
      },
    ];

    const result1 = layout(doc, doc.pages[0].id);
    const result2 = layout(doc, doc.pages[0].id);

    // Deterministic results
    expect(result1).toEqual(result2);

    const textPrimitives = result1.primitives.filter((p) => p.kind === 'text');
    expect(textPrimitives.length).toBe(1);

    const firstLine = textPrimitives[0];
    expect(firstLine.x).toBe(20);

    // Baseline is calculated deterministically from y (30mm) + baseline offset
    const expectedBaselineOffsetMm = ptToMm(16 * 0.85);
    const expectedY = Number((30 + expectedBaselineOffsetMm).toFixed(4));
    expect(firstLine.y).toBeCloseTo(expectedY, 3);
  });

  it('generates background rect, safe zone margin rect, and multiple text lines for multiline text', () => {
    const doc = createDocument('letter');
    doc.pages[0].elements = [
      {
        id: 'text-multi',
        type: 'text',
        x: 25,
        y: 40,
        w: 50,
        h: 50,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        text: 'Paragraf panjang yang terpecah menjadi beberapa baris dalam kotak sempit.',
        fontFamily: 'serif',
        fontSizePt: 12,
        lineHeight: 1.2,
        letterSpacingPt: 0,
        bold: false,
        italic: false,
        underline: false,
        caps: false,
        align: 'left',
        color: '#111827',
      },
    ];

    const result = layout(doc, doc.pages[0].id);
    const rects = result.primitives.filter((p) => p.kind === 'rect');
    const texts = result.primitives.filter((p) => p.kind === 'text');

    expect(rects.length).toBeGreaterThanOrEqual(2); // page bg + margin guide
    expect(texts.length).toBeGreaterThan(1); // wrapped lines
  });
});
