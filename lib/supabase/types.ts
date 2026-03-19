export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
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
      campaign_pages: {
        Row: {
          campaign_id: string | null
          clicks: number | null
          cost: number
          created_at: string | null
          id: string
          impressions: number | null
          notes: string | null
          page_id: string | null
          posted_at: string | null
          reach: number | null
          scheduled_date: string | null
          screenshot_url: string | null
          status: string
        }
        Insert: {
          campaign_id?: string | null
          clicks?: number | null
          cost: number
          created_at?: string | null
          id?: string
          impressions?: number | null
          notes?: string | null
          page_id?: string | null
          posted_at?: string | null
          reach?: number | null
          scheduled_date?: string | null
          screenshot_url?: string | null
          status?: string
        }
        Update: {
          campaign_id?: string | null
          clicks?: number | null
          cost?: number
          created_at?: string | null
          id?: string
          impressions?: number | null
          notes?: string | null
          page_id?: string | null
          posted_at?: string | null
          reach?: number | null
          scheduled_date?: string | null
          screenshot_url?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_pages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_pages_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "page_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_pages_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          ad_caption: string | null
          ad_content_url: string | null
          ad_link: string | null
          client_id: string | null
          client_pays: number
          created_at: string | null
          end_date: string | null
          id: string
          name: string
          notes: string | null
          start_date: string | null
          status: string
          total_clicks: number | null
          total_conversions: number | null
          total_impressions: number | null
          total_page_cost: number | null
          total_reach: number | null
          updated_at: string | null
          your_margin: number | null
        }
        Insert: {
          ad_caption?: string | null
          ad_content_url?: string | null
          ad_link?: string | null
          client_id?: string | null
          client_pays: number
          created_at?: string | null
          end_date?: string | null
          id?: string
          name: string
          notes?: string | null
          start_date?: string | null
          status?: string
          total_clicks?: number | null
          total_conversions?: number | null
          total_impressions?: number | null
          total_page_cost?: number | null
          total_reach?: number | null
          updated_at?: string | null
          your_margin?: number | null
        }
        Update: {
          ad_caption?: string | null
          ad_content_url?: string | null
          ad_link?: string | null
          client_id?: string | null
          client_pays?: number
          created_at?: string | null
          end_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          start_date?: string | null
          status?: string
          total_clicks?: number | null
          total_conversions?: number | null
          total_impressions?: number | null
          total_page_cost?: number | null
          total_reach?: number | null
          updated_at?: string | null
          your_margin?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profitability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          communication_channel: string
          communication_handle: string | null
          company: string | null
          contact_name: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string
          total_spent: number | null
          updated_at: string | null
        }
        Insert: {
          communication_channel?: string
          communication_handle?: string | null
          company?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          total_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          communication_channel?: string
          communication_handle?: string | null
          company?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          total_spent?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          avg_cpm: number | null
          avg_engagement_rate: number | null
          communication_channel: string
          communication_handle: string | null
          contact_name: string | null
          created_at: string | null
          follower_count: number | null
          handle: string
          id: string
          niche: string | null
          notes: string | null
          payment_details: string | null
          payment_method: string | null
          reliability_score: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          avg_cpm?: number | null
          avg_engagement_rate?: number | null
          communication_channel?: string
          communication_handle?: string | null
          contact_name?: string | null
          created_at?: string | null
          follower_count?: number | null
          handle: string
          id?: string
          niche?: string | null
          notes?: string | null
          payment_details?: string | null
          payment_method?: string | null
          reliability_score?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          avg_cpm?: number | null
          avg_engagement_rate?: number | null
          communication_channel?: string
          communication_handle?: string | null
          contact_name?: string | null
          created_at?: string | null
          follower_count?: number | null
          handle?: string
          id?: string
          niche?: string | null
          notes?: string | null
          payment_details?: string | null
          payment_method?: string | null
          reliability_score?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_networks: {
        Row: {
          account_label: string
          balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          notes: string | null
          platform: string
        }
        Insert: {
          account_label: string
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          platform: string
        }
        Update: {
          account_label?: string
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          platform?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          campaign_id: string | null
          client_id: string | null
          created_at: string | null
          currency: string
          direction: string
          due_date: string | null
          id: string
          notes: string | null
          page_id: string | null
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          status: string
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          client_id?: string | null
          created_at?: string | null
          currency?: string
          direction: string
          due_date?: string | null
          id?: string
          notes?: string | null
          page_id?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          client_id?: string | null
          created_at?: string | null
          currency?: string
          direction?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          page_id?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profitability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "page_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      client_profitability: {
        Row: {
          avg_margin_per_campaign: number | null
          contact_name: string | null
          id: string | null
          name: string | null
          total_campaigns: number | null
          total_margin: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
      dashboard_summary: {
        Row: {
          active_campaigns: number | null
          active_clients: number | null
          active_pages: number | null
          margin_this_month: number | null
          pending_incoming: number | null
          pending_outgoing: number | null
          revenue_this_month: number | null
        }
        Relationships: []
      }
      page_performance: {
        Row: {
          avg_cost: number | null
          avg_impressions: number | null
          avg_reach: number | null
          campaigns_run: number | null
          follower_count: number | null
          handle: string | null
          id: string | null
          niche: string | null
          reliability_score: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
