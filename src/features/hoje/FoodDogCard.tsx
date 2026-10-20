import { t } from '../../i18n/pt-BR'

export function FoodDogCard({
  doseGrams,
  checked,
  onToggle,
}: {
  doseGrams: number
  checked: boolean
  onToggle: (checked: boolean) => void
}) {
  return (
    <section className="flex items-center justify-between rounded border border-neutral-200 p-4 dark:border-neutral-800">
      <div>
        <h2 className="text-lg font-medium text-neutral-900 dark:text-white">
          {t('hoje.foodDog.title')}
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {Math.round(doseGrams * 10) / 10}g
        </p>
      </div>
      <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
        />
        {t('hoje.foodDog.checkboxLabel')}
      </label>
    </section>
  )
}
