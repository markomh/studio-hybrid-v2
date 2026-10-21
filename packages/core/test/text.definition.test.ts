import { describe, it, expect } from 'vitest';
import { textDefinition, TEXT_CAPABILITIES } from '../src/registry/text';
import { TextElementSchema, createDocument } from '../src';
import { ElementContext } from '../src/registry/types';
import { computeMargins } from '../src/book/margins';

describe('Text Element Definition (F2-6a)', () => {
  it('has capabilities exactly matching the table in DATA_MODEL.md', () => {
    // Exact table in DATA_MODEL.md:
    // text | rotate: ya | flipH: tidak | opacity: tidak | typography: ya | fill: tidak | stroke: tidak | engine: — | solutionKey: tidak
    expect(textDefinition.capabilities).toEqual({
      rotate: true,
      flipH: false,
      opacity: false,
      typography: true,
      fill: false,
      stroke: false,
      engine: null,
      solutionKey: false,
    });
    expect(TEXT_CAPABILITIES).toEqual(textDefinition.capabilities);
  });

  it('has a valid propertySchema (unique keys, min < max, non-empty select options, valid groups, valid quick attributes)', () => {
    const schema = textDefinition.propertySchema;
    expect(schema.length).toBeGreaterThan(0);

    // 1. Kunci unik
    const keys = schema.map((field) => field.key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);

    // 2. min < max when both exist
    for (const field of schema) {
      if (field.min !== undefined && field.max !== undefined) {
        expect(field.min).toBeLessThan(field.max);
      }
    }

    // 3. Opsi select tidak kosong
    const selectFields = schema.filter((field) => field.kind === 'select');
    expect(selectFields.length).toBeGreaterThan(0);
    for (const field of selectFields) {
      expect(field.options).toBeDefined();
      expect(Array.isArray(field.options)).toBe(true);
      expect(field.options!.length).toBeGreaterThan(0);
      for (const opt of field.options!) {
        expect(opt.value).toBeDefined();
        expect(opt.labelKey).toBeDefined();
      }
    }

    // 4. Group hanya 'basic' atau 'advanced'
    for (const field of schema) {
      expect(['basic', 'advanced']).toContain(field.group);
    }

    // 5. Nilai quick adalah bilangan bulat unik dan jumlah quick <= 6
    const quickFields = schema.filter((field) => field.quick !== undefined);
    expect(quickFields.length).toBeLessThanOrEqual(6);

    const quickValues = quickFields.map((field) => field.quick as number);
    for (const val of quickValues) {
      expect(Number.isInteger(val)).toBe(true);
      expect(val).toBeGreaterThan(0);
    }

    const uniqueQuickValues = new Set(quickValues);
    expect(uniqueQuickValues.size).toBe(quickValues.length);
  });

  it('has palette entries for page title (24 pt) and instruction (12 pt)', () => {
    const palette = textDefinition.palette;
    expect(palette.length).toBe(2);

    const titleEntry = palette.find((p) => p.id === 'text-heading');
    expect(titleEntry).toBeDefined();
    expect(titleEntry?.labelKey).toBeDefined();
    expect(titleEntry?.descriptionKey).toBeDefined();

    const instructionEntry = palette.find((p) => p.id === 'text-instruction');
    expect(instructionEntry).toBeDefined();
    expect(instructionEntry?.labelKey).toBeDefined();
    expect(instructionEntry?.descriptionKey).toBeDefined();
  });

  const presets = ['letter', 'a4', '6x9'] as const;

  for (const preset of presets) {
    it(`createDefault produces a schema-valid element located strictly inside page margins on "${preset}"`, () => {
      const doc = createDocument(preset);
      const computedMargins = computeMargins(doc, 0);
      const ctx: ElementContext = {
        pageWidthMm: doc.meta.trim.widthMm,
        pageHeightMm: doc.meta.trim.heightMm,
        margins: computedMargins,
      };

      const element = textDefinition.createDefault(ctx);

      // 1. Validasi Zod schema
      expect(() => TextElementSchema.parse(element)).not.toThrow();

      // 2. Berada di dalam margin halaman (left, right, top, bottom)
      expect(element.x).toBeGreaterThanOrEqual(ctx.margins.leftMm);
      expect(element.x + element.w).toBeLessThanOrEqual(ctx.pageWidthMm - ctx.margins.rightMm);
      expect(element.y).toBeGreaterThanOrEqual(ctx.margins.topMm);
      expect(element.y + element.h).toBeLessThanOrEqual(ctx.pageHeightMm - ctx.margins.bottomMm);
    });

    it(`palette entries create elements located inside page margins on "${preset}" with expected font sizes`, () => {
      const doc = createDocument(preset);
      const computedMargins = computeMargins(doc, 0);
      const ctx: ElementContext = {
        pageWidthMm: doc.meta.trim.widthMm,
        pageHeightMm: doc.meta.trim.heightMm,
        margins: computedMargins,
      };

      for (const entry of textDefinition.palette) {
        const element = entry.create(ctx);

        // Schema validation
        expect(() => TextElementSchema.parse(element)).not.toThrow();

        // Located strictly inside margins
        expect(element.x).toBeGreaterThanOrEqual(ctx.margins.leftMm);
        expect(element.x + element.w).toBeLessThanOrEqual(ctx.pageWidthMm - ctx.margins.rightMm);
        expect(element.y).toBeGreaterThanOrEqual(ctx.margins.topMm);
        expect(element.y + element.h).toBeLessThanOrEqual(ctx.pageHeightMm - ctx.margins.bottomMm);

        if (entry.id === 'text-heading') {
          expect(element.fontSizePt).toBe(24);
        } else if (entry.id === 'text-instruction') {
          expect(element.fontSizePt).toBe(12);
        }
      }
    });
  }
});
