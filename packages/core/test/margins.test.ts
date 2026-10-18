import { describe, it, expect } from 'vitest';
import { createDocument } from '../src/schema/createDocument';
import { computeMargins } from '../src/book/margins';

describe('Book Margins & Recto/Verso (F3-A5)', () => {
  it('swaps inside and outside margins correctly for page 1 (recto) and page 2 (verso)', () => {
    const doc = createDocument('letter');
    doc.meta.margins = {
      topMm: 15,
      bottomMm: 15,
      insideMm: 20,
      outsideMm: 10,
    };

    // Page 1 (index 0, pageNumber 1 - Recto)
    const marginsPage1 = computeMargins(doc, 0);
    expect(marginsPage1.topMm).toBe(15);
    expect(marginsPage1.bottomMm).toBe(15);
    expect(marginsPage1.leftMm).toBe(20); // inside on left for recto
    expect(marginsPage1.rightMm).toBe(10); // outside on right for recto

    // Page 2 (index 1, pageNumber 2 - Verso)
    const marginsPage2 = computeMargins(doc, 1);
    expect(marginsPage2.topMm).toBe(15);
    expect(marginsPage2.bottomMm).toBe(15);
    expect(marginsPage2.leftMm).toBe(10); // outside on left for verso
    expect(marginsPage2.rightMm).toBe(20); // inside on right for verso
  });
});
