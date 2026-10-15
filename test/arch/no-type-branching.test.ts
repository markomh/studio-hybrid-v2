import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('Architecture: No Type Branching in UI (I-3)', () => {
  it('fails eslint when UI compares element.type to literal', () => {
    const violationPath = path.resolve(process.cwd(), 'apps/web/src/_violation_type.tsx');
    fs.writeFileSync(violationPath, "export function BadComponent(el: { type: string }) {\n  if (el.type === 'text') return null;\n  return null;\n}\n");

    try {
      execSync(`npx eslint "${violationPath}"`, { stdio: 'pipe' });
      expect.fail('Expected eslint to fail due to element.type branching');
    } catch (err: unknown) {
      const errorObj = err as { status?: number };
      expect(errorObj.status).not.toBe(0);
    } finally {
      if (fs.existsSync(violationPath)) {
        fs.unlinkSync(violationPath);
      }
    }
  });
});
