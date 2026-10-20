export interface SupplementCheckRepository {
  isCheckedToday(dogId: string, date: string, itemId: string): Promise<boolean>
  check(dogId: string, date: string, itemId: string): Promise<void>
  uncheck(dogId: string, date: string, itemId: string): Promise<void>
}
