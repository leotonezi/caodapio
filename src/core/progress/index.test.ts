import { describe, expect, it } from 'vitest'
import { categoryProgress } from './index'

const items = [
  { id: 'sweet-potato', label: 'Batata doce', targetGrams: 180 },
  { id: 'rice', label: 'Arroz', targetGrams: 150 },
]

describe('categoryProgress', () => {
  it('computes the fraction example from the spec: 90g sweet potato then remaining rice', () => {
    const progress = categoryProgress(items, [
      { itemId: 'sweet-potato', grams: 90 },
    ])
    expect(progress.fraction).toBeCloseTo(0.5)
    expect(progress.remainingGrams('rice')).toBeCloseTo(75)
  })

  it('is 0 fraction with no entries', () => {
    const progress = categoryProgress(items, [])
    expect(progress.fraction).toBe(0)
    expect(progress.remainingGrams('sweet-potato')).toBe(180)
  })

  it('sums fractions across multiple entries', () => {
    const progress = categoryProgress(items, [
      { itemId: 'sweet-potato', grams: 90 },
      { itemId: 'rice', grams: 75 },
    ])
    expect(progress.fraction).toBeCloseTo(1)
    expect(progress.remainingGrams('rice')).toBeCloseTo(0)
  })

  it('does not go negative when over target', () => {
    const progress = categoryProgress(items, [
      { itemId: 'sweet-potato', grams: 360 },
    ])
    expect(progress.remainingGrams('rice')).toBe(0)
  })

  it('ignores entries for unknown item ids', () => {
    const progress = categoryProgress(items, [
      { itemId: 'unknown', grams: 100 },
    ])
    expect(progress.fraction).toBe(0)
    expect(progress.remainingGrams('unknown')).toBe(0)
  })
})
