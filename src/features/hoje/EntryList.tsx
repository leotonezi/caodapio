import { useState } from 'react'
import type { EntryRecord } from '../../data/repositories/entry'
import { t } from '../../i18n/pt-BR'

interface EntryListProps {
  entries: EntryRecord[]
  itemLabelsById: Map<string, string>
  memberNamesById: Map<string, string>
  onEdit: (id: string, grams: number) => void
  onDelete: (id: string) => void
}

export function EntryList({
  entries,
  itemLabelsById,
  memberNamesById,
  onEdit,
  onDelete,
}: EntryListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editGrams, setEditGrams] = useState('')

  if (entries.length === 0) return null

  return (
    <section className="flex flex-col gap-2 rounded border border-neutral-200 p-4 dark:border-neutral-800">
      <ul className="flex flex-col gap-2">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex items-center justify-between text-sm text-neutral-700 dark:text-neutral-300"
          >
            {editingId === entry.id ? (
              <>
                <span>{itemLabelsById.get(entry.itemId) ?? entry.itemId}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={editGrams}
                    onChange={(e) => setEditGrams(e.target.value)}
                    className="w-20 rounded border border-neutral-300 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const grams = Number(editGrams)
                      if (grams > 0) {
                        onEdit(entry.id, grams)
                        setEditingId(null)
                      }
                    }}
                    className="rounded bg-neutral-900 px-2 py-1 text-white dark:bg-white dark:text-neutral-900"
                  >
                    {t('hoje.saveButton')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <span>
                  {itemLabelsById.get(entry.itemId) ?? entry.itemId} — {entry.grams}g (
                  {t(entry.meal === 1 ? 'hoje.meal1' : entry.meal === 2 ? 'hoje.meal2' : 'hoje.meal3')},{' '}
                  {t('hoje.loggedBy')} {memberNamesById.get(entry.loggedBy) ?? '...'})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(entry.id)
                      setEditGrams(String(entry.grams))
                    }}
                    className="underline"
                  >
                    {t('hoje.editButton')}
                  </button>
                  <button type="button" onClick={() => onDelete(entry.id)} className="underline">
                    {t('hoje.deleteButton')}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
