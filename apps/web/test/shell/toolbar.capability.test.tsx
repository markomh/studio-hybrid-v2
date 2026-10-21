import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  listDefinitions,
  registerElement,
  Element,
  ElementDefinition,
} from '@studio-hybrid/core';
import { FloatingToolbar } from '../../src/shell/FloatingToolbar';
import { useDocumentStore } from '../../src/store/documentStore';
import { i18n } from '../../src/i18n';

describe('FloatingToolbar Capabilities & Schema (F3-B1)', () => {
  beforeEach(() => {
    const doc = useDocumentStore.getState().document;
    useDocumentStore.getState().setDocument({
      ...doc,
      pages: [
        {
          id: 'page-test',
          role: 'body',
          elements: [],
        },
      ],
    });
  });

  it('renders exact controls derived from capabilities and quick schema for every registered type, with count <= 6', () => {
    const definitions = listDefinitions();
    expect(definitions.length).toBeGreaterThan(0);

    const ctx = {
      pageWidthMm: 215.9,
      pageHeightMm: 279.4,
      margins: { topMm: 15, bottomMm: 15, leftMm: 15, rightMm: 15 },
    };

    for (const def of definitions) {
      const el = def.createDefault(ctx);
      el.id = `el-${def.type}`;

      useDocumentStore.setState({
        document: {
          ...useDocumentStore.getState().document,
          pages: [
            {
              id: 'page-test',
              role: 'body',
              elements: [el],
            },
          ],
        },
      });

      const html = renderToString(
        <FloatingToolbar selectedElementId={el.id} activePageId="page-test" />
      );

      // 1. Quick schema controls
      const quickFields = def.propertySchema.filter((f) => f.quick !== undefined);
      for (const field of quickFields) {
        expect(html, `Expected quick field ${field.key} for type ${def.type}`).toContain(
          `data-testid="quick-field-${field.key}"`
        );
      }

      // 2. Opacity
      if (def.capabilities.opacity) {
        expect(html, `Expected opacity control for ${def.type}`).toContain('data-testid="control-opacity"');
      } else {
        expect(html, `Expected NO opacity control for ${def.type}`).not.toContain('data-testid="control-opacity"');
      }

      // 3. FlipH
      if (def.capabilities.flipH) {
        expect(html, `Expected flipH control for ${def.type}`).toContain('data-testid="control-flip-h"');
      } else {
        expect(html, `Expected NO flipH control for ${def.type}`).not.toContain('data-testid="control-flip-h"');
      }

      // 4. Engine
      if (def.capabilities.engine) {
        expect(html, `Expected engine control for ${def.type}`).toContain('data-testid="control-engine"');
        expect(html).toContain(`aria-label="${def.capabilities.engine.label}"`);
      } else {
        expect(html, `Expected NO engine control for ${def.type}`).not.toContain('data-testid="control-engine"');
      }

      // 5. Total type-specific controls count <= 6
      const typeSpecificMatches = html.match(/data-type-specific="true"/g) || [];
      expect(
        typeSpecificMatches.length,
        `Type ${def.type} has ${typeSpecificMatches.length} type-specific controls, must be <= 6`
      ).toBeLessThanOrEqual(6);

      // 6. Universal capsule always present
      expect(html).toContain('data-testid="toolbar-btn-lock"');
      expect(html).toContain('data-testid="toolbar-btn-duplicate"');
      expect(html).toContain('data-testid="toolbar-btn-delete"');
      expect(html).toContain('data-testid="toolbar-btn-layer-order"');
    }
  });

  it('dynamically renders controls for a newly registered custom type without altering toolbar code', () => {
    const customType = 'custom-widget';
    const customDef: ElementDefinition<any> = {
      type: customType,
      labelKey: 'custom.widget',
      capabilities: {
        rotate: true,
        flipH: true,
        opacity: false,
        typography: false,
        fill: false,
        stroke: false,
        engine: { label: 'Acak Widget' },
        solutionKey: false,
      },
      propertySchema: [
        {
          key: 'speed',
          labelKey: 'fields.speed',
          kind: 'slider',
          group: 'basic',
          quick: 1,
          min: 1,
          max: 10,
        },
      ],
      palette: [],
      createDefault: () => ({
        id: 'widget-1',
        type: customType,
        x: 10,
        y: 10,
        w: 50,
        h: 50,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        speed: 5,
      }),
      layout: () => [],
    };

    registerElement(customDef);

    const customEl = customDef.createDefault({
      pageWidthMm: 200,
      pageHeightMm: 200,
      margins: { topMm: 10, bottomMm: 10, leftMm: 10, rightMm: 10 },
    });

    useDocumentStore.setState({
      document: {
        ...useDocumentStore.getState().document,
        pages: [
          {
            id: 'page-test',
            role: 'body',
            elements: [customEl],
          },
        ],
      },
    });

    const html = renderToString(
      <FloatingToolbar selectedElementId={customEl.id} activePageId="page-test" />
    );

    // Custom quick field speed must appear
    expect(html).toContain('data-testid="quick-field-speed"');
    // flipH must appear
    expect(html).toContain('data-testid="control-flip-h"');
    // engine button with label 'Acak Widget' must appear
    expect(html).toContain('data-testid="control-engine"');
    expect(html).toContain('aria-label="Acak Widget"');
    // opacity must NOT appear
    expect(html).not.toContain('data-testid="control-opacity"');
  });

  it('disables geometric and editing controls when element is locked, and displays "Buka kunci"', () => {
    const lockedEl: Element = {
      id: 'el-locked',
      type: 'text',
      x: 10,
      y: 10,
      w: 80,
      h: 20,
      rotation: 0,
      opacity: 1,
      locked: true,
      hidden: false,
      text: 'Locked Text',
      fontFamily: 'sans',
      fontSizePt: 14,
      lineHeight: 1.2,
      letterSpacingPt: 0,
      bold: false,
      italic: false,
      underline: false,
      caps: false,
      align: 'left',
      color: '#000000',
    } as any;

    useDocumentStore.setState({
      document: {
        ...useDocumentStore.getState().document,
        pages: [
          {
            id: 'page-test',
            role: 'body',
            elements: [lockedEl],
          },
        ],
      },
    });

    const html = renderToString(
      <FloatingToolbar selectedElementId={lockedEl.id} activePageId="page-test" />
    );

    // Lock button should display "Buka kunci"
    expect(html).toContain(`aria-label="${i18n.toolbar.unlock}"`);

    // Duplicate, delete, layer order must be disabled
    expect(html).toMatch(/data-testid="toolbar-btn-duplicate"[^>]*disabled/);
    expect(html).toMatch(/data-testid="toolbar-btn-delete"[^>]*disabled/);
    expect(html).toMatch(/data-testid="toolbar-btn-layer-order"[^>]*disabled/);

    // Quick fields must be disabled
    expect(html).toMatch(/data-testid="quick-field-fontFamily"[^>]*disabled/);
    expect(html).toMatch(/data-testid="quick-field-fontSizePt"[^>]*disabled/);
    expect(html).toMatch(/data-testid="quick-field-color"[^>]*disabled/);
    expect(html).toMatch(/data-testid="quick-field-bold"[^>]*disabled/);
    expect(html).toMatch(/data-testid="quick-field-align"[^>]*disabled/);
  });

  it('ensures all interactive controls have aria-label from dictionary', () => {
    const unlockedEl: Element = {
      id: 'el-keys',
      type: 'text',
      x: 10,
      y: 10,
      w: 80,
      h: 20,
      rotation: 0,
      opacity: 1,
      locked: false,
      hidden: false,
      text: 'Test Text',
      fontFamily: 'sans',
      fontSizePt: 14,
      lineHeight: 1.2,
      letterSpacingPt: 0,
      bold: false,
      italic: false,
      underline: false,
      caps: false,
      align: 'left',
      color: '#000000',
    } as any;

    useDocumentStore.setState({
      document: {
        ...useDocumentStore.getState().document,
        pages: [
          {
            id: 'page-test',
            role: 'body',
            elements: [unlockedEl],
          },
        ],
      },
    });

    const html = renderToString(
      <FloatingToolbar selectedElementId={unlockedEl.id} activePageId="page-test" />
    );

    // Universal controls have aria-label
    expect(html).toContain(`aria-label="${i18n.toolbar.lock}"`);
    expect(html).toContain(`aria-label="${i18n.toolbar.duplicate}"`);
    expect(html).toContain(`aria-label="${i18n.toolbar.delete}"`);
    expect(html).toContain(`aria-label="${i18n.toolbar.layerOrder}"`);

    // Quick fields have aria-label
    expect(html).toContain('aria-label="Jenis Huruf"');
    expect(html).toContain('aria-label="Ukuran Huruf"');
    expect(html).toContain('aria-label="Warna"');
    expect(html).toContain('aria-label="Tebal"');
    expect(html).toContain('aria-label="Perataan"');
  });
});
