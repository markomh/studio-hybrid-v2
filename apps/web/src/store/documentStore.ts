import { create } from 'zustand';
import { produceWithPatches, applyPatches, produce, enablePatches, Patch } from 'immer';
import { Document, Element, Page, PageRole, createDocument } from '@studio-hybrid/core';

enablePatches();

export interface HistoryEntry {
  patches: Patch[];
  inversePatches: Patch[];
  label: string;
}

export interface DocumentState {
  document: Document;
  past: HistoryEntry[];
  future: HistoryEntry[];

  // Internal transaction batching state
  _isBatching?: boolean;
  _batchPatches?: Patch[];
  _batchInversePatches?: Patch[];

  // Actions
  setDocument: (doc: Document) => void;
  addElement: (pageId: string, element: Element) => void;
  updateElement: (pageId: string, elementId: string, updates: Partial<Element>) => void;
  moveElement: (pageId: string, elementId: string, x: number, y: number) => void;
  deleteElement: (pageId: string, elementId: string) => void;
  toggleLock: (ids: string[] | string) => void;
  duplicateElement: (pageId: string, id: string) => string | null;
  reorderElement: (pageId: string, id: string, direction: 'front' | 'forward' | 'backward' | 'back') => void;

  // Page Operations (F3-R3)
  addPage: (role?: PageRole, afterPageId?: string) => string;
  duplicatePage: (pageId: string) => string;
  deletePage: (pageId: string) => void;
  movePage: (pageId: string, targetIndex: number) => void;

  transaction: (label: string, fn: () => void) => void;
  undo: () => void;
  redo: () => void;
}

const MAX_HISTORY = 100;

