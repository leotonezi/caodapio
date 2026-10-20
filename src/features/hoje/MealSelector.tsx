import { t } from '../../i18n/pt-BR'

const MEALS: { value: 1 | 2 | 3; labelKey: 'hoje.meal1' | 'hoje.meal2' | 'hoje.meal3' }[] = [
  { value: 1, labelKey: 'hoje.meal1' },
  { value: 2, labelKey: 'hoje.meal2' },
  { value: 3, labelKey: 'hoje.meal3' },
]

export function MealSelector({
  meal,
  onChange,
}: {
  meal: 1 | 2 | 3
  onChange: (meal: 1 | 2 | 3) => void
}) {
  return (
    <div className="flex gap-2">
      {MEALS.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => onChange(m.value)}
          className={`flex-1 rounded px-3 py-2 text-sm ${
            meal === m.value
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'border border-neutral-300 dark:border-neutral-700'
          }`}
        >
          {t(m.labelKey)}
        </button>
      ))}
    </div>
  )
}
