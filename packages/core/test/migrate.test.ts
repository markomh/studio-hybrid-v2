import { describe, it, expect } from 'vitest';
import { migrate, createDocument } from '../src';

describe('Document Migration & Factory (I-7)', () => {
  it('rejects input without schemaVersion', () => {
    const invalidDoc = { id: 'doc-1', meta: {}, pages: [] };
    expect(() => migrate(invalidDoc)).toThrowError(/schemaVersion/);
  });

  it('rejects non-object input', () => {
    expect(() => migrate(null)).toThrowError();
    expect(() => migrate('string')).toThrowError();
  });

  it('passes version 1 input without changes', () => {
    const doc = createDocument('letter');
    const migrated = migrate(doc);
    expect(migrated).toEqual(doc);
  });

  it('creates Letter document with correct dimensions (215.9 x 279.4 mm) and bleed (3.175 mm)', () => {
    const doc = createDocument('letter');
    expect(doc.meta.trim.widthMm).toBe(215.9);
    expect(doc.meta.trim.heightMm).toBe(279.4);
    expect(doc.meta.bleedMm).toBe(3.175);
  });
});
