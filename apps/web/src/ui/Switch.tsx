import React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  label: string;
  onChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function Switch({
  checked,
  defaultChecked,
  label,
  onChange,
  className = '',
  disabled,
}: SwitchProps) {
  return (
    <RadixSwitch.Root
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onChange}
      disabled={disabled}
      className={[
        'relative inline-flex items-center h-5 w-9 shrink-0',
        'rounded-full border-2 border-transparent',
        'transition-colors duration-[var(--transition-fast)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]',
        'disabled:opacity-50 disabled:pointer-events-none',
        'cursor-pointer',
        'bg-[var(--color-border)]',
        'data-[state=checked]:bg-[var(--color-primary)]',
        className,
      ].join(' ')}
      aria-label={label}
    >
      <RadixSwitch.Thumb
        className={[
          'block w-4 h-4 rounded-full',
          'bg-[var(--color-surface)]',
          'shadow-[var(--shadow-sm)]',
          'transition-transform duration-[var(--transition-fast)]',
          'data-[state=checked]:translate-x-4',
          'data-[state=unchecked]:translate-x-0',
        ].join(' ')}
      />
    </RadixSwitch.Root>
  );
}
