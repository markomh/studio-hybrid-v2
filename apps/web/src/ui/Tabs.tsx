import React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
}

export function Tabs({ items, defaultValue, className = '' }: TabsProps) {
  const dv = defaultValue || items[0]?.value || '';
  return (
    <RadixTabs.Root defaultValue={dv} className={className}>
      <RadixTabs.List
        className={[
          'flex border-b border-[var(--color-border)]',
          'bg-[var(--color-surface)]',
        ].join(' ')}
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className={[
              'px-3 py-2 text-[var(--text-sm)] font-medium',
              'text-[var(--color-text-muted)]',
              'border-b-2 border-transparent',
              'hover:text-[var(--color-text)] hover:border-[var(--color-border)]',
              'data-[state=active]:text-[var(--color-primary)] data-[state=active]:border-[var(--color-primary)]',
              'transition-colors duration-[var(--transition-fast)]',
              'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus-ring)]',
              'cursor-pointer select-none',
            ].join(' ')}
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content key={item.value} value={item.value} className="p-3">
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
