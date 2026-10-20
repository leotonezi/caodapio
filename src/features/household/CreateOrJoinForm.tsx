import { useState } from 'react'
import { supabaseHouseholdRepository } from '../../data/supabase/household-repository'
import { t } from '../../i18n/pt-BR'

export function CreateOrJoinForm({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [householdName, setHouseholdName] = useState('')
  const [memberDisplayName, setMemberDisplayName] = useState('')
  const [dogName, setDogName] = useState('Ares')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    try {
      await supabaseHouseholdRepository.createHousehold({
        householdName,
        memberDisplayName,
        dogName,
      })
      onDone()
    } catch {
      setError(t('household.createError'))
    }
  }

  async function handleJoin(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    try {
      await supabaseHouseholdRepository.joinWithInvite({
        code: inviteCode,
        memberDisplayName,
      })
      onDone()
    } catch {
      setError(t('household.joinError'))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-neutral-900">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('create')}
            className={`flex-1 rounded px-3 py-2 ${mode === 'create' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'border border-neutral-300 dark:border-neutral-700'}`}
          >
            {t('household.createTitle')}
          </button>
          <button
            type="button"
            onClick={() => setMode('join')}
            className={`flex-1 rounded px-3 py-2 ${mode === 'join' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'border border-neutral-300 dark:border-neutral-700'}`}
          >
            {t('household.joinTitle')}
          </button>
        </div>

        {mode === 'create' ? (
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {t('household.householdNameLabel')}
              </span>
              <input
                required
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {t('household.memberNameLabel')}
              </span>
              <input
                required
                value={memberDisplayName}
                onChange={(e) => setMemberDisplayName(e.target.value)}
                className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {t('household.dogNameLabel')}
              </span>
              <input
                required
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </label>
            <button
              type="submit"
              className="rounded bg-neutral-900 px-3 py-2 text-white dark:bg-white dark:text-neutral-900"
            >
              {t('household.createButton')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoin} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {t('household.inviteCodeLabel')}
              </span>
              <input
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="rounded border border-neutral-300 px-3 py-2 uppercase dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {t('household.memberNameLabel')}
              </span>
              <input
                required
                value={memberDisplayName}
                onChange={(e) => setMemberDisplayName(e.target.value)}
                className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </label>
            <button
              type="submit"
              className="rounded bg-neutral-900 px-3 py-2 text-white dark:bg-white dark:text-neutral-900"
            >
              {t('household.joinButton')}
            </button>
          </form>
        )}

        {error && <p className="text-center text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    </div>
  )
}
