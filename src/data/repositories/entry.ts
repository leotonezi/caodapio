export interface EntryRecord {
  id: string
  itemId: string
  grams: number
  meal: 1 | 2 | 3
  loggedBy: string
}

export interface CreateEntryInput {
  dogId: string
  planId: string
  date: string
  itemId: string
  grams: number
  meal: 1 | 2 | 3
}

export interface EntryRepository {
  listForDay(dogId: string, date: string): Promise<EntryRecord[]>
  create(input: CreateEntryInput): Promise<EntryRecord>
  updateGrams(id: string, grams: number): Promise<void>
  remove(id: string): Promise<void>
}
