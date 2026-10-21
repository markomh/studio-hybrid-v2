import React from 'react';
import { i18n } from '../i18n';
import { Icon } from '../ui/Icon';
import { ChevronLeft, ChevronRight, Grid, Minus, Plus, Eye } from 'lucide-react';
import { PageRole } from '@studio-hybrid/core';

export interface FooterProps {
  currentPageIndex: number;
  totalPages: number;
  zoom: number;
  pageRole?: PageRole;
  showGuides: boolean;
  isMonochrome: boolean;
  onPageChange: (index: number) => void;
  onZoomChange: (zoom: number) => void;
  onToggleGuides: () => void;
  onToggleMonochrome: () => void;
  onFitView: () => void;
}

const ROLE_LABELS: Record<PageRole, string> = {
  cover: 'Cover',
  front_matter: 'Front Matter',
  body: 'Body',
  solutions: 'Solutions',
  appendix: 'Appendix',
};

export function Footer({
  currentPageIndex,
  totalPages,
  zoom,
  pageRole = 'body',
  showGuides,
  isMonochrome,
  onPageChange,
  onZoomChange,
  onToggleGuides,
  onToggleMonochrome,
  onFitView,
}: FooterProps) {
  const pageNumber = currentPageIndex + 1;
  const isRecto = pageNumber % 2 === 1;
  const spreadLabel = isRecto ? i18n.footer.recto : 'Verso (Kiri)';
  const roleLabel = ROLE_LABELS[pageRole] || 'Body';

  return (
    <footer
      data-testid="shell-footer"
      role="region"
      aria-label="Footer"
      tabIndex={0}
      className="h-[var(--footer-height,36px)] bg-[var(--color-surface)] border-t border-[var(--color-border)] px-4 flex items-center justify-between text-[var(--color-text)] text-[var(--text-xs)] select-none z-[var(--z-footer,30)] shrink-0 shadow-[var(--shadow-sm)]"
    >
      {/* Left: Real Page Navigator, single-line page indicator, and role/side chip */}
      <div className="flex items-center space-x-3 shrink-0">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(0, currentPageIndex - 1))}
          disabled={currentPageIndex <= 0}
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] border border-[var(--color-border)] hover:bg-[var(--color-border-muted)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30 disabled:pointer-events-none transition duration-[var(--transition-fast)]"
          title={i18n.footer.prevPage}
        >
          <Icon icon={ChevronLeft} size={14} label={i18n.footer.prevPage} />
        </button>

        <div className="flex items-center space-x-2 whitespace-nowrap">
          <div className="flex items-center space-x-1 font-semibold text-[var(--color-text)]">
            <span className="text-[var(--color-text-muted)] font-normal">{i18n.footer.pageLabel}</span>
            <span>{pageNumber}</span>
            <span className="text-[var(--color-text-muted)] font-normal">{i18n.footer.of}</span>
            <span>{totalPages || 1}</span>
          </div>
          <span className="text-[var(--color-border)]" aria-hidden="true">·</span>
          <span className="text-[11px] text-[var(--color-text-muted)] font-medium">
            {roleLabel} / {spreadLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPageIndex + 1))}
          disabled={currentPageIndex >= totalPages - 1}
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] border border-[var(--color-border)] hover:bg-[var(--color-border-muted)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30 disabled:pointer-events-none transition duration-[var(--transition-fast)]"
          title={i18n.footer.nextPage}
        >
          <Icon icon={ChevronRight} size={14} label={i18n.footer.nextPage} />
        </button>
      </div>

      {/* Center & Right: Toggles (Guides, Monochrome), Zoom (25%-400%), Fit View, Preflight Status */}
      <div className="flex items-center space-x-4 shrink-0">
        {/* Toggle Garis Bantu */}
        <button
          type="button"
          onClick={onToggleGuides}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-[var(--radius-lg)] font-medium text-[var(--text-xs)] transition duration-[var(--transition-fast)] ${
            showGuides
              ? 'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)] shadow-[var(--shadow-sm)]'
              : 'bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
          title={i18n.footer.toggleGuides}
        >
          <Icon icon={Grid} size={13} />
          <span>{i18n.footer.guides}</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-[var(--radius-sm)] uppercase ${showGuides ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)]' : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)]'}`}>
            {showGuides ? i18n.footer.on : i18n.footer.off}
          </span>
        </button>

        {/* Toggle Monokrom */}
        <button
          type="button"
          onClick={onToggleMonochrome}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-[var(--radius-lg)] font-medium text-[var(--text-xs)] transition duration-[var(--transition-fast)] ${
            isMonochrome
              ? 'bg-[var(--color-text)] text-[var(--color-surface)] shadow-[var(--shadow-sm)]'
              : 'bg-[var(--color-surface-muted)] border border-[var(--color-border)] hover:bg-[var(--color-border-muted)] text-[var(--color-text)]'
          }`}
          title={i18n.footer.toggleMonochrome}
        >
          <Icon icon={Eye} size={13} />
          <span>{i18n.footer.monochrome}</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-[var(--radius-sm)] uppercase ${isMonochrome ? 'bg-[var(--color-surface)] text-[var(--color-text)]' : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)]'}`}>
            {isMonochrome ? i18n.footer.on : i18n.footer.off}
          </span>
        </button>

        {/* Zoom Slider and Percentage (25% - 400%) */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onZoomChange(Math.max(0.25, Number((zoom - 0.1).toFixed(2))))}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            title={i18n.footer.zoomOut}
          >
            <Icon icon={Minus} size={12} label={i18n.footer.zoomOut} />
          </button>
          <input
            type="range"
            min={0.25}
            max={4.0}
            step={0.05}
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="w-24 accent-[var(--color-primary)] cursor-pointer"
          />
          <button
            type="button"
            onClick={() => onZoomChange(Math.min(4.0, Number((zoom + 0.1).toFixed(2))))}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            title={i18n.footer.zoomIn}
          >
            <Icon icon={Plus} size={12} label={i18n.footer.zoomIn} />
          </button>
          <span className="w-12 text-right font-semibold text-[var(--color-text)] text-[var(--text-xs)] tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Fit View Button */}
        <button
          type="button"
          onClick={onFitView}
          className="bg-[var(--color-surface-muted)] hover:bg-[var(--color-border-muted)] border border-[var(--color-border)] px-2.5 py-1 rounded-[var(--radius-lg)] font-medium text-[var(--color-text)] transition duration-[var(--transition-fast)] text-[var(--text-xs)] shadow-[var(--shadow-sm)]"
        >
          {i18n.footer.fit}
        </button>

        <span className="text-[var(--color-border)]" aria-hidden="true">·</span>

        {/* Preflight Status: "Belum diperiksa" */}
        <span className="text-[11px] text-[var(--color-text-muted)] font-medium whitespace-nowrap">
          Belum diperiksa
        </span>
      </div>
    </footer>
  );
}

export default Footer;
