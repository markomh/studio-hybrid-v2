import { describe, it, expect } from 'vitest';
import { DocumentSchema, createDocument } from '../src';

describe('Document Schema Validation (I-7)', () => {
  it('allows valid document created by createDocument', () => {
    const doc = createDocument('letter');
    const result = DocumentSchema.safeParse(doc);
    expect(result.success).toBe(true);
  });

  it('rejects document with opacity > 1 with path pointer', () => {
    const doc = createDocument('letter');
    doc.pages[0].elements.push({
      id: 'el-1',
      type: 'text',
      x: 10,
      y: 10,
      w: 50,
      h: 20,
      rotation: 0,
      opacity: 1.5, // Invalid (> 1)
      locked: false,
      hidden: false,
      text: 'Hello',
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
    });

    const result = DocumentSchema.safeParse(doc);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errString = JSON.stringify(result.error.issues);
      expect(errString).toContain('opacity');
    }
  });

  it('rejects document with unknown page role', () => {
    const doc = createDocument('letter');
    (doc.pages[0] as Record<string, unknown>).role = 'invalid_role';

    const result = DocumentSchema.safeParse(doc);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errString = JSON.stringify(result.error.issues);
      expect(errString).toContain('role');
    }
  });
});
