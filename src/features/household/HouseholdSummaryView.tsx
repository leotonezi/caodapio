import { useState } from 'react'
import { supabaseHouseholdRepository } from '../../data/supabase/household-repository'
import type { HouseholdSummary } from '../../data/repositories/household'
import { t } from '../../i18n/pt-BR'

export function HouseholdSummaryView({ household }: { household: HouseholdSummary }) {
  const [inviteCode, setInviteCode] = useState<string | null>(null)

  async function handleGenerateInvite() {
    const code = await supabaseHouseholdRepository.createInvite(household.id)
    setInviteCode(code)
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-white px-4 py-10 dark:bg-neutral-900">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">{household.name}</h1>

      <section className="w-full max-w-sm">
        <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {t('household.dogLabel')}
        </h2>
        <p className="text-neutral-900 dark:text-white">{household.dogName}</p>
      </section>

      <section className="w-full max-w-sm">
        <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {t('household.membersTitle')}
        </h2>
        <ul className="text-neutral-900 dark:text-white">
          {household.members.map((member) => (
            <li key={member.userId}>{member.displayName}</li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        onClick={handleGenerateInvite}
        className="rounded bg-neutral-900 px-3 py-2 text-white dark:bg-white dark:text-neutral-900"
      >
        {t('household.generateInviteButton')}
      </button>
      {inviteCode && (
        <p className="font-mono text-lg text-neutral-900 dark:text-white">{inviteCode}</p>
      )}
    </div>
  )
}
