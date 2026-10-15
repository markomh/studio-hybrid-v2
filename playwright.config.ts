import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'pnpm --filter @studio-hybrid/web dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
