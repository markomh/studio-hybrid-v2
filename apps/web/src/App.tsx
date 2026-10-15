import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDocumentStore } from './store/documentStore';
import { AutosaveManager, SaveStatus } from './persistence';
import { Header, LeftRail, LeftPanel, Inspector, Footer } from './shell';
import { PageSvg } from './canvas/PageSvg';
import { TextElement } from '@studio-hybrid/core';

export interface AppProps {
  initialFocusMode?: boolean;
}

export function App({ initialFocusMode = false }: AppProps = {}) {
  const document = useDocumentStore((state) => state.document);
  const past = useDocumentStore((state) => state.past);
  const future = useDocumentStore((state) => state.future);
  const addElement = useDocumentStore((state) => state.addElement);
  const moveElement = useDocumentStore((state) => state.moveElement);
  const undo = useDocumentStore((state) => state.undo);
  const redo = useDocumentStore((state) => state.redo);

  const [zoom, setZoom] = useState<number>(1);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Shell State
  const [isFocusMode, setIsFocusMode] = useState<boolean>(initialFocusMode);
  const [activeRailTab, setActiveRailTab] = useState<'elements' | 'frame' | 'pages'>('elements');
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  const activePageId = document.pages[0]?.id || '';

  // Autosave manager instance
  const autosave = useMemo(() => {
    return new AutosaveManager({
      debounceMs: 800,
      onStatusChange: (status) => setSaveStatus(status),
    });
  }, []);

  // Trigger autosave on document changes
  useEffect(() => {
    autosave.trigger(document);
  }, [document, autosave]);

  // Keyboard shortcut: Tab toggles Focus Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return;
        }
        e.preventDefault();
        setIsFocusMode((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectRailTab = useCallback((tab: 'elements' | 'frame' | 'pages') => {
    setActiveRailTab((current) => {
      if (current === tab) {
        setIsPanelOpen((prev) => !prev);
        return current;
      }
      setIsPanelOpen(true);
      return tab;
    });
  }, []);

  const handleToggleFocusMode = useCallback(() => {
    setIsFocusMode((prev) => !prev);
  }, []);

  const handleAddText = useCallback(() => {
    if (!activePageId) return;

    const newId = `text-${Date.now()}`;
    const newElement: TextElement = {
      id: newId,
      type: 'text',
      x: 30,
      y: 40 + (document.pages[0]?.elements.length || 0) * 15,
      w: 80,
      h: 20,
      rotation: 0,
      opacity: 1,
      locked: false,
      hidden: false,
      text: 'Ketik teks di sini...',
      fontFamily: 'sans',
      fontSizePt: 14,
      lineHeight: 1.2,
      letterSpacingPt: 0,
      bold: false,
      italic: false,
      underline: false,
      caps: false,
      align: 'left',
      color: '#0f172a',
    };

    addElement(activePageId, newElement);
    setSelectedElementId(newId);
  }, [activePageId, document.pages, addElement]);

  return (
    <div className="flex flex-col h-screen bg-[#0d131f] text-slate-100 overflow-hidden font-sans select-none">
      {/* Zone 1: Header */}
      <Header
        title={document.meta.name}
        saveStatus={saveStatus}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        zoom={zoom}
        isFocusMode={isFocusMode}
        onAddText={handleAddText}
        onUndo={undo}
        onRedo={redo}
        onZoomChange={setZoom}
        onToggleFocusMode={handleToggleFocusMode}
      />

      {/* Middle Row: Rail, Panel, Canvas Workspace, Inspector */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Zone 2: Left Rail (hidden in focus mode) */}
        {!isFocusMode && (
          <LeftRail
            activeTab={activeRailTab}
            onSelectTab={handleSelectRailTab}
            isOpen={isPanelOpen}
          />
        )}

        {/* Zone 3: Left Panel (hidden in focus mode or when closed) */}
        {!isFocusMode && isPanelOpen && (
          <LeftPanel
            isOpen={isPanelOpen}
            activeTab={activeRailTab}
            onClose={() => setIsPanelOpen(false)}
            onAddText={handleAddText}
          />
        )}

        {/* Zone 4: Canvas / Workspace Area (always visible) */}
        <main
          data-testid="shell-canvas-workspace"
          className="flex-1 overflow-auto p-8 flex justify-center items-start bg-[#0a0f1d] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"
        >
          {activePageId && (
            <PageSvg
              document={document}
              pageId={activePageId}
              zoom={zoom}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onMoveElement={(id, x, y) => moveElement(activePageId, id, x, y)}
            />
          )}
        </main>

        {/* Zone 5: Right Inspector (hidden in focus mode or when closed) */}
        {!isFocusMode && isInspectorOpen && (
          <Inspector
            document={document}
            isOpen={isInspectorOpen}
            onClose={() => setIsInspectorOpen(false)}
          />
        )}
      </div>

      {/* Zone 6: Footer */}
      <Footer
        zoom={zoom}
        onZoomChange={setZoom}
      />
    </div>
  );
}

export default App;
