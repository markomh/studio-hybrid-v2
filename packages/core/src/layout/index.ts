import { Document, Page } from '../schema';
import { wrapText, TextLine } from '../text';
import { ptToMm } from '../units';
import { computeMargins } from '../book/margins';

export interface BasePrimitive {
  elementId?: string;
  zIndex?: number;
}

export interface TextLinePrimitive extends BasePrimitive {
  kind: 'text';
  text: string;
  x: number; // mm
  y: number; // mm
  widthMm: number;
  fontSizePt: number;
  fontFamily: 'sans' | 'serif' | 'comic' | 'mono';
  color: string;
  align: 'left' | 'center' | 'right';
  overflow?: boolean;
}

export interface RectPrimitive extends BasePrimitive {
  kind: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

export type LayoutPrimitive = TextLinePrimitive | RectPrimitive;

export interface PageLayoutResult {
  pageId: string;
  widthMm: number;
  heightMm: number;
  bleedMm: number;
  margins: {
    topMm: number;
    bottomMm: number;
    insideMm: number;
    outsideMm: number;
  };
  primitives: LayoutPrimitive[];
}

export function layout(doc: Document, pageId?: string): PageLayoutResult {
  const targetPage: Page | undefined = pageId
    ? doc.pages.find((p) => p.id === pageId)
    : doc.pages[0];

  if (!targetPage) {
    throw new Error(`Halaman dengan id "${pageId}" tidak ditemukan.`);
  }

  const widthMm = doc.meta.trim.widthMm;
  const heightMm = doc.meta.trim.heightMm;
  const bleedMm = doc.meta.bleedMm;

  const primitives: LayoutPrimitive[] = [];

  // 1. Page background (white paper)
  primitives.push({
    kind: 'rect',
    x: 0,
    y: 0,
    width: widthMm,
    height: heightMm,
    fill: doc.meta.paper === 'cream' ? '#fbf8ee' : '#ffffff',
    stroke: '#e2e8f0',
    strokeWidth: 0.5,
  });

  const pageIndex = Math.max(0, doc.pages.findIndex((p) => p.id === targetPage.id));
  const computedMargins = computeMargins(doc, pageIndex);

  // 2. Safe margin boundary (dashed guide)
  primitives.push({
    kind: 'rect',
    x: computedMargins.leftMm,
    y: computedMargins.topMm,
    width: widthMm - (computedMargins.leftMm + computedMargins.rightMm),
    height: heightMm - (computedMargins.topMm + computedMargins.bottomMm),
    fill: 'transparent',
    stroke: '#cbd5e1',
    strokeWidth: 0.25,
    strokeDasharray: '2 2',
  });

  // 3. Elements layout
  for (const el of targetPage.elements) {
    if (el.hidden) continue;

    const lines: TextLine[] = wrapText(
      el.text,
      el.fontFamily,
      el.fontSizePt,
      el.w,
      el.letterSpacingPt
    );

    const lineHeightMm = ptToMm(el.fontSizePt * el.lineHeight);
    const baselineOffsetMm = ptToMm(el.fontSizePt * 0.85);

    lines.forEach((line, idx) => {
      let lineX = el.x;
      if (el.align === 'center') {
        lineX = el.x + (el.w - line.widthMm) / 2;
      } else if (el.align === 'right') {
        lineX = el.x + el.w - line.widthMm;
      }

      const lineY = el.y + baselineOffsetMm + idx * lineHeightMm;

      primitives.push({
        kind: 'text',
        elementId: el.id,
        text: line.text,
        x: Number(lineX.toFixed(4)),
        y: Number(lineY.toFixed(4)),
        widthMm: Number(line.widthMm.toFixed(4)),
        fontSizePt: el.fontSizePt,
        fontFamily: el.fontFamily,
        color: el.color,
        align: el.align,
        overflow: line.overflow,
      });
    });
  }

  return {
    pageId: targetPage.id,
    widthMm,
    heightMm,
    bleedMm,
    margins: {
      topMm: computedMargins.topMm,
      bottomMm: computedMargins.bottomMm,
      insideMm: doc.meta.margins.insideMm,
      outsideMm: doc.meta.margins.outsideMm,
    },
    primitives,
  };
}