export const useDocumentStore = create<DocumentState>((set, get) => ({
  document: produce(createDocument('letter'), () => {}),
  past: [],
  future: [],

  setDocument: (doc) => {
    set({ document: produce(doc, () => {}), past: [], future: [] });
  },

  addElement: (pageId, element) => {
    const currentState = get();
    const [nextDoc, patches, inversePatches] = produceWithPatches(
      currentState.document,
      (draft: Document) => {
        const page = draft.pages.find((p) => p.id === pageId);
        if (page) {
          page.elements.push(element);
        }
      }
    ) as [Document, Patch[], Patch[]];

    if (currentState._isBatching) {
      set({
        document: nextDoc,
        _batchPatches: [...(currentState._batchPatches || []), ...patches],
        _batchInversePatches: [...inversePatches, ...(currentState._batchInversePatches || [])],
      });
    } else {
      set((state) => ({
        document: nextDoc,
        past: [...state.past, { patches, inversePatches, label: 'addElement' }].slice(-MAX_HISTORY),
        future: [],
      }));
    }
  },

  updateElement: (pageId, elementId, updates) => {
    const currentState = get();
    const [nextDoc, patches, inversePatches] = produceWithPatches(
      currentState.document,
      (draft: Document) => {
        const page = draft.pages.find((p) => p.id === pageId);
        if (page) {
          const el = page.elements.find((e) => e.id === elementId);
          if (el) {
            Object.assign(el, updates);
          }
        }
      }
    ) as [Document, Patch[], Patch[]];

    if (currentState._isBatching) {
      set({
        document: nextDoc,
        _batchPatches: [...(currentState._batchPatches || []), ...patches],
        _batchInversePatches: [...inversePatches, ...(currentState._batchInversePatches || [])],
      });
    } else {
      set((state) => ({
        document: nextDoc,
        past: [...state.past, { patches, inversePatches, label: 'updateElement' }].slice(-MAX_HISTORY),
        future: [],
      }));
    }
  },

  moveElement: (pageId, elementId, x, y) => {
    const currentState = get();
    const [nextDoc, patches, inversePatches] = produceWithPatches(
      currentState.document,
      (draft: Document) => {
        const page = draft.pages.find((p) => p.id === pageId);
        if (page) {
          const el = page.elements.find((e) => e.id === elementId);
          if (el) {
            el.x = x;
            el.y = y;
          }
        }
      }
    ) as [Document, Patch[], Patch[]];

    if (currentState._isBatching) {
      set({
        document: nextDoc,
        _batchPatches: [...(currentState._batchPatches || []), ...patches],
        _batchInversePatches: [...inversePatches, ...(currentState._batchInversePatches || [])],
      });
    } else {
      set((state) => ({
        document: nextDoc,
        past: [...state.past, { patches, inversePatches, label: 'moveElement' }].slice(-MAX_HISTORY),
        future: [],
      }));
    }
  },

  deleteElement: (pageId, elementId) => {
    const currentState = get();
    const [nextDoc, patches, inversePatches] = produceWithPatches(
      currentState.document,
      (draft: Document) => {
        const page = draft.pages.find((p) => p.id === pageId);
        if (page) {
          page.elements = page.elements.filter((e) => e.id !== elementId);
        }
      }
    ) as [Document, Patch[], Patch[]];

    if (currentState._isBatching) {
      set({
        document: nextDoc,
        _batchPatches: [...(currentState._batchPatches || []), ...patches],
        _batchInversePatches: [...inversePatches, ...(currentState._batchInversePatches || [])],
      });
    } else {
      set((state) => ({
        document: nextDoc,
        past: [...state.past, { patches, inversePatches, label: 'deleteElement' }].slice(-MAX_HISTORY),
        future: [],
      }));
    }
  },

  toggleLock: (ids) => {
    const currentState = get();
    const idArray = Array.isArray(ids) ? ids : [ids];
    if (idArray.length === 0) return;

    const [nextDoc, patches, inversePatches] = produceWithPatches(
      currentState.document,
      (draft: Document) => {
        for (const page of draft.pages) {
          for (const el of page.elements) {
            if (idArray.includes(el.id)) {
              el.locked = !el.locked;
            }
          }
        }
      }
    ) as [Document, Patch[], Patch[]];

    if (patches.length === 0) return;

    if (currentState._isBatching) {
      set({
        document: nextDoc,
        _batchPatches: [...(currentState._batchPatches || []), ...patches],
        _batchInversePatches: [...inversePatches, ...(currentState._batchInversePatches || [])],
      });
    } else {
      set((state) => ({
        document: nextDoc,
        past: [...state.past, { patches, inversePatches, label: 'toggleLock' }].slice(-MAX_HISTORY),
        future: [],
      }));
    }
  },

  duplicateElement: (pageId, id) => {
    const currentState = get();
    const targetPage = currentState.document.pages.find((p) => p.id === pageId);
    if (!targetPage) return null;

    const targetEl = targetPage.elements.find((e) => e.id === id);
    if (!targetEl) return null;

    const newElementId = crypto.randomUUID();

    const cloneElement = (el: Element): Element => {
      const cloned = JSON.parse(JSON.stringify(el)) as Element;
      cloned.id = newElementId;
      cloned.x = el.x + 5;
      cloned.y = el.y + 5;
      if ('children' in cloned && Array.isArray((cloned as unknown as { children: Element[] }).children)) {
        (cloned as unknown as { children: Element[] }).children = (
          cloned as unknown as { children: Element[] }
        ).children.map((child) => ({
          ...child,
          id: crypto.randomUUID(),
        }));
      }
      return cloned;
    };

    const duplicated = cloneElement(targetEl);

    const [nextDoc, patches, inversePatches] = produceWithPatches(
      currentState.document,
      (draft: Document) => {
        const page = draft.pages.find((p) => p.id === pageId);
        if (page) {
          const idx = page.elements.findIndex((e) => e.id === id);
          if (idx !== -1) {
            page.elements.splice(idx + 1, 0, duplicated);
          } else {
            page.elements.push(duplicated);
          }
        }
      }
    ) as [Document, Patch[], Patch[]];

    if (currentState._isBatching) {
      set({
        document: nextDoc,
        _batchPatches: [...(currentState._batchPatches || []), ...patches],
        _batchInversePatches: [...inversePatches, ...(currentState._batchInversePatches || [])],
      });
    } else {
      set((state) => ({
        document: nextDoc,
        past: [...state.past, { patches, inversePatches, label: 'duplicateElement' }].slice(-MAX_HISTORY),
        future: [],
      }));
    }

    return newElementId;
  },

  reorderElement: (pageId, id, direction) => {
    const currentState = get();
    const page = currentState.document.pages.find((p) => p.id === pageId);
    if (!page) return;

    const idx = page.elements.findIndex((e) => e.id === id);
    if (idx === -1) return;

    if (direction === 'back' || direction === 'backward') {
      if (idx === 0) return;
    }
    if (direction === 'front' || direction === 'forward') {
      if (idx === page.elements.length - 1) return;
    }

    const [nextDoc, patches, inversePatches] = produceWithPatches(
      currentState.document,
      (draft: Document) => {
        const draftPage = draft.pages.find((p) => p.id === pageId);
        if (!draftPage) return;

        const currentIdx = draftPage.elements.findIndex((e) => e.id === id);
        if (currentIdx === -1) return;

        if (direction === 'front') {
          const [el] = draftPage.elements.splice(currentIdx, 1);
          draftPage.elements.push(el);
        } else if (direction === 'back') {
          const [el] = draftPage.elements.splice(currentIdx, 1);
          draftPage.elements.unshift(el);
        } else if (direction === 'forward') {
          if (currentIdx < draftPage.elements.length - 1) {
            const [el] = draftPage.elements.splice(currentIdx, 1);
            draftPage.elements.splice(currentIdx + 1, 0, el);
          }
        } else if (direction === 'backward') {
          if (currentIdx > 0) {
            const [el] = draftPage.elements.splice(currentIdx, 1);
            draftPage.elements.splice(currentIdx - 1, 0, el);
          }
        }
      }
    ) as [Document, Patch[], Patch[]];

    if (patches.length === 0) return;

    if (currentState._isBatching) {
      set({
        document: nextDoc,
        _batchPatches: [...(currentState._batchPatches || []), ...patches],
        _batchInversePatches: [...inversePatches, ...(currentState._batchInversePatches || [])],
      });
    } else {
      set((state) => ({
        document: nextDoc,
        past: [...state.past, { patches, inversePatches, label: 'reorderElement' }].slice(-MAX_HISTORY),
        future: [],
      }));
    }
  },

  addPage: (role = 'body', afterPageId) => {
    const currentState = get();
    const newPageId = crypto.randomUUID();
    const newPage: Page = {
      id: newPageId,
      role,
      elements: [],
    };

    const [nextDoc, patches, inversePatches] = produceWithPatches(
      currentState.document,
      (draft: Document) => {
        if (afterPageId) {
          const idx = draft.pages.findIndex((p) => p.id === afterPageId);
          if (idx !== -1) {
            draft.pages.splice(idx + 1, 0, newPage);
            return;
          }
        }
        draft.pages.push(newPage);
      }
    ) as [Document, Patch[], Patch[]];

    if (currentState._isBatching) {
      set({
        document: nextDoc,
        _batchPatches: [...(currentState._batchPatches || []), ...patches],
        _batchInversePatches: [...inversePatches, ...(currentState._batchInversePatches || [])],
      });
    } else {
      set((state) => ({
        document: nextDoc,
        past: [...state.past, { patches, inversePatches, label: 'addPage' }].slice(-MAX_HISTORY),
        future: [],
      }));
    }

    return newPageId;
  },

  duplicatePage: (pageId) => {
    const currentState = get();
    const targetPage = currentState.document.pages.find((p) => p.id === pageId);
    if (!targetPage) return '';

    const newPageId = crypto.randomUUID();
    const duplicatedElements: Element[] = targetPage.elements.map((el) => ({
      ...el,
      id: crypto.randomUUID(),
    }));

    const duplicatedPage: Page = {
      ...targetPage,
      id: newPageId,
      elements: duplicatedElements,
    };

    const [nextDoc, patches, inversePatches] = produceWithPatches(
      currentState.document,
      (draft: Document) => {
        const idx = draft.pages.findIndex((p) => p.id === pageId);
        if (idx !== -1) {
          draft.pages.splice(idx + 1, 0, duplicatedPage);
        } else {
          draft.pages.push(duplicatedPage);
        }
      }
    ) as [Document, Patch[], Patch[]];

    if (currentState._isBatching) {
      set({
        document: nextDoc,
        _batchPatches: [...(currentState._batchPatches || []), ...patches],
        _batchInversePatches: [...inversePatches, ...(currentState._batchInversePatches || [])],
      });
    } else {
      set((state) => ({
        document: nextDoc,
        past: [...state.past, { patches, inversePatches, label: 'duplicatePage' }].slice(-MAX_HISTORY),
        future: [],
      }));
    }

    return newPageId;
  },

  deletePage: (pageId) => {
    const currentState = get();
    if (currentState.document.pages.length <= 1) {
      // Must maintain at least 1 page
      return;
    }

    const [nextDoc, patches, inversePatches] = produceWithPatches(
      currentState.document,
      (draft: Document) => {
        draft.pages = draft.pages.filter((p) => p.id !== pageId);
      }
    ) as [Document, Patch[], Patch[]];

    if (currentState._isBatching) {
      set({
        document: nextDoc,
        _batchPatches: [...(currentState._batchPatches || []), ...patches],
        _batchInversePatches: [...inversePatches, ...(currentState._batchInversePatches || [])],
      });
    } else {
      set((state) => ({
        document: nextDoc,
        past: [...state.past, { patches, inversePatches, label: 'deletePage' }].slice(-MAX_HISTORY),
        future: [],
      }));
    }
  },

  movePage: (pageId, targetIndex) => {
    const currentState = get();
    const [nextDoc, patches, inversePatches] = produceWithPatches(
      currentState.document,
      (draft: Document) => {
        const fromIdx = draft.pages.findIndex((p) => p.id === pageId);
        if (fromIdx !== -1 && targetIndex >= 0 && targetIndex < draft.pages.length) {
          const [movedPage] = draft.pages.splice(fromIdx, 1);
          draft.pages.splice(targetIndex, 0, movedPage);
        }
      }
    ) as [Document, Patch[], Patch[]];

    if (currentState._isBatching) {
      set({
        document: nextDoc,
        _batchPatches: [...(currentState._batchPatches || []), ...patches],
        _batchInversePatches: [...inversePatches, ...(currentState._batchInversePatches || [])],
      });
    } else {
      set((state) => ({
        document: nextDoc,
        past: [...state.past, { patches, inversePatches, label: 'movePage' }].slice(-MAX_HISTORY),
        future: [],
      }));
    }
  },

  transaction: (label, fn) => {
    const state = get();
    if (state._isBatching) {
      fn();
      return;
    }

    set({ _isBatching: true, _batchPatches: [], _batchInversePatches: [] });
    try {
      fn();
    } finally {
      const updatedState = get();
      const patches = updatedState._batchPatches || [];
      const inversePatches = updatedState._batchInversePatches || [];

      set({
        _isBatching: false,
        _batchPatches: undefined,
        _batchInversePatches: undefined,
      });

      if (patches.length > 0) {
        set((s) => ({
          past: [...s.past, { patches, inversePatches, label }].slice(-MAX_HISTORY),
          future: [],
        }));
      }
    }
  },

  undo: () => {
    const state = get();
    if (state.past.length === 0) return;

    const lastEntry = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    const prevDoc = applyPatches(state.document, lastEntry.inversePatches);

    set({
      document: prevDoc,
      past: newPast,
      future: [lastEntry, ...state.future],
    });
  },

  redo: () => {
    const state = get();
    if (state.future.length === 0) return;

    const nextEntry = state.future[0];
    const newFuture = state.future.slice(1);
    const nextDoc = applyPatches(state.document, nextEntry.patches);

    set({
      document: nextDoc,
      past: [...state.past, nextEntry],
      future: newFuture,
    });
  },
}));

export default useDocumentStore;
