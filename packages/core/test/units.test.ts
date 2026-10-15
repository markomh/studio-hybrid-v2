import { describe, it, expect } from 'vitest';
import { mmToPt, ptToMm, mmToIn, inToMm } from '../src/units';

describe('Units Conversion (I-1)', () => {
  it('converts mm to pt correctly (25.4 mm = 72 pt)', () => {
    expect(mmToPt(25.4)).toBe(72);
  });

  it('converts pt to mm correctly', () => {
    expect(ptToMm(72)).toBeCloseTo(25.4, 9);
  });

  it('performs roundtrip conversion without difference > 1e-9', () => {
    const originalMm = 148.5;
    const pt = mmToPt(originalMm);
    const roundtripMm = ptToMm(pt);
    expect(Math.abs(roundtripMm - originalMm)).toBeLessThan(1e-9);

    const originalInches = 6.0;
    const mm = inToMm(originalInches);
    const roundtripInches = mmToIn(mm);
    expect(Math.abs(roundtripInches - originalInches)).toBeLessThan(1e-9);
  });
});
