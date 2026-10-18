import React from 'react';
import { i18n } from '../i18n';
import { Icon } from '../ui/Icon';
import { Puzzle, Frame, FileText, Plus } from 'lucide-react';

export interface LeftRailProps {
  activeTab: 'elements' | 'frame' | 'pages';
  onSelectTab: (tab: 'elements' | 'frame' | 'pages') => void;
  isOpen: boolean;
  onAddPage?: () => void;
}

export function LeftRail({ activeTab, onSelectTab, isOpen, onAddPage }: LeftRailProps) {
  return (
    <aside
      data-testid="shell-left-rail"
      role="region"
      aria-label="Left Rail"
      tabIndex={0}
      className="w-[var(--rail-width,52px)] bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col items-center py-3 text-[var(--color-text-muted)] select-none z-[var(--z-rail,10)] shrink-0 shadow-[var(--shadow-sm)]"
    >
      {/* Top tabs */}
      <div className="flex flex-col items-center space-y-4 w-full px-1.5">
        {/* Tab 1: Elemen */}
        <button
          type="button"
          onClick={() => onSelectTab('elements')}
          className={`w-full flex flex-col items-center py-2 px-1 rounded-[var(--radius-lg)] transition duration-[var(--transition-fast)] relative ${
            isOpen && activeTab === 'elements'
              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30 font-semibold shadow-[var(--shadow-sm)]'
              : 'hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] text-[var(--color-text-muted)]'
          }`}
          title={i18n.rail.elements}
        >
          <Icon icon={Puzzle} size={18} className="mb-1" />
          <span className="text-[10px] tracking-tight">{i18n.rail.elements}</span>
        </button>

        {/* Tab 2: Bingkai */}
        <button
          type="button"
          onClick={() => onSelectTab('frame')}
          className={`w-full flex flex-col items-center py-2 px-1 rounded-[var(--radius-lg)] transition duration-[var(--transition-fast)] relative ${
            isOpen && activeTab === 'frame'
              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30 font-semibold shadow-[var(--shadow-sm)]'
              : 'hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] text-[var(--color-text-muted)]'
          }`}
          title={i18n.rail.frame}
        >
          <Icon icon={Frame} size={18} className="mb-1" />
          <span className="text-[10px] tracking-tight">{i18n.rail.frame}</span>
        </button>

        {/* Tab 3: Halaman */}
        <button
          type="button"
          onClick={() => onSelectTab('pages')}
          className={`w-full flex flex-col items-center py-2 px-1 rounded-[var(--radius-lg)] transition duration-[var(--transition-fast)] relative ${
            isOpen && activeTab === 'pages'
              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30 font-semibold shadow-[var(--shadow-sm)]'
              : 'hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] text-[var(--color-text-muted)]'
          }`}
          title={i18n.rail.pages}
        >
          <Icon icon={FileText} size={18} className="mb-1" />
          <span className="text-[10px] tracking-tight">{i18n.rail.pages}</span>
        </button>
      </div>

      {/* Spacer to push '+' button to bottom */}
      <div className="flex-1" />

      {/* Bottom '+' Button to Add Page */}
      <div className="pb-1">
        <button
          type="button"
          onClick={onAddPage}
          title={i18n.rail.add}
          className="w-9 h-9 rounded-[var(--radius-lg)] bg-[var(--color-surface-muted)] hover:bg-[var(--color-border-muted)] border border-[var(--color-border)] text-[var(--color-text)] flex items-center justify-center transition duration-[var(--transition-fast)] shadow-[var(--shadow-sm)]"
        >
          <Icon icon={Plus} size={16} label={i18n.rail.add} />
        </button>
      </div>
    </aside>
  );
}

export default LeftRail;
