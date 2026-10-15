import { describe, it, expect } from 'vitest';
import zlib from 'zlib';
import { PDFDocument } from 'pdf-lib';
import {
  createDocument,
  renderPdf,
  layout,
  ptToMm,
  TextElement,
  FontFamily,
  TrimPreset,
} from '../../src';

function extractPageStream(pdfDoc: PDFDocument, pageIndex = 0): string {
  const page = pdfDoc.getPage(pageIndex);
  const contents = page.node.Contents();
  if (!contents) return '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refs = 'asArray' in contents ? (contents as any).asArray() : [contents];
  let combined = '';
  for (const ref of refs) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stream = pdfDoc.context.lookup(ref) as any;
    if (stream && stream.contents) {
      combined += zlib.inflateSync(stream.contents).toString('utf8');
    }
  }
  return combined;
}

describe('Layout-to-PDF Visual Parity (I-1, I-6, P-1, F1-7)', () => {
  const formats: TrimPreset[] = ['letter', 'a4', '6x9'];
  const fontFamilies: FontFamily[] = ['sans', 'serif', 'comic'];

  for (const format of formats) {
    for (const family of fontFamilies) {
      it(`matches layout and PDF coordinates within 0.5 mm for format "${format}" and font "${family}"`, async () => {
        const doc = createDocument(format);
        const pageId = doc.pages[0].id;

        const textEl: TextElement = {
          id: `text-${format}-${family}`,
          type: 'text',
          x: 25,
          y: 35,
          w: 80,
          h: 25,
          rotation: 0,
          opacity: 1,
          locked: false,
          hidden: false,
          text: `Paritas ${format} ${family}`,
          fontFamily: family,
          fontSizePt: 14,
          lineHeight: 1.2,
          letterSpacingPt: 0,
          bold: false,
          italic: false,
          underline: false,
          caps: false,
          align: 'left',
          color: '#0f172a',
        };

        doc.pages[0].elements = [textEl];

        // 1. Core layout result (what the canvas sees)
        const layoutResult = layout(doc, pageId);
        const textPrimitives = layoutResult.primitives.filter((p) => p.kind === 'text');
        expect(textPrimitives.length).toBeGreaterThan(0);

        // 2. Core PDF rendering (what gets printed)
        const pdfBytes = await renderPdf(doc);

        // 3. Extract text coordinates from PDF stream
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const page = pdfDoc.getPage(0);
        const pageHeightPt = page.getHeight();
        const stream = extractPageStream(pdfDoc, 0);

        const tmRegex = /1 0 0 1\s+([-\d.]+)\s+([-\d.]+)\s+Tm/g;
        const matches: Array<{ txPt: number; tyPt: number }> = [];
        let match: RegExpExecArray | null;
        while ((match = tmRegex.exec(stream)) !== null) {
          matches.push({ txPt: parseFloat(match[1]), tyPt: parseFloat(match[2]) });
        }

        expect(matches.length).toBeGreaterThanOrEqual(textPrimitives.length);

        // 4. Verify coordinates for each text primitive
        for (let i = 0; i < textPrimitives.length; i++) {
          const prim = textPrimitives[i];
          const matchItem = matches[i];
          expect(matchItem).toBeDefined();

          const extractedXMm = ptToMm(matchItem.txPt);
          const extractedYMm = ptToMm(pageHeightPt - matchItem.tyPt);

          const diffX = Math.abs(extractedXMm - prim.x);
          const diffY = Math.abs(extractedYMm - prim.y);

          // Acceptance criteria: diff <= 0.5 mm
          expect(diffX).toBeLessThanOrEqual(0.5);
          expect(diffY).toBeLessThanOrEqual(0.5);
        }
      });
    }
  }
});

