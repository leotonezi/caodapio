export type AlertCode =
  | 'CARB_ALREADY_LOGGED'
  | 'VEG_TYPES_OUT_OF_RANGE'
  | 'TREATS_OVER_LIMIT'
  | 'OVER_TARGET'

export interface CarbAlert {
  code: 'CARB_ALREADY_LOGGED'
  loggedItemId: string
  suggestedSwapItemId: string
  suggestedSwapGrams: number
}

export function checkCarbAlreadyLogged(
  todaysCarbEntries: { itemId: string; grams: number }[],
  newItemId: string,
  itemTargetGrams: Map<string, number>,
): CarbAlert | null {
  const existing = todaysCarbEntries.find(
    (entry) => entry.itemId !== newItemId,
  )
  if (!existing) return null

  const existingTarget = itemTargetGrams.get(existing.itemId) ?? 1
  const newTarget = itemTargetGrams.get(newItemId) ?? 1
  const fractionLogged = existing.grams / existingTarget

  return {
    code: 'CARB_ALREADY_LOGGED',
    loggedItemId: existing.itemId,
    suggestedSwapItemId: newItemId,
    suggestedSwapGrams: fractionLogged * newTarget,
  }
}

export function checkVegTypesOutOfRange(
  todaysVegEntries: { itemId: string }[],
  minTypes: number,
  maxTypes: number,
): 'VEG_TYPES_OUT_OF_RANGE' | null {
  const distinctTypes = new Set(todaysVegEntries.map((e) => e.itemId)).size
  if (distinctTypes < minTypes || distinctTypes > maxTypes) {
    return 'VEG_TYPES_OUT_OF_RANGE'
  }
  return null
}

export function checkTreatsOverLimit(
  todaysTreatGrams: number,
  limitGrams = 15,
): 'TREATS_OVER_LIMIT' | null {
  return todaysTreatGrams > limitGrams ? 'TREATS_OVER_LIMIT' : null
}

export function checkOverTarget(
  categoryFraction: number,
  thresholdPct = 110,
): 'OVER_TARGET' | null {
  const FLOAT_TOLERANCE = 1e-9
  return categoryFraction * 100 > thresholdPct + FLOAT_TOLERANCE
    ? 'OVER_TARGET'
    : null
}

function stripDiacritics(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function forbiddenFoodMatch(
  text: string,
  forbiddenTerms: string[],
): string | null {
  const normalizedText = stripDiacritics(text).toLowerCase()
  const match = forbiddenTerms.find((term) =>
    normalizedText.includes(stripDiacritics(term).toLowerCase()),
  )
  return match ?? null
}
