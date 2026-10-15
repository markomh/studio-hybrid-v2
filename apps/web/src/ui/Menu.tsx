import React from 'react';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';

export interface MenuItem {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  shortcut?: string;
}

export interface MenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  label?: string;
}

export function Menu({ trigger, items, label }: MenuProps) {
  return (
    <RadixDropdownMenu.Root>
      <RadixDropdownMenu.Trigger asChild>{trigger}</RadixDropdownMenu.Trigger>
      <RadixDropdownMenu.Portal>
        <RadixDropdownMenu.Content
          sideOffset={4}
          align="start"
          className={[
            'z-[var(--z-tooltip)]',
            'min-w-[160px] p-1',
            'rounded-[var(--radius-lg)] border border-[var(--color-border)]',
            'bg-[var(--color-surface)] shadow-[var(--shadow-lg)]',
          ].join(' ')}
          aria-label={label}
        >
          {items.map((item, i) => (
            <RadixDropdownMenu.Item
              key={i}
              disabled={item.disabled}
              onSelect={item.onClick}
              className={[
                'flex items-center justify-between gap-4',
                'px-2 py-1.5 rounded-[var(--radius-sm)]',
                'text-[var(--text-sm)] text-[var(--color-text)]',
                'outline-none cursor-pointer select-none',
                'data-[highlighted]:bg-[var(--color-primary)] data-[highlighted]:text-[var(--color-primary-contrast)]',
                'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
              ].join(' ')}
            >
              <span>{item.label}</span>
              {item.shortcut && (
                <span className="text-[var(--text-xs)] text-[var(--color-text-muted)] data-[highlighted]:text-[var(--color-primary-contrast)]">
                  {item.shortcut}
                </span>
              )}
            </RadixDropdownMenu.Item>
          ))}
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
  );
}
