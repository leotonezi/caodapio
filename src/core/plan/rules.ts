import type { ProteinItem } from './schema'

const FRACTION_TOLERANCE = 1e-6

export function proteinFractionsValid(items: ProteinItem[]): boolean {
  if (items.length < 1 || items.length > 2) return false
  const sum = items.reduce((total, item) => total + item.fraction, 0)
  return Math.abs(sum - 1) <= FRACTION_TOLERANCE
}

export function lardTargetForFractions(
  lardTotalTarget: number,
  proteinFractions: number[],
): number[] {
  return proteinFractions.map((fraction) => lardTotalTarget * fraction)
}

export function applyOrganEggSwap(
  meatTargetGrams: number,
  swapGrams = 70,
): number {
  return Math.max(0, meatTargetGrams - swapGrams)
}
