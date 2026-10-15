import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface IconProps {
  /** The Lucide icon component to render */
  icon: LucideIcon;
  /** Icon size in pixels. Defaults to 16. */
  size?: number;
  /** CSS class for additional styling */
  className?: string;
  /** Accessible label. If omitted, icon is decorative (aria-hidden). */
  label?: string;
}

/**
 * Wraps a Lucide icon with enforced default size (16px).
 * Invariant: No raw <svg> without explicit size in apps/web/src.
 */
export function Icon({ icon: LucideComponent, size = 16, className, label }: IconProps) {
  return (
    <LucideComponent
      size={size}
      className={className}
      aria-hidden={!label}
      aria-label={label}
      role={label ? 'img' : undefined}
    />
  );
}
