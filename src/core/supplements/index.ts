import { dayDiff } from '../time'

export function foodDogDoseGrams(
  date: Date,
  startDate: Date,
  fullDoseGrams: number,
): number {
  const dayNumber = dayDiff(startDate, date) + 1
  if (dayNumber < 1) return 0
  if (dayNumber <= 2) return fullDoseGrams / 4
  if (dayNumber <= 4) return fullDoseGrams / 2
  return fullDoseGrams
}
