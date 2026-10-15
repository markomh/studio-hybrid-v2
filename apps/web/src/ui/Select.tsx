import React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { Icon } from './Icon';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Select({
  options,
  value,
  defaultValue,
  placeholder = '—',
  label,
  onChange,
  className = '',
}: SelectProps) {
  return (
    <RadixSelect.Root value={value} defaultValue={defaultValue} onValueChange={onChange}>
      <RadixSelect.Trigger
        className={[
          'inline-flex items-center justify-between gap-1',
          'h-8 px-2.5 min-w-[120px]',
          'rounded-[var(--radius-md)] border border-[var(--color-border)]',
          'bg-[var(--color-surface)] text-[var(--text-sm)] text-[var(--color-text)]',
          'hover:border-[var(--color-text-muted)]',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]',
          'transition-colors duration-[var(--transition-fast)]',
          'cursor-pointer select-none',
          className,
        ].join(' ')}
        aria-label={label}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <Icon icon={ChevronDown} size={14} />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={4}
          className={[
            'z-[var(--z-tooltip)]',
            'overflow-hidden rounded-[var(--radius-lg)]',
            'border border-[var(--color-border)]',
            'bg-[var(--color-surface)] shadow-[var(--shadow-lg)]',
            'min-w-[var(--radix-select-trigger-width)]',
          ].join(' ')}
        >
          <RadixSelect.Viewport className="p-1">
            {options.map((opt) => (
              <RadixSelect.Item
                key={opt.value}
                value={opt.value}
                className={[
                  'flex items-center gap-2 px-2 py-1.5',
                  'rounded-[var(--radius-sm)] text-[var(--text-sm)] text-[var(--color-text)]',
                  'outline-none cursor-pointer select-none',
                  'data-[highlighted]:bg-[var(--color-primary)] data-[highlighted]:text-[var(--color-primary-contrast)]',
                ].join(' ')}
              >
                <RadixSelect.ItemIndicator className="w-4">
                  <Icon icon={Check} size={14} />
                </RadixSelect.ItemIndicator>
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
