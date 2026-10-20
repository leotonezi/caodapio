export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      dogs: {
        Row: {
          birth_date: string | null
          breed: string | null
          created_at: string
          household_id: string
          id: string
          name: string
        }
        ComputedFields: never
        Insert: {
          birth_date?: string | null
          breed?: string | null
          created_at?: string
          household_id: string
          id?: string
          name: string
        }
        Update: {
          birth_date?: string | null
          breed?: string | null
          created_at?: string
          household_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: 'dogs_household_id_fkey'
            columns: ['household_id']
            isOneToOne: false
            referencedRelation: 'households'
            referencedColumns: ['id']
          },
        ]
      }
      entries: {
        Row: {
          created_at: string
          date: string
          deleted_at: string | null
          dog_id: string
          grams: number
          id: string
          item_id: string
          logged_by: string
          meal: number
          plan_id: string
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          date: string
          deleted_at?: string | null
          dog_id: string
          grams: number
          id: string
          item_id: string
          logged_by: string
          meal: number
          plan_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          deleted_at?: string | null
          dog_id?: string
          grams?: number
          id?: string
          item_id?: string
          logged_by?: string
          meal?: number
          plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'entries_dog_id_fkey'
            columns: ['dog_id']
            isOneToOne: false
            referencedRelation: 'dogs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'entries_plan_id_fkey'
            columns: ['plan_id']
            isOneToOne: false
            referencedRelation: 'plans'
            referencedColumns: ['id']
          },
        ]
      }
      household_invites: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          household_id: string
          id: string
          used_by: string | null
        }
        ComputedFields: never
        Insert: {
          code: string
          created_at?: string
          expires_at: string
          household_id: string
          id?: string
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          household_id?: string
          id?: string
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'household_invites_household_id_fkey'
            columns: ['household_id']
            isOneToOne: false
            referencedRelation: 'households'
            referencedColumns: ['id']
          },
        ]
      }
      household_members: {
        Row: {
          display_name: string
          household_id: string
          joined_at: string
          user_id: string
        }
        ComputedFields: never
        Insert: {
          display_name: string
          household_id: string
          joined_at?: string
          user_id: string
        }
        Update: {
          display_name?: string
          household_id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'household_members_household_id_fkey'
            columns: ['household_id']
            isOneToOne: false
            referencedRelation: 'households'
            referencedColumns: ['id']
          },
        ]
      }
      households: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string
          created_by: string
          document: NonNullable<Json>
          dog_id: string
          id: string
          valid_from: string
          valid_to: string
          version: number
          vet_name: string
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          created_by: string
          document: NonNullable<Json>
          dog_id: string
          id?: string
          valid_from: string
          valid_to: string
          version: number
          vet_name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          document?: NonNullable<Json>
          dog_id?: string
          id?: string
          valid_from?: string
          valid_to?: string
          version?: number
          vet_name?: string
        }
        Relationships: [
          {
            foreignKeyName: 'plans_dog_id_fkey'
            columns: ['dog_id']
            isOneToOne: false
            referencedRelation: 'dogs'
            referencedColumns: ['id']
          },
        ]
      }
      prices: {
        Row: {
          cooking_loss_pct: number
          household_id: string
          id: string
          item_id: string
          price_per_kg: number
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          cooking_loss_pct?: number
          household_id: string
          id?: string
          item_id: string
          price_per_kg: number
          updated_at?: string
        }
        Update: {
          cooking_loss_pct?: number
          household_id?: string
          id?: string
          item_id?: string
          price_per_kg?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'prices_household_id_fkey'
            columns: ['household_id']
            isOneToOne: false
            referencedRelation: 'households'
            referencedColumns: ['id']
          },
        ]
      }
      settings: {
        Row: {
          food_dog_start_date: string | null
          household_id: string
          over_target_threshold_pct: number
          protein_rule: string
        }
        ComputedFields: never
        Insert: {
          food_dog_start_date?: string | null
          household_id: string
          over_target_threshold_pct?: number
          protein_rule?: string
        }
        Update: {
          food_dog_start_date?: string | null
          household_id?: string
          over_target_threshold_pct?: number
          protein_rule?: string
        }
        Relationships: [
          {
            foreignKeyName: 'settings_household_id_fkey'
            columns: ['household_id']
            isOneToOne: true
            referencedRelation: 'households'
            referencedColumns: ['id']
          },
        ]
      }
      supplement_checks: {
        Row: {
          checked_by: string
          created_at: string
          date: string
          deleted_at: string | null
          dog_id: string
          id: string
          item_id: string
        }
        ComputedFields: never
        Insert: {
          checked_by: string
          created_at?: string
          date: string
          deleted_at?: string | null
          dog_id: string
          id: string
          item_id: string
        }
        Update: {
          checked_by?: string
          created_at?: string
          date?: string
          deleted_at?: string | null
          dog_id?: string
          id?: string
          item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'supplement_checks_dog_id_fkey'
            columns: ['dog_id']
            isOneToOne: false
            referencedRelation: 'dogs'
            referencedColumns: ['id']
          },
        ]
      }
      weights: {
        Row: {
          dog_id: string
          id: string
          kg: number
          logged_by: string
          measured_at: string
          note: string | null
        }
        ComputedFields: never
        Insert: {
          dog_id: string
          id?: string
          kg: number
          logged_by: string
          measured_at: string
          note?: string | null
        }
        Update: {
          dog_id?: string
          id?: string
          kg?: number
          logged_by?: string
          measured_at?: string
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'weights_dog_id_fkey'
            columns: ['dog_id']
            isOneToOne: false
            referencedRelation: 'dogs'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_household: {
        Args: {
          dog_name: string
          household_name: string
          member_display_name: string
          plan_document: Json
          plan_valid_from: string
          plan_valid_to: string
          plan_vet_name: string
        }
        Returns: string
      }
      dog_household_id: { Args: { target_dog_id: string }; Returns: string }
      is_household_member: {
        Args: { target_household_id: string }
        Returns: boolean
      }
      join_household_with_invite: {
        Args: { invite_code: string; member_display_name: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
