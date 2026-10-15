import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('Architecture: Core Purity (I-2)', () => {
  it('fails dependency-cruiser when core imports react', () => {
    const violationPath = path.resolve(process.cwd(), 'packages/core/src/_violation_react.ts');
    fs.writeFileSync(violationPath, "// @ts-ignore\nimport React from 'react';\nexport const x = 1;\n");

    try {
      execSync('npx depcruise --validate .dependency-cruiser.cjs packages apps', { stdio: 'pipe' });
      expect.fail('Expected depcruise to fail due to React import in core');
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
