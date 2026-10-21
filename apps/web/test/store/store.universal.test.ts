import { enablePatches } from 'immer';
enablePatches();

import { describe, it, expect, beforeEach } from 'vitest';
import { useDocumentStore } from '../../src/store/documentStore';
import { TextElement } from '@studio-hybrid/core';

describe('Universal Store Actions (F3-B1)', () => {
  const initialTextEl: TextElement = {
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
    text: 'Elemen Pertama',
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

  const secondTextEl: TextElement = {
    ...initialTextEl,
    id: 'el-2',
    text: 'Elemen Kedua',
    x: 40,
    y: 50,
  };

  beforeEach(() => {
    const doc = useDocumentStore.getState().document;
    useDocumentStore.getState().setDocument({
      ...doc,
      pages: [
        {
          id: 'page-1',
          role: 'body',
          elements: [JSON.parse(JSON.stringify(initialTextEl)), JSON.parse(JSON.stringify(secondTextEl))],
        },
      ],
    });
  });

  describe('toggleLock', () => {
    it('toggles locked property with exactly 1 undo entry, and undo restores identical document', () => {
      const store = useDocumentStore.getState();
      const initialDoc = JSON.parse(JSON.stringify(store.document));

      // Initial locked status is false
      expect(store.document.pages[0].elements[0].locked).toBe(false);

      // Lock el-1
      store.toggleLock('el-1');
      expect(useDocumentStore.getState().past.length).toBe(1);
      expect(useDocumentStore.getState().document.pages[0].elements[0].locked).toBe(true);

      // Undo restores toEqual original document
      useDocumentStore.getState().undo();
      expect(useDocumentStore.getState().document).toEqual(initialDoc);
      expect(useDocumentStore.getState().document.pages[0].elements[0].locked).toBe(false);

      // Redo restores locked status
      useDocumentStore.getState().redo();
      expect(useDocumentStore.getState().document.pages[0].elements[0].locked).toBe(true);
    });

    it('supports array of ids in toggleLock with a single undo entry', () => {
      const store = useDocumentStore.getState();
      const initialDoc = JSON.parse(JSON.stringify(store.document));

      store.toggleLock(['el-1', 'el-2']);
      expect(useDocumentStore.getState().past.length).toBe(1);
      expect(useDocumentStore.getState().document.pages[0].elements[0].locked).toBe(true);
      expect(useDocumentStore.getState().document.pages[0].elements[1].locked).toBe(true);

      useDocumentStore.getState().undo();
      expect(useDocumentStore.getState().document).toEqual(initialDoc);
    });
  });

  describe('duplicateElement', () => {
    it('duplicates element with new unique id and +5mm offset, exactly 1 undo entry', () => {
      const store = useDocumentStore.getState();
      const initialDoc = JSON.parse(JSON.stringify(store.document));

      const newId = store.duplicateElement('page-1', 'el-1');
      expect(newId).toBeTruthy();
      expect(newId).not.toBe('el-1');

      const elements = useDocumentStore.getState().document.pages[0].elements;
      expect(elements.length).toBe(3);

      const duplicated = elements.find((e) => e.id === newId);
      expect(duplicated).toBeDefined();
      expect(duplicated?.x).toBe(initialTextEl.x + 5);
      expect(duplicated?.y).toBe(initialTextEl.y + 5);

      // Verify no duplicate IDs in entire document
      const allIds = useDocumentStore
        .getState()
        .document.pages.flatMap((p) => p.elements.map((e) => e.id));
      const uniqueIds = new Set(allIds);
      expect(uniqueIds.size).toBe(allIds.length);

      // Exactly 1 undo entry
      expect(useDocumentStore.getState().past.length).toBe(1);

      // Undo restores toEqual original document
      useDocumentStore.getState().undo();
      expect(useDocumentStore.getState().document).toEqual(initialDoc);
    });
  });

  describe('reorderElement', () => {
    it('reorders forward, backward, front, and back with 1 undo entry each', () => {
      const store = useDocumentStore.getState();
      const initialDoc = JSON.parse(JSON.stringify(store.document));

      // Initially: [el-1, el-2]
      // Move el-1 forward -> [el-2, el-1]
      store.reorderElement('page-1', 'el-1', 'forward');
      expect(useDocumentStore.getState().past.length).toBe(1);
      expect(useDocumentStore.getState().document.pages[0].elements.map((e) => e.id)).toEqual(['el-2', 'el-1']);

      // Undo restores toEqual original
      useDocumentStore.getState().undo();
      expect(useDocumentStore.getState().document).toEqual(initialDoc);
      expect(useDocumentStore.getState().document.pages[0].elements.map((e) => e.id)).toEqual(['el-1', 'el-2']);

      // Move el-2 backward -> [el-2, el-1]
      store.reorderElement('page-1', 'el-2', 'backward');
      expect(useDocumentStore.getState().document.pages[0].elements.map((e) => e.id)).toEqual(['el-2', 'el-1']);

      // Undo
      useDocumentStore.getState().undo();
      expect(useDocumentStore.getState().document).toEqual(initialDoc);

      // Move el-1 to front -> [el-2, el-1]
      store.reorderElement('page-1', 'el-1', 'front');
      expect(useDocumentStore.getState().document.pages[0].elements.map((e) => e.id)).toEqual(['el-2', 'el-1']);

      // Undo
      useDocumentStore.getState().undo();
      expect(useDocumentStore.getState().document).toEqual(initialDoc);

      // Move el-2 to back -> [el-2, el-1]
      store.reorderElement('page-1', 'el-2', 'back');
      expect(useDocumentStore.getState().document.pages[0].elements.map((e) => e.id)).toEqual(['el-2', 'el-1']);

      // Undo
      useDocumentStore.getState().undo();
      expect(useDocumentStore.getState().document).toEqual(initialDoc);
    });

    it('does not mutate document or add undo entry when reorder is at boundary', () => {
      const store = useDocumentStore.getState();
      const initialDoc = JSON.parse(JSON.stringify(store.document));

      // el-1 is at index 0 (bottom). Moving backward or back should do nothing.
      store.reorderElement('page-1', 'el-1', 'backward');
      expect(useDocumentStore.getState().past.length).toBe(0);
      expect(useDocumentStore.getState().document).toEqual(initialDoc);

      store.reorderElement('page-1', 'el-1', 'back');
      expect(useDocumentStore.getState().past.length).toBe(0);
      expect(useDocumentStore.getState().document).toEqual(initialDoc);

      // el-2 is at index 1 (top). Moving forward or front should do nothing.
      store.reorderElement('page-1', 'el-2', 'forward');
      expect(useDocumentStore.getState().past.length).toBe(0);
      expect(useDocumentStore.getState().document).toEqual(initialDoc);

      store.reorderElement('page-1', 'el-2', 'front');
      expect(useDocumentStore.getState().past.length).toBe(0);
      expect(useDocumentStore.getState().document).toEqual(initialDoc);
    });
  });

  describe('deleteElement', () => {
    it('deletes element with exactly 1 undo entry, and undo restores identical document', () => {
      const store = useDocumentStore.getState();
      const initialDoc = JSON.parse(JSON.stringify(store.document));

      store.deleteElement('page-1', 'el-1');
      expect(useDocumentStore.getState().past.length).toBe(1);
      expect(useDocumentStore.getState().document.pages[0].elements.length).toBe(1);
      expect(useDocumentStore.getState().document.pages[0].elements[0].id).toBe('el-2');

      useDocumentStore.getState().undo();
      expect(useDocumentStore.getState().document).toEqual(initialDoc);
    });
  });
});
