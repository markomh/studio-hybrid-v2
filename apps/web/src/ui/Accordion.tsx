import React from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { Icon } from './Icon';

export interface AccordionItem {
  value: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  defaultValue?: string[];
  className?: string;
}

export function Accordion({ items, type = 'multiple', defaultValue, className = '' }: AccordionProps) {
  return (
    <RadixAccordion.Root
      type={type}
      defaultValue={defaultValue}
      className={['divide-y divide-[var(--color-border)]', className].join(' ')}
    >
      {items.map((item) => (
        <RadixAccordion.Item key={item.value} value={item.value}>
          <RadixAccordion.Header>
            <RadixAccordion.Trigger
              className={[
                'flex w-full items-center justify-between',
                'px-3 py-2.5 text-[var(--text-sm)] font-medium text-[var(--color-text)]',
                'hover:bg-[var(--color-surface-muted)]',
                'transition-colors duration-[var(--transition-fast)]',
                'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus-ring)]',
                'cursor-pointer select-none',
                'group',
              ].join(' ')}
            >
              {item.title}
              <span className="transition-transform duration-200 group-data-[state=open]:rotate-180">
                <Icon icon={ChevronDown} size={14} />
              </span>
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="px-3 pb-3 text-[var(--text-sm)] text-[var(--color-text-muted)]">
              {item.content}
            </div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
}
