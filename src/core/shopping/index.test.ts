import { describe, expect, it } from 'vitest'
import {
  CHICKEN_BREAST_DEFAULT_LOSS_PCT,
  itemCost,
  monthlyCost,
  rawGrams,
} from './index'

describe('rawGrams', () => {
  it('converts cooked grams to raw grams using the loss percentage', () => {
    // 200g cooked chicken breast at 40% loss -> 200 / 0.6
    expect(rawGrams(200, CHICKEN_BREAST_DEFAULT_LOSS_PCT)).toBeCloseTo(
      333.33,
      2,
    )
  })

  it('returns the same grams when there is no loss', () => {
    expect(rawGrams(150, 0)).toBe(150)
  })
})

describe('itemCost', () => {
  it('computes cost from raw grams and price per kg', () => {
    expect(itemCost(1000, 25)).toBe(25)
    expect(itemCost(500, 25)).toBe(12.5)
  })
})

describe('monthlyCost', () => {
  it('multiplies daily cost by 30', () => {
    expect(monthlyCost(10)).toBe(300)
  })
})
