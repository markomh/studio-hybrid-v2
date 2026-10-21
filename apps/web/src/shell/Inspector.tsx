import React from 'react';
import { i18n } from '../i18n';
import { Document } from '@studio-hybrid/core';
import { Icon } from '../ui/Icon';
import { SlidersHorizontal, X, Square, ChevronDown, Lightbulb } from 'lucide-react';

export interface InspectorProps {
  document: Document;
  activePageId: string;
  isOpen: boolean;
  onClose?: () => void;
}

export function Inspector({ document, activePageId, isOpen, onClose }: InspectorProps) {
  if (!isOpen) return null;

  const trim = document.meta.trim;
  const activePageIndex = document.pages.findIndex((p) => p.id === activePageId);
  const pageNumber = activePageIndex >= 0 ? activePageIndex + 1 : 1;
  const activePage = document.pages[activePageIndex] || document.pages[0];

  const isRecto = pageNumber % 2 === 1;
  const spreadLabel = isRecto ? i18n.inspector.rectoRight : 'Verso (Kiri)';
  const gutterSideLabel = isRecto ? i18n.inspector.leftEdge : 'Tepi Kanan';

  const roleLabel =
    activePage?.role === 'cover'
      ? 'COVER'
      : activePage?.role === 'front_matter'
      ? 'FRONT MATTER'
      : activePage?.role === 'body'
      ? 'BODY'
      : activePage?.role === 'solutions'
      ? 'SOLUTIONS'
      : 'APPENDIX';

  return (
    <aside
      data-testid="shell-inspector"
      role="region"
      aria-label="Inspector"
      tabIndex={0}
      className="w-[var(--inspector-width,280px)] bg-[var(--color-surface-raised)] border-l border-[var(--color-border)] flex flex-col text-[var(--color-text)] select-none z-[var(--z-panel,20)] shadow-[var(--shadow-md)] shrink-0"
    >
      {/* Inspector Header */}
      <div className="h-[var(--header-height,44px)] border-b border-[var(--color-border)] px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 bg-[var(--color-primary)] text-[var(--color-primary-contrast)] rounded-[var(--radius-md)] flex items-center justify-center shadow-[var(--shadow-sm)]">
            <Icon icon={SlidersHorizontal} size={15} />
          </div>
          <div>
            <h2 className="font-bold text-[var(--text-xs)] text-[var(--color-text)]">{i18n.inspector.pageProps}</h2>
            <span className="text-[10px] text-[var(--color-text-muted)]">Halaman {pageNumber}</span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            data-testid="btn-close-inspector"
            onClick={onClose}
            title={i18n.inspector.close}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] p-1 rounded-[var(--radius-sm)] transition duration-[var(--transition-fast)]"
          >
            <Icon icon={X} size={14} label={i18n.inspector.close} />
          </button>
        )}
      </div>

      {/* Inspector Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Section 1: Page Setup Card */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-3.5 shadow-[var(--shadow-sm)]">
          <div className="space-y-2.5 text-[var(--text-xs)]">
            <div className="flex justify-between items-center text-[var(--color-text)]">
              <span className="text-[var(--color-text-muted)]">{i18n.inspector.trimSize}</span>
              <span className="font-semibold text-[var(--color-text)]">
                {trim.widthMm} × {trim.heightMm} mm
              </span>
            </div>
            <div className="flex justify-between items-center text-[var(--color-text)]">
              <span className="text-[var(--color-text-muted)]">{i18n.inspector.bleed}</span>
              <span className="text-[var(--color-success)] font-semibold">
                {document.meta.bleedMm > 0 ? `Aktif (+${document.meta.bleedMm} mm)` : 'Tidak Aktif'}
              </span>
            </div>
            <div className="flex justify-between items-center text-[var(--color-text)]">
              <span className="text-[var(--color-text-muted)]">{i18n.inspector.gutter}</span>
              <span className="font-semibold text-[var(--color-text)]">
                {document.meta.margins.insideMm} mm
              </span>
            </div>
            <div className="flex justify-between items-center text-[var(--color-text)]">
              <span className="text-[var(--color-text-muted)]">{i18n.inspector.totalPages}</span>
              <span className="font-semibold text-[var(--color-text)]">
                {document.pages.length} Halaman
              </span>
            </div>
          </div>

          <button
            type="button"
            className="mt-3.5 w-full bg-[var(--color-surface-muted)] hover:bg-[var(--color-border-muted)] text-[var(--color-text)] border border-[var(--color-border)] rounded-[var(--radius-lg)] py-2 text-[var(--text-xs)] font-semibold transition duration-[var(--transition-fast)] shadow-[var(--shadow-sm)] flex items-center justify-center space-x-1.5"
          >
            <span>{i18n.inspector.changePageSetup}</span>
          </button>
        </div>

        {/* Section 2: Konteks Lembar Card */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-3.5 shadow-[var(--shadow-sm)]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[var(--text-xs)] font-bold text-[var(--color-text)]">{i18n.inspector.pageContext}</span>
            <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 text-[9px] font-bold px-2 py-0.5 rounded-[var(--radius-sm)]">
              {roleLabel}
            </span>
          </div>

          <div className="space-y-2.5 text-[var(--text-xs)]">
            <div className="flex justify-between items-center text-[var(--color-text)]">
              <span className="text-[var(--color-text-muted)]">{i18n.inspector.sheetNo}</span>
              <span className="font-semibold text-[var(--color-text)]">Halaman {pageNumber}</span>
            </div>
            <div className="flex justify-between items-center text-[var(--color-text)]">
              <span className="text-[var(--color-text-muted)]">{i18n.inspector.spreadPos}</span>
              <span className="font-semibold text-[var(--color-text)] flex items-center space-x-1">
                <span className="text-[var(--color-warning)] text-xs">●</span>
                <span>{spreadLabel}</span>
              </span>
            </div>
            <div className="flex justify-between items-center text-[var(--color-text)]">
              <span className="text-[var(--color-text-muted)]">{i18n.inspector.gutterSide}</span>
              <span className="font-semibold text-[var(--color-text)]">{gutterSideLabel}</span>
            </div>
          </div>

          <div className="mt-3.5 bg-[var(--color-surface-muted)] p-2.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] flex items-start space-x-2">
            <Icon icon={Lightbulb} size={14} className="text-[var(--color-warning)] shrink-0 mt-0.5" />
            <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed italic">
              {i18n.inspector.selectHint}
            </p>
          </div>
        </div>

        {/* Section 3: Bingkai Lembar Halaman Accordion */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-3.5 shadow-[var(--shadow-sm)]">
          <div className="flex justify-between items-center mb-2.5 cursor-pointer">
            <div className="flex items-center space-x-2">
              <Icon icon={Square} size={15} className="text-[var(--color-primary)]" />
              <span className="text-[var(--text-xs)] font-bold text-[var(--color-text)]">
                {i18n.inspector.pageFrameSection}
              </span>
            </div>
            <Icon icon={ChevronDown} size={13} className="text-[var(--color-text-muted)]" />
          </div>

          <div className="mt-2">
            <label className="text-[11px] text-[var(--color-text-muted)] block mb-1.5 font-medium">
              {i18n.inspector.borderStyle}
            </label>
            <div className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-3 py-2 text-[var(--text-xs)] text-[var(--color-text)] flex justify-between items-center cursor-pointer hover:bg-[var(--color-border-muted)] transition duration-[var(--transition-fast)]">
              <span>{i18n.inspector.plainBorder}</span>
              <Icon icon={ChevronDown} size={12} className="text-[var(--color-text-muted)]" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Inspector;
