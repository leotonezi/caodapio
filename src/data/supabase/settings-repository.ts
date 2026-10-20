import type { SettingsRepository } from '../repositories/settings'
import { supabase } from './client'

export const supabaseSettingsRepository: SettingsRepository = {
  async getOrInitFoodDogStartDate(householdId: string, defaultDate: string): Promise<string> {
    const { data, error } = await supabase
      .from('settings')
      .select('food_dog_start_date')
      .eq('household_id', householdId)
      .single()
    if (error) throw error

    if (data.food_dog_start_date) return data.food_dog_start_date

    const { error: updateError } = await supabase
      .from('settings')
      .update({ food_dog_start_date: defaultDate })
      .eq('household_id', householdId)
    if (updateError) throw updateError

    return defaultDate
  },
}
