import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { foodDogDoseGrams } from '../../core/supplements'
import { getDayKey } from '../../core/time'
import type { Plan } from '../../core/plan/schema'
import type { EntryRecord } from '../../data/repositories/entry'
import type { HouseholdSummary } from '../../data/repositories/household'
import { supabaseEntryRepository } from '../../data/supabase/entry-repository'
import { supabaseHouseholdRepository } from '../../data/supabase/household-repository'
import { supabasePlanRepository } from '../../data/supabase/plan-repository'
import { supabaseSettingsRepository } from '../../data/supabase/settings-repository'
import { supabaseSupplementCheckRepository } from '../../data/supabase/supplement-check-repository'
import { t } from '../../i18n/pt-BR'
import { CategorySection } from './CategorySection'
import { EntryList } from './EntryList'
import { FoodDogCard } from './FoodDogCard'
import { MealSelector } from './MealSelector'
import { ScalarCategorySection } from './ScalarCategorySection'

const FOOD_DOG_ITEM_ID = 'food-dog'
const LARD_ITEM_ID = 'lard'
const TREATS_ITEM_ID = 'treats'

interface HojeData {
  planId: string
  plan: Plan
  entries: EntryRecord[]
  foodDogChecked: boolean
  foodDogStartDate: string
}

export function HojePage({ household, userId }: { household: HouseholdSummary; userId: string }) {
  const [meal, setMeal] = useState<1 | 2 | 3>(1)
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const dateKey = getDayKey(new Date())
  const queryKey = ['hoje', household.dogId, dateKey]

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async (): Promise<HojeData> => {
      const [{ planId, plan }, entries, foodDogChecked, foodDogStartDate] = await Promise.all([
        supabasePlanRepository.getActivePlan(household.dogId, dateKey),
        supabaseEntryRepository.listForDay(household.dogId, dateKey),
        supabaseSupplementCheckRepository.isCheckedToday(household.dogId, dateKey, FOOD_DOG_ITEM_ID),
        supabaseSettingsRepository.getOrInitFoodDogStartDate(household.id, dateKey),
      ])
      return { planId, plan, entries, foodDogChecked, foodDogStartDate }
    },
  })

  async function withOptimisticUpdate(updater: (previous: HojeData) => HojeData) {
    await queryClient.cancelQueries({ queryKey })
    const previous = queryClient.getQueryData<HojeData>(queryKey)
    if (previous) queryClient.setQueryData<HojeData>(queryKey, updater(previous))
    return { previous }
  }

  function rollback(context: { previous?: HojeData } | undefined) {
    if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
  }

  const createEntry = useMutation({
    mutationFn: (input: { itemId: string; grams: number }) =>
      supabaseEntryRepository.create({
        dogId: household.dogId,
        planId: data!.planId,
        date: dateKey,
        itemId: input.itemId,
        grams: input.grams,
        meal,
      }),
    onMutate: (input) =>
      withOptimisticUpdate((previous) => ({
        ...previous,
        entries: [
          ...previous.entries,
          {
            id: `optimistic-${crypto.randomUUID()}`,
            itemId: input.itemId,
            grams: input.grams,
            meal,
            loggedBy: userId,
          },
        ],
      })),
    onError: (_err, _input, context) => rollback(context),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const editEntry = useMutation({
    mutationFn: (input: { id: string; grams: number }) =>
      supabaseEntryRepository.updateGrams(input.id, input.grams),
    onMutate: (input) =>
      withOptimisticUpdate((previous) => ({
        ...previous,
        entries: previous.entries.map((e) => (e.id === input.id ? { ...e, grams: input.grams } : e)),
      })),
    onError: (_err, _input, context) => rollback(context),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const deleteEntry = useMutation({
    mutationFn: (id: string) => supabaseEntryRepository.remove(id),
    onMutate: (id) =>
      withOptimisticUpdate((previous) => ({
        ...previous,
        entries: previous.entries.filter((e) => e.id !== id),
      })),
    onError: (_err, _id, context) => rollback(context),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const toggleFoodDog = useMutation({
    mutationFn: (checked: boolean) =>
      checked
        ? supabaseSupplementCheckRepository.check(household.dogId, dateKey, FOOD_DOG_ITEM_ID)
        : supabaseSupplementCheckRepository.uncheck(household.dogId, dateKey, FOOD_DOG_ITEM_ID),
    onMutate: (checked) =>
      withOptimisticUpdate((previous) => ({ ...previous, foodDogChecked: checked })),
    onError: (_err, _checked, context) => rollback(context),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  async function handleGenerateInvite() {
    const code = await supabaseHouseholdRepository.createInvite(household.id)
    setInviteCode(code)
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-900">
        <p className="text-neutral-600 dark:text-neutral-400">{t('hoje.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-900">
        <p className="text-red-600 dark:text-red-400">{t('hoje.loadError')}</p>
      </div>
    )
  }

  const { plan, entries, foodDogChecked, foodDogStartDate } = data
  const memberNamesById = new Map(household.members.map((m) => [m.userId, m.displayName]))
  const itemLabelsById = new Map([
    ...plan.categories.carb.items.map((i) => [i.id, i.label] as const),
    ...plan.categories.protein.items.map((i) => [i.id, i.label] as const),
    ...plan.categories.vegetables.items.map((i) => [i.id, i.label] as const),
    [LARD_ITEM_ID, t('hoje.category.lard')] as const,
    [TREATS_ITEM_ID, t('hoje.category.treats')] as const,
  ])

  const entriesByItem = (items: string[]) =>
    entries.filter((e) => items.includes(e.itemId))

  const doseGrams = foodDogDoseGrams(
    new Date(),
    new Date(`${foodDogStartDate}T00:00:00`),
    plan.categories.foodDog.fullDoseGrams,
  )

  return (
    <div className="flex flex-col gap-6 bg-white px-4 py-6 dark:bg-neutral-900">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            {household.name}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{household.dogName}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={handleGenerateInvite}
            className="rounded border border-neutral-300 px-3 py-1 text-sm dark:border-neutral-700"
          >
            {t('household.generateInviteButton')}
          </button>
          {inviteCode && <p className="font-mono text-sm text-neutral-900 dark:text-white">{inviteCode}</p>}
        </div>
      </header>

      <MealSelector meal={meal} onChange={setMeal} />

      <CategorySection
        categoryKey="carb"
        title={t('hoje.category.carb')}
        items={plan.categories.carb.items}
        entries={entriesByItem(plan.categories.carb.items.map((i) => i.id))}
        onLog={(itemId, grams) => createEntry.mutate({ itemId, grams })}
      />
      <CategorySection
        categoryKey="protein"
        title={t('hoje.category.protein')}
        items={plan.categories.protein.items}
        entries={entriesByItem(plan.categories.protein.items.map((i) => i.id))}
        onLog={(itemId, grams) => createEntry.mutate({ itemId, grams })}
      />
      <CategorySection
        categoryKey="vegetables"
        title={t('hoje.category.vegetables')}
        items={plan.categories.vegetables.items}
        entries={entriesByItem(plan.categories.vegetables.items.map((i) => i.id))}
        vegRange={{
          minTypes: plan.categories.vegetables.minTypes,
          maxTypes: plan.categories.vegetables.maxTypes,
        }}
        onLog={(itemId, grams) => createEntry.mutate({ itemId, grams })}
      />
      <ScalarCategorySection
        categoryKey="lard"
        title={t('hoje.category.lard')}
        itemId={LARD_ITEM_ID}
        targetGrams={plan.categories.lard.targetGrams}
        entries={entriesByItem([LARD_ITEM_ID])}
        onLog={(itemId, grams) => createEntry.mutate({ itemId, grams })}
      />
      <ScalarCategorySection
        categoryKey="treats"
        title={t('hoje.category.treats')}
        itemId={TREATS_ITEM_ID}
        targetGrams={plan.categories.treats.limitGrams}
        entries={entriesByItem([TREATS_ITEM_ID])}
        onLog={(itemId, grams) => createEntry.mutate({ itemId, grams })}
      />
      <FoodDogCard
        doseGrams={doseGrams}
        checked={foodDogChecked}
        onToggle={(checked) => toggleFoodDog.mutate(checked)}
      />

      <EntryList
        entries={entries}
        itemLabelsById={itemLabelsById}
        memberNamesById={memberNamesById}
        onEdit={(id, grams) => editEntry.mutate({ id, grams })}
        onDelete={(id) => deleteEntry.mutate(id)}
      />
    </div>
  )
}
