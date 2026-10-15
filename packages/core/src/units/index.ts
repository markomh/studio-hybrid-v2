/**
 * Geometry units conversion module (I-1: Geometri selalu dalam mm).
 * Conversion factors: 1 inch = 25.4 mm = 72 points (pt).
 */

const MM_PER_INCH = 25.4;
const PT_PER_INCH = 72;

export function mmToPt(mm: number): number {
  return (mm * PT_PER_INCH) / MM_PER_INCH;
}

export function ptToMm(pt: number): number {
  return (pt * MM_PER_INCH) / PT_PER_INCH;
}

export function mmToIn(mm: number): number {
  return mm / MM_PER_INCH;
}

export function inToMm(inch: number): number {
  return inch * MM_PER_INCH;
}
