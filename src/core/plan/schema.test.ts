import { describe, expect, it } from 'vitest'
import { SEED_PLAN } from './seed'
import { validatePlan } from './schema'

describe('validatePlan', () => {
  it('accepts the seed plan', () => {
    expect(validatePlan(SEED_PLAN)).toEqual(SEED_PLAN)
  })

  it('rejects a plan missing required categories', () => {
    const invalid = { ...SEED_PLAN, categories: undefined }
    expect(() => validatePlan(invalid)).toThrow()
  })

  it('rejects a plan with more than 2 protein items', () => {
    const invalid = {
      ...SEED_PLAN,
      categories: {
        ...SEED_PLAN.categories,
        protein: {
          items: [
            ...SEED_PLAN.categories.protein.items,
            { id: 'fish', label: 'Peixe', targetGrams: 100, fraction: 0.2 },
          ],
        },
      },
    }
    expect(() => validatePlan(invalid)).toThrow()
  })
})
