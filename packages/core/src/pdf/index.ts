import { PDFDocument, rgb, grayscale, PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { Document } from '../schema';
import { layout } from '../layout';
import { mmToPt } from '../units';
import { getFontFilePath, FontFamily, FontWeight, FontStyle } from '../fonts';

export interface RenderPdfOptions {
  withBleed?: boolean;
  grayscale?: boolean;
  fontBuffers?: Record<string, Uint8Array>;
}

function parseColor(hex: string, isGrayscale?: boolean) {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255 || 0;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255 || 0;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255 || 0;

  if (isGrayscale) {
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    return grayscale(gray);
  }

  return rgb(r, g, b);
}

export async function renderPdf(
  doc: Document,
  options: RenderPdfOptions = {}
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const trim = doc.meta.trim;
  const bleedMm = options.withBleed ? doc.meta.bleedMm : 0;
  const pageWidthMm = trim.widthMm + (options.withBleed ? 2 * bleedMm : 0);
  const pageHeightMm = trim.heightMm + (options.withBleed ? 2 * bleedMm : 0);

  const pageWidthPt = mmToPt(pageWidthMm);
  const pageHeightPt = mmToPt(pageHeightMm);
  const bleedOffsetMm = options.withBleed ? bleedMm : 0;

  const fontCache = new Map<string, PDFFont>();

  const getOrEmbedFont = async (
    family: FontFamily,
    weight: FontWeight = 'normal',
    style: FontStyle = 'normal'
  ): Promise<PDFFont> => {
    const key = `${family}-${weight}-${style}`;
    if (fontCache.has(key)) {
      return fontCache.get(key) as PDFFont;
    }

    let buffer: Uint8Array | null = null;
    if (options.fontBuffers && options.fontBuffers[key]) {
      buffer = options.fontBuffers[key];
    } else {
      try {
        const fs = await import('fs');
        const filePath = getFontFilePath(family, weight, style);
        if (fs.existsSync(filePath)) {
          buffer = fs.readFileSync(filePath);
        } else {
          // Check alternate cwd path
          const alt1 = filePath.replace('/packages/core/packages/core/', '/packages/core/');
          const alt2 = filePath.includes('/packages/core/')
            ? filePath.replace('/packages/core/', '/')
            : filePath.replace('/src/fonts/', '/packages/core/src/fonts/');

          if (fs.existsSync(alt1)) {
            buffer = fs.readFileSync(alt1);
          } else if (fs.existsSync(alt2)) {
            buffer = fs.readFileSync(alt2);
          }
        }
      } catch {
        // In browser or non-Node environment
      }
    }

    if (!buffer) {
      throw new Error(`Font ${key} cannot be embedded: buffer not found.`);
    }

    const embeddedFont = await pdfDoc.embedFont(buffer, { subset: true });
    fontCache.set(key, embeddedFont);
    return embeddedFont;
  };

  for (const page of doc.pages) {
    const pdfPage = pdfDoc.addPage([pageWidthPt, pageHeightPt]);
    const layoutResult = layout(doc, page.id);

    for (const primitive of layoutResult.primitives) {
      if (primitive.kind === 'text') {
        const font = await getOrEmbedFont(primitive.fontFamily, 'normal', 'normal');
        const color = parseColor(primitive.color, options.grayscale);

        const xPt = mmToPt(primitive.x + bleedOffsetMm);
        const yPt = pageHeightPt - mmToPt(primitive.y + bleedOffsetMm);

        pdfPage.drawText(primitive.text, {
          x: xPt,
          y: yPt,
          size: primitive.fontSizePt,
          font,
          color,
        });
      }
    }
  }

  return await pdfDoc.save();
}
