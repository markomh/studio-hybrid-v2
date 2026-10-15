import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { FontFamily, loadFont } from '../src/fonts';

describe('Bundled Fonts & Glyphs (I-2, P-3)', () => {
  const families: FontFamily[] = ['sans', 'serif', 'comic', 'mono'];

  it('provides TTF files and LICENSE.txt for each font family', () => {
    const fontsBase = path.resolve(__dirname, '../src/fonts');

    for (const family of families) {
      const familyDir = path.join(fontsBase, family);
      expect(fs.existsSync(familyDir)).toBe(true);

      const files = fs.readdirSync(familyDir);
      const hasTtf = files.some((f) => f.endsWith('.ttf'));
      const hasLicense = files.includes('LICENSE.txt');

      expect(hasTtf).toBe(true);
      expect(hasLicense).toBe(true);
    }
  });

  it('contains no http/https URLs in text files within fonts directory', () => {
    const fontsBase = path.resolve(__dirname, '../src/fonts');
    const checkDir = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          checkDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.txt') || entry.name.endsWith('.ts') || entry.name.endsWith('.json'))) {
          const content = fs.readFileSync(fullPath, 'utf8');
          expect(content).not.toMatch(/https?:\/\//i);
        }
      }
    };

    checkDir(fontsBase);
  });

  it('generates valid glyphs without .notdef for Indonesian text, numbers, and typographic quotes', () => {
    const sampleText = 'Studio Hybrid: 100% Siap Cetak! “Buku Aktivitas & Teka-Teki Terbaik”, ‘Edisi Terbatas’ 2026.';

    for (const family of families) {
      const font = loadFont(family, 'normal', 'normal');
      const run = font.layout(sampleText);

      expect(run.glyphs.length).toBeGreaterThan(0);
      for (let i = 0; i < run.glyphs.length; i++) {
        const glyph = run.glyphs[i];
        // Glyph ID 0 is .notdef in OpenType/TrueType
        expect(glyph.id).toBeGreaterThan(0);
      }
    }
  });
});
