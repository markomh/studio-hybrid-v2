import React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';

export interface SliderProps {
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  onChange?: (value: number[]) => void;
  className?: string;
}

export function Slider({
  value,
  defaultValue = [50],
  min = 0,
  max = 100,
  step = 1,
  label,
  onChange,
  className = '',
}: SliderProps) {
  return (
    <RadixSlider.Root
      className={['relative flex items-center h-5 w-full select-none touch-none', className].join(' ')}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      onValueChange={onChange}
      aria-label={label}
    >
      <RadixSlider.Track className="relative grow h-1 rounded-full bg-[var(--color-border)]">
        <RadixSlider.Range className="absolute h-full rounded-full bg-[var(--color-primary)]" />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className={[
          'block w-3.5 h-3.5 rounded-full',
          'bg-[var(--color-surface)] border-2 border-[var(--color-primary)]',
          'shadow-[var(--shadow-sm)]',
          'hover:border-[var(--color-primary-hover)]',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]',
          'transition-colors duration-[var(--transition-fast)]',
          'cursor-pointer',
        ].join(' ')}
      />
    </RadixSlider.Root>
  );
}
