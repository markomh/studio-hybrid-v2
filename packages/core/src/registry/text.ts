import { TextElement } from '../schema';
import { wrapText, TextLine } from '../text';
import { ptToMm } from '../units';
import { newId } from '../ids';
import { LayoutPrimitive } from '../layout';
import {
  Capabilities,
  ElementContext,
  ElementDefinition,
  PropertyField,
  PaletteEntry,
} from './types';

export const TEXT_CAPABILITIES: Capabilities = {
  rotate: true,
  flipH: false,
  opacity: false,
  typography: true,
  fill: false,
  stroke: false,
  engine: null,
  solutionKey: false,
};

export const TEXT_PROPERTY_SCHEMA: PropertyField[] = [
  {
    key: 'text',
    labelKey: 'fields.text',
    kind: 'textarea',
    group: 'basic',
  },
  {
    key: 'fontFamily',
    labelKey: 'fields.fontFamily',
    kind: 'select',
    group: 'basic',
    quick: 1,
    options: [
      { value: 'sans', labelKey: 'fonts.sans' },
      { value: 'serif', labelKey: 'fonts.serif' },
      { value: 'comic', labelKey: 'fonts.comic' },
      { value: 'mono', labelKey: 'fonts.mono' },
    ],
  },
  {
    key: 'fontSizePt',
    labelKey: 'fields.fontSizePt',
    kind: 'slider',
    group: 'basic',
    quick: 2,
    unit: 'pt',
    min: 6,
    max: 144,
    step: 1,
  },
  {
    key: 'color',
    labelKey: 'fields.color',
    kind: 'color',
    group: 'basic',
    quick: 3,
  },
  {
    key: 'bold',
    labelKey: 'fields.bold',
    kind: 'switch',
    group: 'basic',
    quick: 4,
  },
  {
    key: 'align',
    labelKey: 'fields.align',
    kind: 'select',
    group: 'basic',
    quick: 5,
    options: [
      { value: 'left', labelKey: 'align.left' },
      { value: 'center', labelKey: 'align.center' },
      { value: 'right', labelKey: 'align.right' },
    ],
  },
  {
    key: 'italic',
    labelKey: 'fields.italic',
    kind: 'switch',
    group: 'basic',
  },
  {
    key: 'underline',
    labelKey: 'fields.underline',
    kind: 'switch',
    group: 'basic',
  },
  {
    key: 'caps',
    labelKey: 'fields.caps',
    kind: 'switch',
    group: 'advanced',
  },
  {
    key: 'lineHeight',
    labelKey: 'fields.lineHeight',
    kind: 'slider',
    group: 'advanced',
    min: 0.8,
    max: 3,
    step: 0.1,
  },
  {
    key: 'letterSpacingPt',
    labelKey: 'fields.letterSpacingPt',
    kind: 'slider',
    group: 'advanced',
    unit: 'pt',
    min: -2,
    max: 20,
    step: 0.5,
  },
];

export const TEXT_PALETTE: PaletteEntry<TextElement>[] = [
  {
    id: 'text-heading',
    labelKey: 'palette.textHeading',
    descriptionKey: 'palette.textHeadingDesc',
    icon: 'Heading',
    keywords: ['judul', 'heading', 'title', 'teks'],
    create(ctx: ElementContext): TextElement {
      const availW = Math.max(20, ctx.pageWidthMm - ctx.margins.leftMm - ctx.margins.rightMm);
      const availH = Math.max(10, ctx.pageHeightMm - ctx.margins.topMm - ctx.margins.bottomMm);
      return {
        id: newId(),
        type: 'text',
        x: ctx.margins.leftMm,
        y: ctx.margins.topMm,
        w: Math.min(120, availW),
        h: Math.min(25, availH),
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        text: 'Judul Halaman',
        fontFamily: 'sans',
        fontSizePt: 24,
        lineHeight: 1.2,
        letterSpacingPt: 0,
        bold: true,
        italic: false,
        underline: false,
        caps: false,
        align: 'left',
        color: '#000000',
      };
    },
  },
  {
    id: 'text-instruction',
    labelKey: 'palette.textInstruction',
    descriptionKey: 'palette.textInstructionDesc',
    icon: 'AlignLeft',
    keywords: ['instruksi', 'petunjuk', 'instruction', 'catatan', 'teks'],
    create(ctx: ElementContext): TextElement {
      const availW = Math.max(20, ctx.pageWidthMm - ctx.margins.leftMm - ctx.margins.rightMm);
      const availH = Math.max(10, ctx.pageHeightMm - ctx.margins.topMm - ctx.margins.bottomMm);
      const offsetY = Math.min(20, Math.max(0, availH - 20));
      return {
        id: newId(),
        type: 'text',
        x: ctx.margins.leftMm,
        y: ctx.margins.topMm + offsetY,
        w: Math.min(100, availW),
        h: Math.min(20, availH),
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        text: 'Petunjuk: Selesaikan aktivitas berikut...',
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
    },
  },
];

export function createDefaultTextElement(ctx: ElementContext): TextElement {
  const availW = Math.max(20, ctx.pageWidthMm - ctx.margins.leftMm - ctx.margins.rightMm);
  const availH = Math.max(10, ctx.pageHeightMm - ctx.margins.topMm - ctx.margins.bottomMm);
  return {
    id: newId(),
    type: 'text',
    x: ctx.margins.leftMm,
    y: ctx.margins.topMm,
    w: Math.min(80, availW),
    h: Math.min(20, availH),
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    text: 'Ketik teks di sini...',
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
}

export function layoutTextElement(el: TextElement): LayoutPrimitive[] {
  const lines: TextLine[] = wrapText(
    el.text,
    el.fontFamily,
    el.fontSizePt,
    el.w,
    el.letterSpacingPt
  );

  const lineHeightMm = ptToMm(el.fontSizePt * el.lineHeight);
  const baselineOffsetMm = ptToMm(el.fontSizePt * 0.85);

  const primitives: LayoutPrimitive[] = [];

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

  return primitives;
}

export const textDefinition: ElementDefinition<TextElement> = {
  type: 'text',
  labelKey: 'elements.text',
  capabilities: TEXT_CAPABILITIES,
  propertySchema: TEXT_PROPERTY_SCHEMA,
  palette: TEXT_PALETTE,
  createDefault: createDefaultTextElement,
  layout: layoutTextElement,
};
