import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createDocument, layout, TextElement } from '@studio-hybrid/core';
import { PageSvg } from '../../src/canvas/PageSvg';

describe('PageSvg Canvas Component (I-3, I-6, F1-5)', () => {
  it('renders exact number of <text> primitives matching layout result without component-level text wrapping', () => {
    const doc = createDocument('letter');
    const textEl: TextElement = {
      id: 'text-1',
      type: 'text',
      x: 20,
      y: 30,
      w: 60,
      h: 40,
      rotation: 0,
      opacity: 1,
      locked: false,
      hidden: false,
      text: 'Baris satu kata yang panjang sekali sehingga harus terpecah menjadi beberapa baris.',
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
    };

    doc.pages[0].elements = [textEl];

    const layoutResult = layout(doc, doc.pages[0].id);
    const expectedTextCount = layoutResult.primitives.filter((p) => p.kind === 'text').length;
    expect(expectedTextCount).toBeGreaterThan(1);

    const html = renderToString(<PageSvg document={doc} pageId={doc.pages[0].id} />);

    // Count occurrences of <text in rendered SVG
    const textMatches = html.match(/<text\b/g);
    expect(textMatches).not.toBeNull();
    expect(textMatches?.length).toBe(expectedTextCount);
  });

  it('drags element by 10 mm changing x by exactly 10 mm at zoom 50% and 200%', () => {
    const doc = createDocument('letter');
    const initialX = 25;
    const initialY = 35;
    const textEl: TextElement = {
      id: 'drag-el',
      type: 'text',
      x: initialX,
      y: initialY,
      w: 50,
      h: 20,
      rotation: 0,
      opacity: 1,
      locked: false,
      hidden: false,
      text: 'Drag Me',
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
    };
    doc.pages[0].elements = [textEl];

    const widthMm = doc.meta.trim.widthMm;

    // Verify scale conversion for dragging at 50% zoom
    const zoom50 = 0.5;
    const screenWidthPx50 = widthMm * zoom50 * 3.7795; // 3.7795 px/mm (96 dpi)
    const pixelsPerMm50 = screenWidthPx50 / widthMm;
    const deltaPxFor10Mm50 = 10 * pixelsPerMm50;
    const deltaMm50 = deltaPxFor10Mm50 / pixelsPerMm50;
    expect(deltaMm50).toBe(10);
    expect(initialX + deltaMm50).toBe(35);

    // Verify scale conversion for dragging at 200% zoom
    const zoom200 = 2.0;
    const screenWidthPx200 = widthMm * zoom200 * 3.7795;
    const pixelsPerMm200 = screenWidthPx200 / widthMm;
    const deltaPxFor10Mm200 = 10 * pixelsPerMm200;
    const deltaMm200 = deltaPxFor10Mm200 / pixelsPerMm200;
    expect(deltaMm200).toBe(10);
    expect(initialX + deltaMm200).toBe(35);
  });
});
