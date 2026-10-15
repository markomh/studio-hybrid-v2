import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, trigger, title, description, children }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className={[
            'fixed inset-0 z-[var(--z-dialog)]',
            'bg-black/40 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          ].join(' ')}
        />
        <RadixDialog.Content
          className={[
            'fixed z-[var(--z-dialog)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-md max-h-[85vh]',
            'rounded-[var(--radius-xl)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]',
            'border border-[var(--color-border)]',
            'p-6 overflow-auto',
            'focus:outline-none',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          ].join(' ')}
        >
          <RadixDialog.Title className="text-[var(--text-lg)] font-semibold text-[var(--color-text)]">
            {title}
          </RadixDialog.Title>
          {description && (
            <RadixDialog.Description className="mt-1.5 text-[var(--text-sm)] text-[var(--color-text-muted)]">
              {description}
            </RadixDialog.Description>
          )}
          <div className="mt-4">{children}</div>
          <RadixDialog.Close asChild>
            <div className="absolute top-3 right-3">
              <IconButton icon={X} label="Tutup" size="sm" />
            </div>
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
