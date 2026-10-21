import React from 'react';
import { i18n } from '../i18n';
import { Page, PageRole } from '@studio-hybrid/core';
import { Icon } from '../ui/Icon';
import {
  X,
  Plus,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from 'lucide-react';

export interface LeftPanelProps {
  isOpen: boolean;
  activeTab: 'elements' | 'frame' | 'pages';
  pages: Page[];
  activePageId: string;
  onClose: () => void;
  onAddText: () => void;
  onSelectPage: (pageId: string) => void;
  onAddPage: (role?: PageRole) => void;
  onDuplicatePage: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
  onMovePage: (pageId: string, targetIndex: number) => void;
}

export function LeftPanel({
  isOpen,
  activeTab,
  pages = [],
  activePageId,
  onClose,
  onAddText,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onMovePage,
}: LeftPanelProps) {
  if (!isOpen) return null;

  return (
    <div
      data-testid="shell-left-panel"
      role="region"
      aria-label="Left Panel"
      tabIndex={0}
      className="w-[var(--panel-width,260px)] bg-[var(--color-surface-raised)] border-r border-[var(--color-border)] flex flex-col text-[var(--color-text)] select-none z-[var(--z-panel,20)] shadow-[var(--shadow-md)] shrink-0"
    >
      {/* Panel Header */}
      <div className="h-[var(--header-height,44px)] border-b border-[var(--color-border)] px-4 flex items-center justify-between">
        <h2 className="font-semibold text-[var(--text-sm)] text-[var(--color-text)] tracking-tight">
          {activeTab === 'elements'
            ? i18n.panel.canvasElements
            : activeTab === 'frame'
            ? i18n.rail.frame
            : i18n.rail.pages}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] p-1 rounded-[var(--radius-sm)] transition duration-[var(--transition-fast)]"
        >
          <Icon icon={X} size={14} label="Tutup Panel" />
        </button>
      </div>

      {/* Panel Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {activeTab === 'elements' && (
          <>
            {/* Section 1: Puzzles */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[var(--text-xs)] font-bold tracking-wider text-[var(--color-text)]">
                  {i18n.panel.puzzles}
                </span>
                <span className="text-[10px] text-[var(--color-primary)] font-medium">
                  {i18n.panel.clickOrDragCanvas}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Labirin */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-sm)] rounded-[var(--radius-xl)] p-2.5 cursor-pointer transition duration-[var(--transition-fast)] flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-7 h-7 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex items-center justify-center text-sm font-bold">
                      🧩
                    </div>
                    <Icon icon={GripVertical} size={12} className="text-[var(--color-text-muted)]" />
                  </div>
                  <div>
                    <div className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">{i18n.panel.labirin}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">{i18n.panel.vectorMaze}</div>
                  </div>
                </div>

                {/* Sudoku */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-sm)] rounded-[var(--radius-xl)] p-2.5 cursor-pointer transition duration-[var(--transition-fast)] flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-7 h-7 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex items-center justify-center text-sm font-bold">
                      🔢
                    </div>
                    <Icon icon={GripVertical} size={12} className="text-[var(--color-text-muted)]" />
                  </div>
                  <div>
                    <div className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">{i18n.panel.sudoku}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">{i18n.panel.grid9x9}</div>
                  </div>
                </div>

                {/* Word Search */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-sm)] rounded-[var(--radius-xl)] p-2.5 cursor-pointer transition duration-[var(--transition-fast)] flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-7 h-7 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex items-center justify-center text-sm font-bold">
                      🔍
                    </div>
                    <Icon icon={GripVertical} size={12} className="text-[var(--color-text-muted)]" />
                  </div>
                  <div>
                    <div className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">{i18n.panel.wordSearch}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">{i18n.panel.searchWord}</div>
                  </div>
                </div>

                {/* Worksheet */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-sm)] rounded-[var(--radius-xl)] p-2.5 cursor-pointer transition duration-[var(--transition-fast)] flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-7 h-7 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex items-center justify-center text-sm font-bold">
                      📄
                    </div>
                    <Icon icon={GripVertical} size={12} className="text-[var(--color-text-muted)]" />
                  </div>
                  <div>
                    <div className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">{i18n.panel.worksheet}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">{i18n.panel.mathWorksheet}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Tipografi & Teks */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[var(--text-xs)] font-bold tracking-wider text-[var(--color-text)]">
                  {i18n.panel.typography}
                </span>
                <span className="text-[10px] text-[var(--color-primary)] font-medium">
                  {i18n.panel.clickOrDragText}
                </span>
              </div>
              <div className="space-y-2">
                <div
                  onClick={onAddText}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-sm)] rounded-[var(--radius-lg)] p-2.5 cursor-pointer transition duration-[var(--transition-fast)] flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex items-center justify-center text-sm">
                      🚀
                    </div>
                    <div>
                      <div className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">{i18n.panel.headingTitle}</div>
                      <div className="text-[10px] text-[var(--color-text-muted)]">{i18n.panel.headingSubtitle}</div>
                    </div>
                  </div>
                  <Icon icon={GripVertical} size={12} className="text-[var(--color-text-muted)]" />
                </div>

                <div
                  onClick={onAddText}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-sm)] rounded-[var(--radius-lg)] p-2.5 cursor-pointer transition duration-[var(--transition-fast)] flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex items-center justify-center text-sm">
                      💬
                    </div>
                    <div>
                      <div className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">{i18n.panel.instruction}</div>
                      <div className="text-[10px] text-[var(--color-text-muted)]">{i18n.panel.instructionSubtitle}</div>
                    </div>
                  </div>
                  <Icon icon={GripVertical} size={12} className="text-[var(--color-text-muted)]" />
                </div>
              </div>
            </div>

            {/* Section 3: Clipart & Maskot */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[var(--text-xs)] font-bold tracking-wider text-[var(--color-text)]">
                  {i18n.panel.clipart}
                </span>
                <span className="text-[10px] text-[var(--color-primary)] font-medium">
                  {i18n.panel.clickOrDragStickers}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1.5 mb-2">
                {['🚀', '🪐', '🐱', '😎', '✈️'].map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-10 h-10 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-lg)] flex items-center justify-center text-lg transition duration-[var(--transition-fast)] shadow-[var(--shadow-sm)] hover:scale-105"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'frame' && (
          <div className="text-[var(--text-sm)] text-[var(--color-text-muted)] text-center py-8">
            {i18n.panel.frameSettingsPlaceholder}
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="space-y-3">
            {/* Header with Add Page Button */}
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-xs)] font-semibold text-[var(--color-text-muted)]">
                Daftar Halaman ({pages.length})
              </span>
              <button
                type="button"
                onClick={() => onAddPage('body')}
                className="flex items-center space-x-1 px-2 py-1 bg-[var(--color-primary)] text-[var(--color-primary-contrast)] rounded-[var(--radius-md)] text-[var(--text-xs)] font-medium shadow-[var(--shadow-sm)] hover:bg-[var(--color-primary-hover)] transition duration-[var(--transition-fast)]"
              >
                <Icon icon={Plus} size={12} />
                <span>Tambah</span>
              </button>
            </div>

            {/* Real Pages List */}
            <div className="space-y-2">
              {pages.map((page, index) => {
                const isActive = page.id === activePageId;
                const pageNumber = index + 1;
                const roleLabel =
                  page.role === 'cover'
                    ? 'Cover'
                    : page.role === 'front_matter'
                    ? 'Front Matter'
                    : page.role === 'body'
                    ? 'Body'
                    : page.role === 'solutions'
                    ? 'Solutions'
                    : 'Appendix';

                return (
                  <div
                    key={page.id}
                    className={`rounded-[var(--radius-lg)] p-2.5 transition duration-[var(--transition-fast)] border ${
                      isActive
                        ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/40 shadow-[var(--shadow-sm)]'
                        : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-surface-muted)]'
                    }`}
                  >
                    <div
                      onClick={() => onSelectPage(page.id)}
                      className="cursor-pointer flex items-center justify-between mb-2"
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`text-[var(--text-xs)] font-bold ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
                          Halaman {pageNumber}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-[var(--color-text-muted)] uppercase">
                          {roleLabel}
                        </span>
                      </div>
                      {isActive && (
                        <span className="text-[10px] font-bold text-[var(--color-primary)]">
                          {i18n.panel.activeStatus}
                        </span>
                      )}
                    </div>

                    {/* Page Actions toolbar */}
                    <div className="flex items-center justify-end space-x-1 border-t border-[var(--color-border-muted)] pt-1.5 mt-1">
                      {/* Move Up */}
                      <button
                        type="button"
                        onClick={() => onMovePage(page.id, index - 1)}
                        disabled={index === 0}
                        title={i18n.panelActions.moveUp}
                        className="p-1 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] disabled:opacity-20 disabled:pointer-events-none"
                      >
                        <Icon icon={ChevronUp} size={12} label={i18n.panelActions.moveUp} />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        onClick={() => onMovePage(page.id, index + 1)}
                        disabled={index === pages.length - 1}
                        title={i18n.panelActions.moveDown}
                        className="p-1 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] disabled:opacity-20 disabled:pointer-events-none"
                      >
                        <Icon icon={ChevronDown} size={12} label={i18n.panelActions.moveDown} />
                      </button>

                      {/* Duplicate */}
                      <button
                        type="button"
                        onClick={() => onDuplicatePage(page.id)}
                        title={i18n.panelActions.duplicatePage}
                        className="p-1 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]"
                      >
                        <Icon icon={Copy} size={12} label={i18n.panelActions.duplicatePage} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDeletePage(page.id)}
                        disabled={pages.length <= 1}
                        title={i18n.panelActions.deletePage}
                        className="p-1 rounded-[var(--radius-sm)] text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 disabled:opacity-20 disabled:pointer-events-none"
                      >
                        <Icon icon={Trash2} size={12} label={i18n.panelActions.deletePage} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftPanel;
