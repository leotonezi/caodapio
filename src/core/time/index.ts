const DEFAULT_TIME_ZONE = 'America/Sao_Paulo'

export function getDayKey(date: Date, timeZone: string = DEFAULT_TIME_ZONE): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const year = parts.find((p) => p.type === 'year')!.value
  const month = parts.find((p) => p.type === 'month')!.value
  const day = parts.find((p) => p.type === 'day')!.value

  return `${year}-${month}-${day}`
}

export function dayDiff(
  from: Date,
  to: Date,
  timeZone: string = DEFAULT_TIME_ZONE,
): number {
  const fromKey = getDayKey(from, timeZone)
  const toKey = getDayKey(to, timeZone)
  const fromUtc = Date.parse(`${fromKey}T00:00:00Z`)
  const toUtc = Date.parse(`${toKey}T00:00:00Z`)
  return Math.round((toUtc - fromUtc) / (1000 * 60 * 60 * 24))
}
