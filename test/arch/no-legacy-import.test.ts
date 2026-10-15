import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('Architecture: No Legacy/Docs Import', () => {
  it('fails dependency-cruiser when core imports from docs or legacy-src', () => {
    const violationPath = path.resolve(process.cwd(), 'packages/core/src/_violation_legacy.ts');
    fs.writeFileSync(violationPath, "import { generateMaze } from '../../../docs/legacy-src/mazeGenerator';\nexport const m = generateMaze;\n");

    try {
      execSync('npx depcruise --validate .dependency-cruiser.cjs packages apps', { stdio: 'pipe' });
      expect.fail('Expected depcruise to fail due to legacy import');
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
