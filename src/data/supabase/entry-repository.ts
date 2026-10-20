import type { CreateEntryInput, EntryRecord, EntryRepository } from '../repositories/entry'
import { supabase } from './client'

export const supabaseEntryRepository: EntryRepository = {
  async listForDay(dogId: string, date: string): Promise<EntryRecord[]> {
    const { data, error } = await supabase
      .from('entries')
      .select('id, item_id, grams, meal, logged_by')
      .eq('dog_id', dogId)
      .eq('date', date)
      .is('deleted_at', null)
    if (error) throw error

    return (data ?? []).map((row) => ({
      id: row.id,
      itemId: row.item_id,
      grams: Number(row.grams),
      meal: row.meal as 1 | 2 | 3,
      loggedBy: row.logged_by,
    }))
  },

  async create(input: CreateEntryInput): Promise<EntryRecord> {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!userData.user) throw new Error('must be authenticated to log an entry')

    const { data, error } = await supabase
      .from('entries')
      .insert({
        id: crypto.randomUUID(),
        dog_id: input.dogId,
        plan_id: input.planId,
        date: input.date,
        item_id: input.itemId,
        grams: input.grams,
        meal: input.meal,
        logged_by: userData.user.id,
      })
      .select('id, item_id, grams, meal, logged_by')
      .single()
    if (error) throw error

    return {
      id: data.id,
      itemId: data.item_id,
      grams: Number(data.grams),
      meal: data.meal as 1 | 2 | 3,
      loggedBy: data.logged_by,
    }
  },

  async updateGrams(id: string, grams: number): Promise<void> {
    const { error } = await supabase
      .from('entries')
      .update({ grams, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('entries')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },
}
