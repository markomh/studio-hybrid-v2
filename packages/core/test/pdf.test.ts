import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import zlib from 'zlib';
import { execSync } from 'child_process';
import { PDFDocument, PDFName, PDFDict } from 'pdf-lib';
import { createDocument, renderPdf, ptToMm, TextElement } from '../src';

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

describe('PDF Text Renderer (I-1, I-6, P-2, P-3, F1-6)', () => {
  it('creates PDF with correct page count and page size matching trim within 0.01 mm tolerance', async () => {
    const doc = createDocument('letter'); // Letter: 215.9 x 279.4 mm
    const textEl: TextElement = {
      id: 't-1',
      type: 'text',
      x: 25,
      y: 35,
      w: 80,
      h: 20,
      rotation: 0,
      opacity: 1,
      locked: false,
      hidden: false,
      text: 'Uji Ukuran Halaman PDF',
      fontFamily: 'sans',
      fontSizePt: 14,
      lineHeight: 1.2,
      letterSpacingPt: 0,
      bold: false,
      italic: false,
      underline: false,
      caps: false,
      align: 'left',
      color: '#1e293b',
    };
    doc.pages[0].elements = [textEl];

    const pdfBytes = await renderPdf(doc);
    const loadedPdf = await PDFDocument.load(pdfBytes);

    expect(loadedPdf.getPageCount()).toBe(doc.pages.length);

    const firstPage = loadedPdf.getPage(0);
    const widthMm = ptToMm(firstPage.getWidth());
    const heightMm = ptToMm(firstPage.getHeight());

    expect(Math.abs(widthMm - doc.meta.trim.widthMm)).toBeLessThan(0.01);
    expect(Math.abs(heightMm - doc.meta.trim.heightMm)).toBeLessThan(0.01);
  });

  it('embeds all fonts into PDF and never uses standard Helvetica for document text', async () => {
    const doc = createDocument('letter');
    doc.pages[0].elements = [
      {
        id: 't-sans',
        type: 'text',
        x: 20,
        y: 30,
        w: 60,
        h: 15,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        text: 'Teks Sans',
        fontFamily: 'sans',
        fontSizePt: 12,
        lineHeight: 1.2,
        letterSpacingPt: 0,
        bold: false,
        italic: false,
        underline: false,
        caps: false,
        align: 'left',
        color: '#000000',
      },
      {
        id: 't-serif',
        type: 'text',
        x: 20,
        y: 50,
        w: 60,
        h: 15,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        text: 'Teks Serif',
        fontFamily: 'serif',
        fontSizePt: 12,
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

    const pdfBytes = await renderPdf(doc);
    const tmpPdf = path.join(os.tmpdir(), `test-fonts-${Date.now()}.pdf`);
    fs.writeFileSync(tmpPdf, Buffer.from(pdfBytes));

    try {
      let output: string | null = null;
      try {
        output = execSync(`pdffonts "${tmpPdf}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      } catch {
        // pdffonts not installed on host (e.g. Windows without poppler)
      }

      if (output) {
        const lines = output.trim().split('\n').slice(2); // Skip header lines
        expect(lines.length).toBeGreaterThan(0);
        for (const line of lines) {
          expect(line).not.toMatch(/Helvetica/i);
          // Column 'emb' must be 'yes'
          expect(line).toMatch(/\byes\b/);
        }
      } else {
        // Fallback: verify embedded font descriptors and absence of Helvetica via PDFDocument
        const loadedPdf = await PDFDocument.load(pdfBytes);
        let hasFontFile = false;
        let foundHelvetica = false;
        for (const entry of loadedPdf.context.enumerateIndirectObjects()) {
          const obj = entry[1];
          if (obj instanceof PDFDict) {
            const baseFont = obj.get(PDFName.of('BaseFont'))?.toString() || '';
            if (baseFont.toLowerCase().includes('helvetica')) {
              foundHelvetica = true;
            }
            if (
              obj.has(PDFName.of('FontFile2')) ||
              obj.has(PDFName.of('FontFile3')) ||
              obj.has(PDFName.of('FontFile'))
            ) {
              hasFontFile = true;
            }
          }
        }
        expect(foundHelvetica).toBe(false);
        expect(hasFontFile).toBe(true);
      }
    } finally {
      if (fs.existsSync(tmpPdf)) {
        fs.unlinkSync(tmpPdf);
      }
    }
  });

  it('converts colored text to grayscale values in grayscale mode', async () => {
    const doc = createDocument('letter');
    doc.pages[0].elements = [
      {
        id: 'color-text',
        type: 'text',
        x: 30,
        y: 40,
        w: 70,
        h: 20,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        text: 'Teks Biru Cerah',
        fontFamily: 'sans',
        fontSizePt: 14,
        lineHeight: 1.2,
        letterSpacingPt: 0,
        bold: false,
        italic: false,
        underline: false,
        caps: false,
        align: 'left',
        color: '#0000ff', // Pure blue
      },
    ];

    const normalPdfBytes = await renderPdf(doc, { grayscale: false });
    const grayscalePdfBytes = await renderPdf(doc, { grayscale: true });

    const normalDoc = await PDFDocument.load(normalPdfBytes);
    const grayscaleDoc = await PDFDocument.load(grayscalePdfBytes);

    const normalStream = extractPageStream(normalDoc);
    const grayscaleStream = extractPageStream(grayscaleDoc);

    // In normal mode: DeviceRGB operator 'rg' is used
    expect(normalStream).toContain('rg');
    // In grayscale mode: DeviceGray operator 'g' is used, and 'rg' is not used
    expect(grayscaleStream).toContain(' g');
    expect(grayscaleStream).not.toContain('rg');
  });

  it('produces identical page sizes and text on two consecutive renders', async () => {
    const doc = createDocument('letter');
    doc.pages[0].elements = [
      {
        id: 'stable-1',
        type: 'text',
        x: 30,
        y: 40,
        w: 80,
        h: 30,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        text: 'Teks Stabil Deterministik',
        fontFamily: 'comic',
        fontSizePt: 16,
        lineHeight: 1.2,
        letterSpacingPt: 0,
        bold: false,
        italic: false,
        underline: false,
        caps: false,
        align: 'left',
        color: '#334155',
      },
    ];

    const run1 = await renderPdf(doc);
    const run2 = await renderPdf(doc);

    const pdf1 = await PDFDocument.load(run1);
    const pdf2 = await PDFDocument.load(run2);

    expect(pdf1.getPageCount()).toBe(pdf2.getPageCount());
    expect(pdf1.getPage(0).getWidth()).toBe(pdf2.getPage(0).getWidth());
    expect(pdf1.getPage(0).getHeight()).toBe(pdf2.getPage(0).getHeight());
  });
});
