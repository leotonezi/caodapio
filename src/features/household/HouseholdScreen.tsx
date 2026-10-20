import { useCallback, useEffect, useState } from 'react'
import { supabaseHouseholdRepository } from '../../data/supabase/household-repository'
import type { HouseholdSummary } from '../../data/repositories/household'
import { t } from '../../i18n/pt-BR'
import { CreateOrJoinForm } from './CreateOrJoinForm'
import { HouseholdSummaryView } from './HouseholdSummaryView'

export function HouseholdScreen() {
  const [household, setHousehold] = useState<HouseholdSummary | null | 'loading'>('loading')

  const reload = useCallback(() => {
    setHousehold('loading')
    supabaseHouseholdRepository.getMyHousehold().then(setHousehold)
  }, [])

  useEffect(() => {
    supabaseHouseholdRepository.getMyHousehold().then(setHousehold)
  }, [])

  if (household === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-900">
        <p className="text-neutral-600 dark:text-neutral-400">{t('household.loading')}</p>
      </div>
    )
  }

  if (household === null) {
    return <CreateOrJoinForm onDone={reload} />
  }

  return <HouseholdSummaryView household={household} />
}
