import { describe, expect, it } from 'vitest'
import { dayDiff, getDayKey } from './index'

describe('getDayKey', () => {
  it('returns the America/Sao_Paulo day for a UTC morning instant', () => {
    // 2026-09-21T02:00:00Z = 2026-09-20T23:00:00-03:00 (previous day locally)
    expect(getDayKey(new Date('2026-09-21T02:00:00Z'))).toBe('2026-09-20')
  })

  it('returns the correct day for a late-night local entry just before midnight', () => {
    // 2026-09-20T23:59:00-03:00 = 2026-09-21T02:59:00Z
    expect(getDayKey(new Date('2026-09-21T02:59:00Z'))).toBe('2026-09-20')
  })

  it('rolls over to the next day right at local midnight', () => {
    // 2026-09-21T00:00:00-03:00 = 2026-09-21T03:00:00Z
    expect(getDayKey(new Date('2026-09-21T03:00:00Z'))).toBe('2026-09-21')
  })

  it('accepts a different IANA time zone', () => {
    expect(getDayKey(new Date('2026-09-21T02:00:00Z'), 'UTC')).toBe(
      '2026-09-21',
    )
  })
})

describe('dayDiff', () => {
  it('is 0 for the same local day', () => {
    const from = new Date('2026-09-21T15:00:00Z') // 2026-09-21 local
    const to = new Date('2026-09-21T23:00:00Z') // 2026-09-21 local
    expect(dayDiff(from, to)).toBe(0)
  })

  it('counts whole local days between two instants', () => {
    const from = new Date('2026-09-21T03:00:00Z') // 2026-09-21 local
    const to = new Date('2026-09-25T03:00:00Z') // 2026-09-25 local
    expect(dayDiff(from, to)).toBe(4)
  })

  it('is negative when "to" is before "from"', () => {
    const from = new Date('2026-09-25T03:00:00Z')
    const to = new Date('2026-09-21T03:00:00Z')
    expect(dayDiff(from, to)).toBe(-4)
  })
})
