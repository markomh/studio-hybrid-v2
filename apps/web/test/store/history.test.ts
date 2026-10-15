import { enablePatches } from 'immer';
enablePatches();

import { describe, it, expect, beforeEach } from 'vitest';
import { useDocumentStore } from '../../src/store/documentStore';
import { TextElement } from '@studio-hybrid/core';

describe('Document Store History & Undo/Redo (I-4, I-5, I-7)', () => {
  beforeEach(() => {
    const doc = useDocumentStore.getState().document;
    useDocumentStore.getState().setDocument({
      ...doc,
      pages: [
        {
          id: 'page-1',
          role: 'body',
          elements: [],
        },
      ],
    });
  });

  it('adds an undo entry per action; undo and redo restore identical document', () => {
    const store = useDocumentStore.getState();
    const initialDoc = JSON.parse(JSON.stringify(store.document));

    const textEl: TextElement = {
      id: 'el-1',
      type: 'text',
      x: 10,
      y: 20,
      w: 100,
      h: 30,
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
    };

    store.addElement('page-1', textEl);
    expect(useDocumentStore.getState().past.length).toBe(1);
    expect(useDocumentStore.getState().document.pages[0].elements.length).toBe(1);

    // Undo
    useDocumentStore.getState().undo();
    expect(useDocumentStore.getState().document).toEqual(initialDoc);
    expect(useDocumentStore.getState().future.length).toBe(1);

    // Redo
    useDocumentStore.getState().redo();
    expect(useDocumentStore.getState().document.pages[0].elements.length).toBe(1);
    expect(useDocumentStore.getState().past.length).toBe(1);
  });

  it('produces exactly one undo entry for a transaction with three changes', () => {
    const store = useDocumentStore.getState();
    const pageId = 'page-1';

    const el1: TextElement = {
      id: 'el-1', type: 'text', x: 0, y: 0, w: 10, h: 10, rotation: 0, opacity: 1, locked: false, hidden: false,
      text: 'One', fontFamily: 'sans', fontSizePt: 12, lineHeight: 1.2, letterSpacingPt: 0, bold: false, italic: false, underline: false, caps: false, align: 'left', color: '#000'
    };
    const el2: TextElement = {
      id: 'el-2', type: 'text', x: 0, y: 0, w: 10, h: 10, rotation: 0, opacity: 1, locked: false, hidden: false,
      text: 'Two', fontFamily: 'sans', fontSizePt: 12, lineHeight: 1.2, letterSpacingPt: 0, bold: false, italic: false, underline: false, caps: false, align: 'left', color: '#000'
    };
    const el3: TextElement = {
      id: 'el-3', type: 'text', x: 0, y: 0, w: 10, h: 10, rotation: 0, opacity: 1, locked: false, hidden: false,
      text: 'Three', fontFamily: 'sans', fontSizePt: 12, lineHeight: 1.2, letterSpacingPt: 0, bold: false, italic: false, underline: false, caps: false, align: 'left', color: '#000'
    };

    store.transaction('add-three-elements', () => {
      store.addElement(pageId, el1);
      store.addElement(pageId, el2);
      store.addElement(pageId, el3);
    });

    const state = useDocumentStore.getState();
    expect(state.past.length).toBe(1);
    expect(state.past[0].label).toBe('add-three-elements');
    expect(state.document.pages[0].elements.length).toBe(3);

    // Undo should remove all three at once
    store.undo();
    expect(useDocumentStore.getState().document.pages[0].elements.length).toBe(0);
  });

  it('clears redo history when a new action is performed after undo', () => {
    const store = useDocumentStore.getState();
    const el: TextElement = {
      id: 'el-1', type: 'text', x: 0, y: 0, w: 10, h: 10, rotation: 0, opacity: 1, locked: false, hidden: false,
      text: 'A', fontFamily: 'sans', fontSizePt: 12, lineHeight: 1.2, letterSpacingPt: 0, bold: false, italic: false, underline: false, caps: false, align: 'left', color: '#000'
    };

    store.addElement('page-1', el);
    expect(useDocumentStore.getState().past.length).toBe(1);

    store.undo();
    expect(useDocumentStore.getState().future.length).toBe(1);

    // Perform new action
    const el2: TextElement = {
      id: 'el-2', type: 'text', x: 0, y: 0, w: 10, h: 10, rotation: 0, opacity: 1, locked: false, hidden: false,
      text: 'B', fontFamily: 'sans', fontSizePt: 12, lineHeight: 1.2, letterSpacingPt: 0, bold: false, italic: false, underline: false, caps: false, align: 'left', color: '#000'
    };
    store.addElement('page-1', el2);

    expect(useDocumentStore.getState().future.length).toBe(0);
  });

  it('throws an error on direct state mutation (Immer auto-freeze)', () => {
    const store = useDocumentStore.getState();
    const doc = store.document;

    expect(() => {
      // Direct mutation on frozen document object
      (doc.meta as Record<string, unknown>).name = 'Direct Mutation';
    }).toThrow();
  });
});
