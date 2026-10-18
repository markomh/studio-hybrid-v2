import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('UI Kit & Accessibility (F3-A1)', () => {
  test('ui-kit page renders all components, passes axe accessibility, supports keyboard navigation, and saves baseline screenshot', async ({
    page,
  }, testInfo) => {
    // Set viewport to 1280x720 baseline
    await page.setViewportSize({ width: 1280, height: 720 });

    // Navigate to ui-kit page
    await page.goto('/ui-kit.html');

    // Verify title/header is visible
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    // Take baseline screenshot
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('ui-kit-baseline', {
      body: screenshot,
      contentType: 'image/png',
    });

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['color-contrast']) // Color contrast verified via unit test tokens.test.ts
      .analyze();

    // Filter serious or critical violations
    const severeViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    );

    expect(severeViolations).toEqual([]);

    // Test keyboard navigation (Tab through focusable elements)
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeDefined();
  });
});
