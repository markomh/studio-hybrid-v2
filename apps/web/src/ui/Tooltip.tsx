import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';

export interface TooltipProps {
  children: React.ReactElement;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
}

export function Tooltip({ children, content, side = 'top', delayDuration = 300 }: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={4}
            className={[
              'z-[var(--z-tooltip)]',
              'px-2.5 py-1.5 rounded-[var(--radius-md)]',
              'bg-[var(--color-text)] text-[var(--color-text-inverse)]',
              'text-[var(--text-xs)] font-medium leading-tight',
              'shadow-[var(--shadow-md)]',
              'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              'select-none',
            ].join(' ')}
          >
            {content}
            <RadixTooltip.Arrow className="fill-[var(--color-text)]" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
