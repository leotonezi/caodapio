export interface SettingsRepository {
  getOrInitFoodDogStartDate(householdId: string, defaultDate: string): Promise<string>
}
