import type { SupplementCheckRepository } from '../repositories/supplementCheck'
import { supabase } from './client'

export const supabaseSupplementCheckRepository: SupplementCheckRepository = {
  async isCheckedToday(dogId: string, date: string, itemId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('supplement_checks')
      .select('id')
      .eq('dog_id', dogId)
      .eq('date', date)
      .eq('item_id', itemId)
      .is('deleted_at', null)
      .limit(1)
    if (error) throw error
    return (data?.length ?? 0) > 0
  },

  async check(dogId: string, date: string, itemId: string): Promise<void> {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!userData.user) throw new Error('must be authenticated to check a supplement')

    const { error } = await supabase.from('supplement_checks').insert({
      id: crypto.randomUUID(),
      dog_id: dogId,
      date,
      item_id: itemId,
      checked_by: userData.user.id,
    })
    if (error) throw error
  },

  async uncheck(dogId: string, date: string, itemId: string): Promise<void> {
    const { error } = await supabase
      .from('supplement_checks')
      .update({ deleted_at: new Date().toISOString() })
      .eq('dog_id', dogId)
      .eq('date', date)
      .eq('item_id', itemId)
      .is('deleted_at', null)
    if (error) throw error
  },
}
