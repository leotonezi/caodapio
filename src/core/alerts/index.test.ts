import { describe, expect, it } from 'vitest'
import {
  checkCarbAlreadyLogged,
  checkOverTarget,
  checkTreatsOverLimit,
  checkVegTypesOutOfRange,
  forbiddenFoodMatch,
} from './index'

describe('checkCarbAlreadyLogged', () => {
  const targets = new Map([
    ['sweet-potato', 180],
    ['rice', 150],
  ])

  it('returns null when no carb logged yet today', () => {
    expect(checkCarbAlreadyLogged([], 'sweet-potato', targets)).toBeNull()
  })

  it('returns null when logging the same item again', () => {
    expect(
      checkCarbAlreadyLogged(
        [{ itemId: 'sweet-potato', grams: 90 }],
        'sweet-potato',
        targets,
      ),
    ).toBeNull()
  })

  it('flags a second distinct carb with a proportional swap suggestion', () => {
    const alert = checkCarbAlreadyLogged(
      [{ itemId: 'sweet-potato', grams: 90 }],
      'rice',
      targets,
    )
    expect(alert?.code).toBe('CARB_ALREADY_LOGGED')
    expect(alert?.suggestedSwapGrams).toBeCloseTo(75)
  })

  it('falls back to a target of 1 for an existing item id missing from the targets map', () => {
    const alert = checkCarbAlreadyLogged(
      [{ itemId: 'unknown-carb', grams: 90 }],
      'rice',
      targets,
    )
    expect(alert?.suggestedSwapGrams).toBeCloseTo(90 * 150)
  })

  it('falls back to a target of 1 for a new item id missing from the targets map', () => {
    const alert = checkCarbAlreadyLogged(
      [{ itemId: 'sweet-potato', grams: 90 }],
      'unknown-carb',
      targets,
    )
    expect(alert?.suggestedSwapGrams).toBeCloseTo(0.5)
  })
})

describe('checkVegTypesOutOfRange', () => {
  it('flags fewer than minTypes', () => {
    expect(
      checkVegTypesOutOfRange([{ itemId: 'carrot' }], 2, 3),
    ).toBe('VEG_TYPES_OUT_OF_RANGE')
  })

  it('flags more than maxTypes', () => {
    expect(
      checkVegTypesOutOfRange(
        [{ itemId: 'carrot' }, { itemId: 'zucchini' }, { itemId: 'pumpkin' }, { itemId: 'spinach' }],
        2,
        3,
      ),
    ).toBe('VEG_TYPES_OUT_OF_RANGE')
  })

  it('passes within range', () => {
    expect(
      checkVegTypesOutOfRange(
        [{ itemId: 'carrot' }, { itemId: 'zucchini' }],
        2,
        3,
      ),
    ).toBeNull()
  })
})

describe('checkTreatsOverLimit', () => {
  it('flags grams over the default 15g limit', () => {
    expect(checkTreatsOverLimit(16)).toBe('TREATS_OVER_LIMIT')
  })

  it('passes at exactly the limit', () => {
    expect(checkTreatsOverLimit(15)).toBeNull()
  })

  it('respects a custom limit', () => {
    expect(checkTreatsOverLimit(25, 20)).toBe('TREATS_OVER_LIMIT')
  })
})

describe('checkOverTarget', () => {
  it('flags above the default 110% threshold', () => {
    expect(checkOverTarget(1.2)).toBe('OVER_TARGET')
  })

  it('passes at exactly the threshold', () => {
    expect(checkOverTarget(1.1)).toBeNull()
  })

  it('respects a custom threshold', () => {
    expect(checkOverTarget(1.05, 100)).toBe('OVER_TARGET')
  })
})

describe('forbiddenFoodMatch', () => {
  const forbidden = ['chocolate', 'uva', 'cebola', 'abacate']

  it('matches case-insensitively', () => {
    expect(forbiddenFoodMatch('um pouco de CHOCOLATE', forbidden)).toBe(
      'chocolate',
    )
  })

  it('matches accent-insensitively', () => {
    expect(forbiddenFoodMatch('comeu abacate', forbidden)).toBe('abacate')
  })

  it('matches when the forbidden term has an accent and the text does not', () => {
    expect(forbiddenFoodMatch('um pouco de uva', ['úva'])).toBe('úva')
  })

  it('returns null when nothing matches', () => {
    expect(forbiddenFoodMatch('frango e arroz', forbidden)).toBeNull()
  })
})
