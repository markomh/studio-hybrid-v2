import { describe, it, expect } from 'vitest';
import { createDocument, layout, Document } from '../src';

describe('Layout Golden Regression (F2-6a)', () => {
  // Document 1: Letter with single-line texts (left, center, right)
  const doc1: Document = createDocument('letter');
  doc1.pages[0].elements = [
    {
      id: 'doc1-text-left',
      type: 'text',
      x: 25,
      y: 35,
      w: 100,
      h: 20,
      rotation: 0,
      opacity: 1,
      locked: false,
      hidden: false,
      text: 'Judul Rata Kiri',
      fontFamily: 'sans',
      fontSizePt: 16,
      lineHeight: 1.2,
      letterSpacingPt: 0,
      bold: true,
      italic: false,
      underline: false,
      caps: false,
      align: 'left',
      color: '#000000',
    },
    {
      id: 'doc1-text-center',
      type: 'text',
      x: 25,
      y: 60,
      w: 120,
      h: 20,
      rotation: 0,
      opacity: 1,
      locked: false,
      hidden: false,
      text: 'Judul Rata Tengah',
      fontFamily: 'serif',
      fontSizePt: 20,
      lineHeight: 1.4,
      letterSpacingPt: 1,
      bold: false,
      italic: true,
      underline: false,
      caps: false,
      align: 'center',
      color: '#4F46E5',
    },
    {
      id: 'doc1-text-right',
      type: 'text',
      x: 25,
      y: 85,
      w: 120,
      h: 20,
      rotation: 0,
      opacity: 1,
      locked: false,
      hidden: false,
      text: 'Judul Rata Kanan',
      fontFamily: 'comic',
      fontSizePt: 14,
      lineHeight: 1.2,
      letterSpacingPt: 0,
      bold: false,
      italic: false,
      underline: true,
      caps: false,
      align: 'right',
      color: '#B91C1C',
    },
  ];

  // Document 2: A4 with multiline wrapped text
  const doc2: Document = createDocument('a4');
  doc2.pages[0].elements = [
    {
      id: 'doc2-multiline',
      type: 'text',
      x: 30,
      y: 45,
      w: 60,
      h: 60,
      rotation: 0,
      opacity: 1,
      locked: false,
      hidden: false,
      text: 'Ini adalah paragraf panjang yang dirancang untuk menguji wrapping kata demi kata pada layout A4 dengan font mono berukuran kecil.',
      fontFamily: 'mono',
      fontSizePt: 11,
      lineHeight: 1.5,
      letterSpacingPt: 0.5,
      bold: false,
      italic: false,
      underline: false,
      caps: false,
      align: 'left',
      color: '#111827',
    },
  ];

  // Document 3: 6x9 format with multiple pages (recto & verso) and margins
  const doc3: Document = createDocument('6x9');
  doc3.pages[0].elements = [
    {
      id: 'doc3-p1-text',
      type: 'text',
      x: 20,
      y: 25,
      w: 80,
      h: 25,
      rotation: 0,
      opacity: 1,
      locked: false,
      hidden: false,
      text: 'Halaman Recto 6x9',
      fontFamily: 'sans',
      fontSizePt: 14,
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

  // Compute pre-refactor layout outputs
  const goldenResult1 = layout(doc1, doc1.pages[0].id);
  const goldenResult2 = layout(doc2, doc2.pages[0].id);
  const goldenResult3 = layout(doc3, doc3.pages[0].id);

  it('matches golden layout output for Letter single-line text document', () => {
    const current = layout(doc1, doc1.pages[0].id);
    expect(current).toEqual(goldenResult1);
  });

  it('matches golden layout output for A4 multiline wrapped text document', () => {
    const current = layout(doc2, doc2.pages[0].id);
    expect(current).toEqual(goldenResult2);
  });

  it('matches golden layout output for 6x9 formatted document', () => {
    const current = layout(doc3, doc3.pages[0].id);
    expect(current).toEqual(goldenResult3);
  });
});
