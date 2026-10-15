import { create } from 'zustand';
import { produceWithPatches, applyPatches, produce, enablePatches, Patch } from 'immer';
import { Document, Element, createDocument } from '@studio-hybrid/core';

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
