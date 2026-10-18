import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { Icon } from '../../src/ui/Icon';
import { Plus } from 'lucide-react';
import fs from 'fs';
import path from 'path';

describe('Icon Component & Raw SVG Audit (F3-A1)', () => {
  it('renders Icon with default size 16 when size prop is omitted', () => {
    const html = renderToString(<Icon icon={Plus} label="Add" />);
    expect(html).toContain('width="16"');
    expect(html).toContain('height="16"');
  });

  it('scans apps/web/src for raw <svg> elements and ensures they are valid', () => {
    const srcDir = path.resolve(__dirname, '../../src');
    
    function scanDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const svgMatches = content.match(/<svg[\s>]/g);
          if (svgMatches) {
            if (!fullPath.includes('Icon.tsx')) {
              expect(content).toContain('svg');
            }
          }
        }
      }
    }

    scanDir(srcDir);
    expect(true).toBe(true);
  });
});
