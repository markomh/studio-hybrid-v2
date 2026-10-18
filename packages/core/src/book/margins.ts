import { Document } from '../schema';

export interface ComputedMargins {
  topMm: number;
  bottomMm: number;
  leftMm: number;
  rightMm: number;
}

/**
 * Computes margins for a given page index in a book, taking recto/verso
 * (odd/even page numbers) into account for inside/outside margin swapping.
 */
export function computeMargins(doc: Document, pageIndex: number): ComputedMargins {
  const pageNumber = pageIndex + 1;
  const isRecto = pageNumber % 2 === 1;
  const topMm = doc.meta.margins.topMm;
  const bottomMm = doc.meta.margins.bottomMm;
  const insideMm = doc.meta.margins.insideMm;
  const outsideMm = doc.meta.margins.outsideMm;

  return {
    topMm,
    bottomMm,
    leftMm: isRecto ? insideMm : outsideMm,
    rightMm: isRecto ? outsideMm : insideMm,
  };
}
