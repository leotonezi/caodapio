import { describe, expect, it } from 'vitest'
import { foodDogDoseGrams } from './index'

const startDate = new Date('2026-09-21T03:00:00Z') // 2026-09-21 local

describe('foodDogDoseGrams', () => {
  it('is a quarter dose on day 1', () => {
    expect(foodDogDoseGrams(startDate, startDate, 10)).toBe(2.5)
  })

  it('is a quarter dose on day 2', () => {
    const day2 = new Date('2026-09-22T03:00:00Z')
    expect(foodDogDoseGrams(day2, startDate, 10)).toBe(2.5)
  })

  it('is a half dose on day 3', () => {
    const day3 = new Date('2026-09-23T03:00:00Z')
    expect(foodDogDoseGrams(day3, startDate, 10)).toBe(5)
  })

  it('is a half dose on day 4', () => {
    const day4 = new Date('2026-09-24T03:00:00Z')
    expect(foodDogDoseGrams(day4, startDate, 10)).toBe(5)
  })

  it('is the full dose on day 5 and beyond', () => {
    const day5 = new Date('2026-09-25T03:00:00Z')
    const day20 = new Date('2026-10-10T03:00:00Z')
    expect(foodDogDoseGrams(day5, startDate, 10)).toBe(10)
    expect(foodDogDoseGrams(day20, startDate, 10)).toBe(10)
  })

  it('is 0 before the start date', () => {
    const before = new Date('2026-09-20T03:00:00Z')
    expect(foodDogDoseGrams(before, startDate, 10)).toBe(0)
  })
})
