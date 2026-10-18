import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from '../../src/App';
import { i18n } from '../../src/i18n';

describe('5-Zone Shell Layout & Focus Mode (F1-7, V1 Parity)', () => {
  it('renders all 5 zones (header, left rail, panel, canvas workspace, inspector, footer)', () => {
    const html = renderToString(<App initialFocusMode={false} />);

    // Zone 1: Header
    expect(html).toContain('data-testid="shell-header"');
    // Zone 2: Left Rail
    expect(html).toContain('data-testid="shell-left-rail"');
    // Zone 3: Left Panel
    expect(html).toContain('data-testid="shell-left-panel"');
    // Zone 4: Canvas Workspace
    expect(html).toContain('data-testid="shell-canvas-workspace"');
    // Zone 5: Right Inspector
    expect(html).toContain('data-testid="shell-inspector"');
    // Zone 6 / Footer
    expect(html).toContain('data-testid="shell-footer"');
  });

  it('renders UI text via i18n dictionary across all zones', () => {
    const html = renderToString(<App initialFocusMode={false} />);

    // Header i18n texts
    expect(html).toContain(i18n.appName);
    expect(html).toContain(i18n.header.focusMode);
    expect(html).toContain(i18n.header.utilities);
    expect(html).toContain(i18n.header.export);

    // Left Rail i18n texts
    expect(html).toContain(i18n.rail.elements);
    expect(html).toContain(i18n.rail.frame);
    expect(html).toContain(i18n.rail.pages);

    // Left Panel i18n texts
    expect(html).toContain(i18n.panel.canvasElements);
    expect(html).toContain(i18n.panel.puzzles);
    expect(html).toContain(i18n.panel.labirin);
    expect(html).toContain(i18n.panel.sudoku);

    // Inspector i18n texts
    expect(html).toContain(i18n.inspector.pageProps);
    expect(html).toContain(i18n.inspector.trimSize);
    expect(html).toContain(i18n.inspector.pageContext);

    // Footer i18n texts
    expect(html).toContain(i18n.footer.guides);
    expect(html).toContain(i18n.footer.monochrome);
    expect(html).toContain(i18n.footer.fit);
  });

  it('Focus Mode hides left rail, left panel, and inspector while keeping header/toolbar visible', () => {
    // 1. Normal Mode: Left Rail, Left Panel, and Inspector are visible
    const normalHtml = renderToString(<App initialFocusMode={false} />);
    expect(normalHtml).toContain('data-testid="shell-left-rail"');
    expect(normalHtml).toContain('data-testid="shell-left-panel"');
    expect(normalHtml).toContain('data-testid="shell-inspector"');
    expect(normalHtml).toContain('data-testid="shell-header"');
    expect(normalHtml).toContain('data-testid="btn-focus-mode"');

    // 2. Focus Mode: Left Rail, Panel, and Inspector are hidden; Header, Workspace, and Footer remain visible
    const focusHtml = renderToString(<App initialFocusMode={true} />);
    expect(focusHtml).not.toContain('data-testid="shell-left-rail"');
    expect(focusHtml).not.toContain('data-testid="shell-left-panel"');
    expect(focusHtml).not.toContain('data-testid="shell-inspector"');

    // Header/toolbar, workspace, and footer must remain visible
    expect(focusHtml).toContain('data-testid="shell-header"');
    expect(focusHtml).toContain('data-testid="btn-focus-mode"');
    expect(focusHtml).toContain('data-testid="shell-canvas-workspace"');
    expect(focusHtml).toContain('data-testid="floating-toolbar"');
    expect(focusHtml).toContain('data-testid="shell-footer"');
  });

  it('assigns role="region" and aria-label to all shell zones', () => {
    const html = renderToString(<App initialFocusMode={false} />);

    expect(html).toContain('role="region" aria-label="Header"');
    expect(html).toContain('role="region" aria-label="Left Rail"');
    expect(html).toContain('role="region" aria-label="Left Panel"');
    expect(html).toContain('role="region" aria-label="Canvas Workspace"');
    expect(html).toContain('role="region" aria-label="Inspector"');
    expect(html).toContain('role="region" aria-label="Footer"');
  });

  it('renders min-width-warning banner with i18n text', () => {
    const html = renderToString(<App initialFocusMode={false} />);
    expect(html).toContain('class="min-width-warning"');
    expect(html).toContain(i18n.minWidthWarning);
  });
});
