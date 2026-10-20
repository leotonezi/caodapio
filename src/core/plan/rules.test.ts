import { describe, expect, it } from 'vitest'
import { applyOrganEggSwap, lardTargetForFractions, proteinFractionsValid } from './rules'

describe('proteinFractionsValid', () => {
  it('accepts a single protein item with fraction 1.0', () => {
    expect(
      proteinFractionsValid([{ id: 'chicken-breast', label: 'Peito de frango', targetGrams: 200, fraction: 1 }]),
    ).toBe(true)
  })

  it('accepts two protein items whose fractions sum to 1.0', () => {
    expect(
      proteinFractionsValid([
        { id: 'chicken-breast', label: 'Peito de frango', targetGrams: 200, fraction: 0.6 },
        { id: 'beef', label: 'Carne bovina', targetGrams: 150, fraction: 0.4 },
      ]),
    ).toBe(true)
  })

  it('rejects fractions that do not sum to 1.0', () => {
    expect(
      proteinFractionsValid([
        { id: 'chicken-breast', label: 'Peito de frango', targetGrams: 200, fraction: 0.5 },
        { id: 'beef', label: 'Carne bovina', targetGrams: 150, fraction: 0.3 },
      ]),
    ).toBe(false)
  })

  it('rejects zero or more than two items', () => {
    expect(proteinFractionsValid([])).toBe(false)
  })
})

describe('lardTargetForFractions', () => {
  it('splits lard target proportionally to protein fractions', () => {
    expect(lardTargetForFractions(20, [0.6, 0.4])).toEqual([12, 8])
  })

  it('gives the full lard target to a single protein', () => {
    expect(lardTargetForFractions(20, [1])).toEqual([20])
  })
})

describe('applyOrganEggSwap', () => {
  it('reduces the meat target by the swap amount', () => {
    expect(applyOrganEggSwap(200)).toBe(130)
  })

  it('accepts a custom swap amount', () => {
    expect(applyOrganEggSwap(200, 50)).toBe(150)
  })

  it('does not go below zero', () => {
    expect(applyOrganEggSwap(50)).toBe(0)
  })
})
