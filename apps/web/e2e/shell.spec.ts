import { test, expect } from '@playwright/test';

test.describe('5-Zone Shell Layout & Focus Mode (F3-A2)', () => {
  const viewports = [
    { width: 1280, height: 720, name: '1280x720' },
    { width: 1440, height: 900, name: '1440x900' },
  ];

  for (const vp of viewports) {
    test(`renders all 5 zones without overlap and no body overflow at ${vp.name}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Verify all 6 regions/zones (Header, Left Rail, Left Panel, Workspace, Inspector, Footer)
      const header = page.locator('[data-testid="shell-header"]');
      const leftRail = page.locator('[data-testid="shell-left-rail"]');
      const leftPanel = page.locator('[data-testid="shell-left-panel"]');
      const workspace = page.locator('[data-testid="shell-canvas-workspace"]');
      const inspector = page.locator('[data-testid="shell-inspector"]');
      const footer = page.locator('[data-testid="shell-footer"]');

      await expect(header).toBeVisible();
      await expect(leftRail).toBeVisible();
      await expect(leftPanel).toBeVisible();
      await expect(workspace).toBeVisible();
      await expect(inspector).toBeVisible();
      await expect(footer).toBeVisible();

      // Check no body scroll overflow
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.body.scrollWidth,
        innerWidth: window.innerWidth,
        scrollHeight: document.body.scrollHeight,
        innerHeight: window.innerHeight,
      }));

      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth);
      expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.innerHeight);

      // Verify bounding boxes do not overlap (allowing 1px border contact)
      const zones = [header, leftRail, leftPanel, workspace, inspector, footer];
      const boxes = [];
      for (const z of zones) {
        const box = await z.boundingBox();
        expect(box).not.toBeNull();
        boxes.push(box!);
      }

      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const b1 = boxes[i];
          const b2 = boxes[j];
          const overlaps =
            b1.x < b2.x + b2.width - 1 &&
            b1.x + b1.width > b2.x + 1 &&
            b1.y < b2.y + b2.height - 1 &&
            b1.y + b1.height > b2.y + 1;
          expect(overlaps).toBe(false);
        }
      }

      // Verify no SVG in shell is wider than 32px
      const svgs = await page.locator('svg').all();
      for (const svg of svgs) {
        const box = await svg.boundingBox();
        if (box) {
          expect(box.width).toBeLessThanOrEqual(32);
        }
      }

      // Take baseline screenshot for both viewports (Criterion F3-A2)
      const screenshot = await page.screenshot();
      await testInfo.attach(`shell-${vp.name}`, {
        body: screenshot,
        contentType: 'image/png',
      });
    });
  }

  test('Focus Mode toggle via button and Tab key (preserves FloatingToolbar)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    const focusBtn = page.locator('[data-testid="btn-focus-mode"]');
    await expect(focusBtn).toBeVisible();
    await expect(focusBtn).toContainText('Mode Fokus');

    // Floating toolbar is present
    await expect(page.locator('[data-testid="floating-toolbar"]')).toBeVisible();

    // Press Tab key in body to toggle Focus Mode
    await page.keyboard.press('Tab');

    // After Tab, Focus Mode should be active -> left rail, panel, inspector hidden
    await expect(focusBtn).toContainText('Keluar Mode Fokus');
    await expect(page.locator('[data-testid="shell-left-rail"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="shell-left-panel"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="shell-inspector"]')).not.toBeVisible();

    // Header, workspace, footer, AND FloatingToolbar remain visible
    await expect(page.locator('[data-testid="shell-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="shell-canvas-workspace"]')).toBeVisible();
    await expect(page.locator('[data-testid="floating-toolbar"]')).toBeVisible();
    await expect(page.locator('[data-testid="shell-footer"]')).toBeVisible();

    // Press Tab again -> exit Focus Mode
    await page.keyboard.press('Tab');
    await expect(focusBtn).toContainText('Mode Fokus');
    await expect(page.locator('[data-testid="shell-left-rail"]')).toBeVisible();
    await expect(page.locator('[data-testid="shell-inspector"]')).toBeVisible();
  });

  test('Inspector can be collapsed and reopened at 1100px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 750 });
    await page.goto('/');

    const inspector = page.locator('[data-testid="shell-inspector"]');
    await expect(inspector).toBeVisible();

    // Close Inspector via close button
    const closeBtn = page.locator('[data-testid="btn-close-inspector"]');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(inspector).not.toBeVisible();

    // Reopen Inspector via open button
    const openBtn = page.locator('[data-testid="btn-open-inspector"]');
    await expect(openBtn).toBeVisible();
    await openBtn.click();
    await expect(inspector).toBeVisible();
  });

  test('Shows min-width warning when viewport is below 1024px', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 700 });
    await page.goto('/');

    const warning = page.locator('.min-width-warning');
    await expect(warning).toBeVisible();
    await expect(warning).toContainText('Gunakan layar yang lebih lebar');
  });

  test('Sequential keyboard focus order across zones and ARIA attributes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    const expectedZones = [
      { id: 'shell-header', role: 'region', label: 'Header' },
      { id: 'shell-left-rail', role: 'region', label: 'Left Rail' },
      { id: 'shell-left-panel', role: 'region', label: 'Left Panel' },
      { id: 'shell-canvas-workspace', role: 'region', label: 'Canvas Workspace' },
      { id: 'shell-inspector', role: 'region', label: 'Inspector' },
      { id: 'shell-footer', role: 'region', label: 'Footer' },
    ];

    // Check roles, aria-labels, and tabIndex
    for (const item of expectedZones) {
      const el = page.locator(`[data-testid="${item.id}"]`);
      await expect(el).toHaveAttribute('role', item.role);
      await expect(el).toHaveAttribute('aria-label', item.label);
      await expect(el).toHaveAttribute('tabindex', '0');
    }

    // Verify DOM sequence: header -> rail -> panel -> workspace -> inspector -> footer
    const domOrderValid = await page.evaluate(() => {
      const ids = [
        'shell-header',
        'shell-left-rail',
        'shell-left-panel',
        'shell-canvas-workspace',
        'shell-inspector',
        'shell-footer',
      ];
      for (let i = 0; i < ids.length - 1; i++) {
        const el1 = document.querySelector(`[data-testid="${ids[i]}"]`);
        const el2 = document.querySelector(`[data-testid="${ids[i + 1]}"]`);
        if (!el1 || !el2) return false;
        const pos = el1.compareDocumentPosition(el2);
        if (!(pos & Node.DOCUMENT_POSITION_FOLLOWING)) return false;
      }
      return true;
    });
    expect(domOrderValid).toBe(true);

    // Verify sequential focus
    for (const item of expectedZones) {
      await page.locator(`[data-testid="${item.id}"]`).focus();
      const isFocused = await page.evaluate(
        (id) => document.activeElement?.getAttribute('data-testid') === id,
        item.id
      );
      expect(isFocused).toBe(true);
    }
  });
});
