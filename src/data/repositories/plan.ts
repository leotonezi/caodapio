import type { Plan } from '../../core/plan/schema'

export interface PlanRepository {
  getActivePlan(dogId: string, onDate: string): Promise<{ planId: string; plan: Plan }>
}
