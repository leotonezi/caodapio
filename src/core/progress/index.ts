import type { Item } from '../plan/schema'

export interface CategoryEntry {
  itemId: string
  grams: number
}

export interface CategoryProgress {
  fraction: number
  remainingGrams: (itemId: string) => number
}

export function categoryProgress(
  items: Item[],
  entries: CategoryEntry[],
): CategoryProgress {
  const itemsById = new Map(items.map((item) => [item.id, item]))

  const fraction = entries.reduce((total, entry) => {
    const item = itemsById.get(entry.itemId)
    if (!item) return total
    return total + entry.grams / item.targetGrams
  }, 0)

  return {
    fraction,
    remainingGrams: (itemId: string) => {
      const item = itemsById.get(itemId)
      if (!item) return 0
      return Math.max(0, (1 - fraction) * item.targetGrams)
    },
  }
}
