import type {
  CreateHouseholdInput,
  HouseholdRepository,
  HouseholdSummary,
  JoinHouseholdInput,
} from '../repositories/household'
import { SEED_PLAN } from '../../core/plan/seed'
import { supabase } from './client'

const INVITE_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const INVITE_CODE_LENGTH = 6
const INVITE_EXPIRY_DAYS = 7

function generateInviteCode(): string {
  let code = ''
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    code += INVITE_CODE_ALPHABET[Math.floor(Math.random() * INVITE_CODE_ALPHABET.length)]
  }
  return code
}

export const supabaseHouseholdRepository: HouseholdRepository = {
  async getMyHousehold(): Promise<HouseholdSummary | null> {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!userData.user) return null

    const { data: membership, error: membershipError } = await supabase
      .from('household_members')
      .select('household_id, households(name)')
      .eq('user_id', userData.user.id)
      .maybeSingle()
    if (membershipError) throw membershipError
    if (!membership) return null

    const householdId = membership.household_id

    const [{ data: members, error: membersError }, { data: dogs, error: dogsError }] =
      await Promise.all([
        supabase
          .from('household_members')
          .select('user_id, display_name')
          .eq('household_id', householdId),
        supabase.from('dogs').select('name').eq('household_id', householdId).limit(1),
      ])
    if (membersError) throw membersError
    if (dogsError) throw dogsError

    return {
      id: householdId,
      name: membership.households.name,
      dogName: dogs?.[0]?.name ?? '',
      members: (members ?? []).map((m) => ({
        userId: m.user_id,
        displayName: m.display_name,
      })),
    }
  },

  async createHousehold(input: CreateHouseholdInput): Promise<string> {
    const { data, error } = await supabase.rpc('create_household', {
      household_name: input.householdName,
      member_display_name: input.memberDisplayName,
      dog_name: input.dogName,
      plan_document: SEED_PLAN,
      plan_valid_from: SEED_PLAN.validFrom,
      plan_valid_to: SEED_PLAN.validTo,
      plan_vet_name: SEED_PLAN.vetName,
    })
    if (error) throw error
    return data
  },

  async createInvite(householdId: string): Promise<string> {
    const code = generateInviteCode()
    const expiresAt = new Date(Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
    const { error } = await supabase.from('household_invites').insert({
      household_id: householdId,
      code,
      expires_at: expiresAt.toISOString(),
    })
    if (error) throw error
    return code
  },

  async joinWithInvite(input: JoinHouseholdInput): Promise<string> {
    const { data, error } = await supabase.rpc('join_household_with_invite', {
      invite_code: input.code,
      member_display_name: input.memberDisplayName,
    })
    if (error) throw error
    return data
  },
}
