import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDocumentStore } from './store/documentStore';
import { AutosaveManager, SaveStatus } from './persistence';
import { Header, LeftRail, LeftPanel, Inspector, Footer, FloatingToolbar } from './shell';
import { PageSvg } from './canvas/PageSvg';
import { TextElement, PageRole, renderPdf } from '@studio-hybrid/core';
import { i18n } from './i18n';
import { Icon } from './ui/Icon';
import { SlidersHorizontal } from 'lucide-react';

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

  // Page operations from store (F3-R3)
  const addPage = useDocumentStore((state) => state.addPage);
  const duplicatePage = useDocumentStore((state) => state.duplicatePage);
  const deletePage = useDocumentStore((state) => state.deletePage);
  const movePage = useDocumentStore((state) => state.movePage);

  const [zoom, setZoom] = useState<number>(1);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [isMonochrome, setIsMonochrome] = useState<boolean>(false);

  const handleToggleGuides = () => setShowGuides((prev) => !prev);
  const handleToggleMonochrome = () => setIsMonochrome((prev) => !prev);
  const handleFitView = () => setZoom(1);

  // Shell State
  const [isFocusMode, setIsFocusMode] = useState<boolean>(initialFocusMode);
  const [activeRailTab, setActiveRailTab] = useState<'elements' | 'frame' | 'pages'>('elements');
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  // Active Page State
  const [activePageId, setActivePageId] = useState<string>(document.pages[0]?.id || '');
  const activePage = document.pages.find((p) => p.id === activePageId);
  const pageRole = activePage ? activePage.role : 'body';

  // Synchronize activePageId if pages change or if active page was deleted
  useEffect(() => {
    if (!document.pages.some((p) => p.id === activePageId)) {
      if (document.pages[0]) {
        setActivePageId(document.pages[0].id);
      }
    }
  }, [document.pages, activePageId]);

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

  // Keyboard shortcut: Tab toggles Focus Mode (per F3-A2)
  // When at body/canvas level, Tab toggles Focus Mode without interfering with sequential keyboard navigation.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return;
        }
        if (
          !target ||
          target === window.document.body ||
          target === window.document.documentElement ||
          target.getAttribute('data-testid') === 'shell-canvas-workspace' ||
          target.getAttribute('data-testid') === 'btn-focus-mode'
        ) {
          e.preventDefault();
          setIsFocusMode((prev) => !prev);
        }
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

  // Add Page: creates new page after active page and switches focus to it
  const handleAddPage = useCallback(
    (role: PageRole = 'body') => {
      const newId = addPage(role, activePageId);
      setActivePageId(newId);
    },
    [addPage, activePageId]
  );

  // Duplicate Page: clones active/selected page and focuses new copy
  const handleDuplicatePage = useCallback(
    (pageId: string) => {
      const newId = duplicatePage(pageId);
      if (newId) {
        setActivePageId(newId);
      }
    },
    [duplicatePage]
  );

  // Delete Page: moves focus to nearest remaining page (confirmed decision)
  const handleDeletePage = useCallback(
    (pageId: string) => {
      if (document.pages.length <= 1) return;
      const currentIndex = document.pages.findIndex((p) => p.id === pageId);
      if (pageId === activePageId) {
        const nextIndex = currentIndex > 0 ? currentIndex - 1 : 1;
        const targetPage = document.pages[nextIndex];
        if (targetPage) {
          setActivePageId(targetPage.id);
        }
      }
      deletePage(pageId);
    },
    [document.pages, activePageId, deletePage]
  );

  // Page index for Footer
  const activePageIndex = Math.max(0, document.pages.findIndex((p) => p.id === activePageId));
  const handlePageChange = useCallback(
    (index: number) => {
      const target = document.pages[index];
      if (target) {
        setActivePageId(target.id);
      }
    },
    [document.pages]
  );

  // Export PDF: directly triggers generation and download (confirmed decision)
  const handleExportPdf = useCallback(async () => {
    try {
      const pdfBytes = await renderPdf(document);
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${document.meta.name || 'buku_aktivitas'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    }
  }, [document]);

  // Add Text Element with UUID (F3-R3)
  const handleAddText = useCallback(() => {
    if (!activePageId) return;

    const newId = crypto.randomUUID();
    const activePage = document.pages.find((p) => p.id === activePageId) || document.pages[0];
    const newElement: TextElement = {
      id: newId,
      type: 'text',
      x: 30,
      y: 40 + (activePage?.elements.length || 0) * 15,
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
    <>
      <div className="min-width-warning">
        {i18n.minWidthWarning}
      </div>
      <div className="app-shell flex flex-col h-screen bg-[var(--color-surface)] text-[var(--color-text)] overflow-hidden font-sans select-none">
        {/* Zone 1: Header */}
        <Header
          title={document.meta.name}
          saveStatus={saveStatus}
          canUndo={past.length > 0}
          canRedo={future.length > 0}
          zoom={zoom}
          isFocusMode={isFocusMode}
          isInspectorOpen={isInspectorOpen}
          onAddText={handleAddText}
          onUndo={undo}
          onRedo={redo}
          onZoomChange={setZoom}
          onToggleFocusMode={handleToggleFocusMode}
          onToggleInspector={() => setIsInspectorOpen((prev) => !prev)}
          onExportPdf={handleExportPdf}
        />

        {/* Middle Row: Rail, Panel, Canvas Workspace, Inspector */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Zone 2: Left Rail (hidden in focus mode) */}
          {!isFocusMode && (
            <LeftRail
              activeTab={activeRailTab}
              onSelectTab={handleSelectRailTab}
              isOpen={isPanelOpen}
              onAddPage={() => handleAddPage('body')}
            />
          )}

          {/* Zone 3: Left Panel (hidden in focus mode or when closed) */}
          {!isFocusMode && isPanelOpen && (
            <LeftPanel
              isOpen={isPanelOpen}
              activeTab={activeRailTab}
              pages={document.pages}
              activePageId={activePageId}
              onClose={() => setIsPanelOpen(false)}
              onAddText={handleAddText}
              onSelectPage={setActivePageId}
              onAddPage={handleAddPage}
              onDuplicatePage={handleDuplicatePage}
              onDeletePage={handleDeletePage}
              onMovePage={movePage}
            />
          )}

          {/* Zone 4: Canvas / Workspace Area (always visible) */}
          <main
            data-testid="shell-canvas-workspace"
            role="region"
            aria-label="Canvas Workspace"
            tabIndex={0}
            className="flex-1 overflow-auto p-8 flex justify-center items-start bg-[var(--color-canvas-bg)] bg-[radial-gradient(var(--color-canvas-dot)_1px,transparent_1px)] [background-size:16px_16px] relative"
          >
            {/* FloatingToolbar remains visible in Focus Mode per F3-A2 */}
            <FloatingToolbar selectedElementId={selectedElementId} />

            {activePageId && (
              <PageSvg
                document={document}
                pageId={activePageId}
                zoom={zoom}
                showGuides={showGuides}
                isMonochrome={isMonochrome}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onMoveElement={(id, x, y) => moveElement(activePageId, id, x, y)}
              />
            )}
          </main>

          {/* Open Inspector toggle button when Inspector is collapsed and not in focus mode */}
          {!isFocusMode && !isInspectorOpen && (
            <button
              type="button"
              data-testid="btn-open-inspector"
              onClick={() => setIsInspectorOpen(true)}
              title="Buka Inspector"
              className="absolute right-0 top-16 z-[var(--z-panel,20)] bg-[var(--color-surface-raised)] border-l border-y border-[var(--color-border)] rounded-l-[var(--radius-md)] p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] shadow-[var(--shadow-md)] transition duration-[var(--transition-fast)]"
            >
              <Icon icon={SlidersHorizontal} size={16} label="Buka Inspector" />
            </button>
          )}

          {/* Zone 5: Right Inspector (hidden in focus mode or when closed) */}
          {!isFocusMode && isInspectorOpen && (
            <Inspector
              document={document}
              activePageId={activePageId}
              isOpen={isInspectorOpen}
              onClose={() => setIsInspectorOpen(false)}
            />
          )}
        </div>

        {/* Zone 6: Footer */}
        <Footer
          currentPageIndex={activePageIndex}
          totalPages={document.pages.length}
          zoom={zoom}
          pageRole={pageRole}
          showGuides={showGuides}
          isMonochrome={isMonochrome}
          onPageChange={handlePageChange}
          onZoomChange={setZoom}
          onToggleGuides={handleToggleGuides}
          onToggleMonochrome={handleToggleMonochrome}
          onFitView={handleFitView}
        />
      </div>
    </>
  );
}

export default App;
