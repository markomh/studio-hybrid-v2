import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Icon } from './Icon';

export type IconButtonVariant = 'ghost' | 'secondary' | 'primary';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LucideIcon;
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

const variantClasses: Record<IconButtonVariant, string> = {
  ghost: 'bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]',
  secondary: 'bg-[var(--color-surface-muted)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-border-muted)]',
  primary: 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)] hover:bg-[var(--color-primary-hover)]',
};

const sizeMap: Record<IconButtonSize, { btn: string; icon: number }> = {
  sm: { btn: 'h-7 w-7', icon: 14 },
  md: { btn: 'h-8 w-8', icon: 16 },
  lg: { btn: 'h-9 w-9', icon: 18 },
};

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  className = '',
  disabled,
  ...props
}: IconButtonProps) {
  const s = sizeMap[size];
  return (
    <button
      className={[
        'inline-flex items-center justify-center rounded-[var(--radius-md)]',
        'transition-all duration-[var(--transition-fast)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]',
        'disabled:opacity-50 disabled:pointer-events-none',
        'select-none cursor-pointer',
        variantClasses[variant],
        s.btn,
        className,
      ].join(' ')}
      aria-label={label}
      title={label}
      disabled={disabled}
      {...props}
    >
      <Icon icon={icon} size={s.icon} />
    </button>
  );
}
