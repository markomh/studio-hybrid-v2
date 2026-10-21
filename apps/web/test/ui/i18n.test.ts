import { describe, it, expect } from 'vitest';
import { t } from '../../src/i18n';
import fs from 'fs';
import path from 'path';

describe('I18n Dictionary & Usage (F3-A1)', () => {
  it('has a valid translation function t()', () => {
    expect(typeof t).toBe('function');
    expect(t('uiKit.title')).toBeDefined();
    expect(typeof t('uiKit.title')).toBe('string');
  });

  it('scans component .tsx files to ensure i18n usage or lack of unlocalized Indonesian text in titles', () => {
    const srcDir = path.resolve(__dirname, '../../src');
    const prohibitedHardcodedTitles = [
      'title="Kunci Elemen"',
      'title="Halaman Berikutnya"',
      'title="Halaman Sebelumnya"',
      'title="Duplikasi Elemen"',
      'title="Bawa ke Atas"',
      'title="Turunkan ke Bawah"',
      'title="Hapus Elemen"',
      'title="Tutup Inspector"',
      'title="Buka Inspector"',
    ];
    
    function scanDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          for (const phrase of prohibitedHardcodedTitles) {
            expect(content).not.toContain(phrase);
          }
        }
      }
    }

    scanDir(srcDir);
  });
});
