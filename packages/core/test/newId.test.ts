import { describe, it, expect } from 'vitest';
import { newId } from '../src/ids';
import fs from 'fs';
import path from 'path';

describe('newId generator (F2-6a)', () => {
  it('generates 10,000 unique UUID v4 formatted identifiers', () => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const count = 10000;
    const set = new Set<string>();

    for (let i = 0; i < count; i++) {
      const id = newId();
      expect(uuidRegex.test(id)).toBe(true);
      set.add(id);
    }

    expect(set.size).toBe(count);
  });

  it('ensures no Date.now() usage remains in apps/web/src', () => {
    const webSrcDir = path.resolve(__dirname, '../../../apps/web/src');

    function scanDir(dir: string) {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          expect(content).not.toContain('Date.now()');
        }
      }
    }

    scanDir(webSrcDir);
  });
});
