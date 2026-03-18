// This file will be replaced by: npx supabase gen types typescript --linked
// After Supabase project is linked and migrations are pushed (Task 4)
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Convenience type helper (will be populated after Task 4)
export type Tables<T extends string> = Record<string, unknown>
