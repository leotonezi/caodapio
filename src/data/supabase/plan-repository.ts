import { validatePlan } from '../../core/plan/schema'
import type { PlanRepository } from '../repositories/plan'
import { supabase } from './client'

export const supabasePlanRepository: PlanRepository = {
  async getActivePlan(dogId: string, onDate: string) {
    const { data, error } = await supabase
      .from('plans')
      .select('id, document')
      .eq('dog_id', dogId)
      .lte('valid_from', onDate)
      .gte('valid_to', onDate)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error) throw error
    if (!data) throw new Error('no active plan found for this dog on this date')

    return { planId: data.id, plan: validatePlan(data.document) }
  },
}
