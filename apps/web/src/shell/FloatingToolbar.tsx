import React from 'react';
import { Icon } from '../ui/Icon';
import { Lock, Copy, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export interface FloatingToolbarProps {
  selectedElementId?: string | null;
  onLock?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

/**
 * FloatingToolbar: quick action bar positioned over canvas.
 * Per F3-A2, remains visible in Focus Mode.
 */
export function FloatingToolbar({
  selectedElementId,
  onLock,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: FloatingToolbarProps) {
  const hasSelection = Boolean(selectedElementId);

  return (
    <div
      data-testid="floating-toolbar"
      role="toolbar"
      aria-label="Floating Toolbar"
      className="absolute top-4 left-1/2 -translate-x-1/2 z-[var(--z-panel,20)] bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-1 flex items-center space-x-1 shadow-[var(--shadow-md)] text-[var(--color-text)] select-none"
    >
      <button
        type="button"
        onClick={onLock}
        disabled={!hasSelection}
        title="Kunci Elemen"
        className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-40 disabled:pointer-events-none transition duration-[var(--transition-fast)]"
      >
        <Icon icon={Lock} size={14} label="Kunci Elemen" />
      </button>

      <button
        type="button"
        onClick={onDuplicate}
        disabled={!hasSelection}
        title="Duplikasi Elemen"
        className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-40 disabled:pointer-events-none transition duration-[var(--transition-fast)]"
      >
        <Icon icon={Copy} size={14} label="Duplikasi Elemen" />
      </button>

      <div className="w-px h-4 bg-[var(--color-border)]" />

      <button
        type="button"
        onClick={onMoveUp}
        disabled={!hasSelection}
        title="Bawa ke Atas"
        className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-40 disabled:pointer-events-none transition duration-[var(--transition-fast)]"
      >
        <Icon icon={ArrowUp} size={14} label="Bawa ke Atas" />
      </button>

      <button
        type="button"
        onClick={onMoveDown}
        disabled={!hasSelection}
        title="Turunkan ke Bawah"
        className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-40 disabled:pointer-events-none transition duration-[var(--transition-fast)]"
      >
        <Icon icon={ArrowDown} size={14} label="Turunkan ke Bawah" />
      </button>

      <div className="w-px h-4 bg-[var(--color-border)]" />

      <button
        type="button"
        onClick={onDelete}
        disabled={!hasSelection}
        title="Hapus Elemen"
        className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-danger)]/10 text-[var(--color-danger)] disabled:opacity-40 disabled:pointer-events-none transition duration-[var(--transition-fast)]"
      >
        <Icon icon={Trash2} size={14} label="Hapus Elemen" />
      </button>
    </div>
  );
}

export default FloatingToolbar;
