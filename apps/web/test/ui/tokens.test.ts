import { describe, it, expect } from 'vitest';

function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const rgb = parseInt(cleanHex, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const a = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

describe('Design Tokens Contrast (F3-A1)', () => {
  const pairs = [
    { name: 'Text on Surface', text: '#111827', surface: '#FFFFFF', min: 4.5 },
    { name: 'Muted Text on Surface', text: '#4B5563', surface: '#FFFFFF', min: 4.5 },
    { name: 'Primary Contrast on Primary', text: '#FFFFFF', surface: '#4F46E5', min: 4.5 },
    { name: 'Danger Contrast on Danger', text: '#FFFFFF', surface: '#B91C1C', min: 4.5 },
    { name: 'Success Contrast on Success', text: '#FFFFFF', surface: '#14532d', min: 4.5 },
    { name: 'Warning Contrast on Warning', text: '#FFFFFF', surface: '#D97706', min: 3.0 },
  ];

  for (const pair of pairs) {
    it(`should have contrast ratio >= ${pair.min} for ${pair.name}`, () => {
      const ratio = getContrastRatio(pair.text, pair.surface);
      expect(ratio).toBeGreaterThanOrEqual(pair.min);
    });
  }
});
