import { describe, it, expect } from 'vitest';
import { createDocument } from './index';

describe('core index', () => {
  it('creates document', () => {
    const doc = createDocument('letter');
    expect(doc).toBeDefined();
    expect(doc.schemaVersion).toBe(1);
  });
});
