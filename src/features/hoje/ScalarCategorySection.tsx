import { useState } from 'react'
import { checkOverTarget, checkTreatsOverLimit } from '../../core/alerts'
import type { EntryRecord } from '../../data/repositories/entry'
import { t } from '../../i18n/pt-BR'

interface ScalarCategorySectionProps {
  categoryKey: 'lard' | 'treats'
  title: string
  itemId: string
  targetGrams: number
  entries: EntryRecord[]
  onLog: (itemId: string, grams: number) => void
}

export function ScalarCategorySection({
  categoryKey,
  title,
  itemId,
  targetGrams,
  entries,
  onLog,
}: ScalarCategorySectionProps) {
  const [manualGrams, setManualGrams] = useState('')

  const given = entries
    .filter((e) => e.itemId === itemId)
    .reduce((sum, e) => sum + e.grams, 0)
  const fraction = targetGrams > 0 ? given / targetGrams : 0

  const alerts: string[] = []
  if (categoryKey === 'treats') {
    if (checkTreatsOverLimit(given, targetGrams)) alerts.push(t('alert.TREATS_OVER_LIMIT'))
  } else if (checkOverTarget(fraction)) {
    alerts.push(t('alert.OVER_TARGET'))
  }

  return (
    <section className="flex flex-col gap-3 rounded border border-neutral-200 p-4 dark:border-neutral-800">
      <h2 className="text-lg font-medium text-neutral-900 dark:text-white">{title}</h2>
      <div className="flex items-center justify-between text-sm text-neutral-700 dark:text-neutral-300">
        <span>
          {t('hoje.given')} {given}g / {t('hoje.target')} {targetGrams}g
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onLog(itemId, 10)}
          className="rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700"
        >
          +10g
        </button>
        <input
          type="number"
          min={0}
          value={manualGrams}
          onChange={(e) => setManualGrams(e.target.value)}
          placeholder={t('hoje.gramsPlaceholder')}
          className="w-20 rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        />
        <button
          type="button"
          onClick={() => {
            const grams = Number(manualGrams)
            if (grams > 0) {
              onLog(itemId, grams)
              setManualGrams('')
            }
          }}
          className="rounded bg-neutral-900 px-2 py-1 text-sm text-white dark:bg-white dark:text-neutral-900"
        >
          {t('hoje.logButton')}
        </button>
      </div>
      {alerts.map((message) => (
        <p key={message} className="text-sm text-amber-700 dark:text-amber-400">
          {message}
        </p>
      ))}
    </section>
  )
}
