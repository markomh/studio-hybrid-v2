import { Document, Page } from '../schema';
import { computeMargins } from '../book/margins';
import { getElementDefinition, ElementDefinitionNotFoundError } from '../registry';

export interface BasePrimitive {
  elementId?: string;
  zIndex?: number;
  opacity?: number;
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
  rx?: number;
  ry?: number;
}

export interface LinePrimitive extends BasePrimitive {
  kind: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
}

export interface PathPrimitive extends BasePrimitive {
  kind: 'path';
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

export interface EllipsePrimitive extends BasePrimitive {
  kind: 'ellipse';
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

export type LayoutPrimitive =
  | TextLinePrimitive
  | RectPrimitive
  | LinePrimitive
  | PathPrimitive
  | EllipsePrimitive;

export const MIN_CELL_MM = 3.5;

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
  warnings: string[];
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
  const warnings: string[] = [];

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

  // 3. Elements layout via registry definition
  for (const el of targetPage.elements) {
    if (el.hidden) continue;

    const def = getElementDefinition(el);
    if (!def) {
      throw new ElementDefinitionNotFoundError(el.type);
    }
    const elementPrimitives = def.layout(el, {
      pageWidthMm: widthMm,
      pageHeightMm: heightMm,
      margins: computedMargins,
      warnings,
    });
    primitives.push(...elementPrimitives);
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
    warnings,
  };
}
