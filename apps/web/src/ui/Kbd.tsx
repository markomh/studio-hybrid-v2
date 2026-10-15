import React from 'react';

export interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

/** Keyboard shortcut indicator. */
export function Kbd({ children, className = '' }: KbdProps) {
  return (
    <kbd
      className={[
        'inline-flex items-center justify-center',
        'h-5 min-w-5 px-1',
        'rounded-[var(--radius-sm)]',
        'bg-[var(--color-surface-muted)] border border-[var(--color-border)]',
        'text-[10px] font-mono font-medium text-[var(--color-text-muted)]',
        'shadow-[0_1px_0_var(--color-border)]',
        'select-none',
        className,
      ].join(' ')}
    >
      {children}
    </kbd>
  );
}
