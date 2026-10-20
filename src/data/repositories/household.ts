export interface HouseholdMember {
  userId: string
  displayName: string
}

export interface HouseholdSummary {
  id: string
  name: string
  dogId: string
  dogName: string
  members: HouseholdMember[]
}

export interface CreateHouseholdInput {
  householdName: string
  memberDisplayName: string
  dogName: string
}

export interface JoinHouseholdInput {
  code: string
  memberDisplayName: string
}

export interface HouseholdRepository {
  getMyHousehold(): Promise<HouseholdSummary | null>
  createHousehold(input: CreateHouseholdInput): Promise<string>
  createInvite(householdId: string): Promise<string>
  joinWithInvite(input: JoinHouseholdInput): Promise<string>
}
