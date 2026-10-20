import { useState } from 'react'
import { categoryProgress } from '../../core/progress'
import { checkOverTarget, checkVegTypesOutOfRange } from '../../core/alerts'
import type { Item } from '../../core/plan/schema'
import type { EntryRecord } from '../../data/repositories/entry'
import { t } from '../../i18n/pt-BR'

interface CategorySectionProps {
  categoryKey: 'carb' | 'protein' | 'vegetables'
  title: string
  items: Item[]
  entries: EntryRecord[]
  vegRange?: { minTypes: number; maxTypes: number }
  onLog: (itemId: string, grams: number) => void
}

export function CategorySection({
  categoryKey,
  title,
  items,
  entries,
  vegRange,
  onLog,
}: CategorySectionProps) {
  const [manualGrams, setManualGrams] = useState<Record<string, string>>({})

  const categoryEntries = entries.map((e) => ({ itemId: e.itemId, grams: e.grams }))
  const progress = categoryProgress(items, categoryEntries)

  const alerts: string[] = []
  if (checkOverTarget(progress.fraction)) alerts.push(t('alert.OVER_TARGET'))
  if (categoryKey === 'carb') {
    const distinctItemIds = new Set(categoryEntries.map((e) => e.itemId))
    if (distinctItemIds.size > 1) alerts.push(t('alert.CARB_ALREADY_LOGGED'))
  }
  if (categoryKey === 'vegetables' && vegRange) {
    if (checkVegTypesOutOfRange(categoryEntries, vegRange.minTypes, vegRange.maxTypes)) {
      alerts.push(t('alert.VEG_TYPES_OUT_OF_RANGE'))
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded border border-neutral-200 p-4 dark:border-neutral-800">
      <h2 className="text-lg font-medium text-neutral-900 dark:text-white">{title}</h2>
      {items.map((item) => {
        const given = categoryEntries
          .filter((e) => e.itemId === item.id)
          .reduce((sum, e) => sum + e.grams, 0)
        const remaining = progress.remainingGrams(item.id)

        return (
          <div key={item.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm text-neutral-700 dark:text-neutral-300">
              <span>{item.label}</span>
              <span>
                {t('hoje.given')} {given}g / {t('hoje.target')} {item.targetGrams}g (
                {t('hoje.remaining')} {Math.round(remaining)}g)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onLog(item.id, 10)}
                className="rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700"
              >
                +10g
              </button>
              <button
                type="button"
                onClick={() => onLog(item.id, 50)}
                className="rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700"
              >
                +50g
              </button>
              <input
                type="number"
                min={0}
                value={manualGrams[item.id] ?? ''}
                onChange={(e) =>
                  setManualGrams((prev) => ({ ...prev, [item.id]: e.target.value }))
                }
                placeholder={t('hoje.gramsPlaceholder')}
                className="w-20 rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => {
                  const grams = Number(manualGrams[item.id])
                  if (grams > 0) {
                    onLog(item.id, grams)
                    setManualGrams((prev) => ({ ...prev, [item.id]: '' }))
                  }
                }}
                className="rounded bg-neutral-900 px-2 py-1 text-sm text-white dark:bg-white dark:text-neutral-900"
              >
                {t('hoje.logButton')}
              </button>
            </div>
          </div>
        )
      })}
      {alerts.map((message) => (
        <p key={message} className="text-sm text-amber-700 dark:text-amber-400">
          {message}
        </p>
      ))}
    </section>
  )
}
